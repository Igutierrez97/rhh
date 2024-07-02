// app/api/excel/route.js
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import {prisma} from "@/libs/prisma"

interface PayProps {
  params: {
    id: string;
  };
}

const meses = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

export async function POST(request: Request, { params }: PayProps) {
  const { id } = params;

  try {
    const { totalDinero }: { totalDinero: number; fondo: number } = await request.json();

    console.log(id, totalDinero);

    // Buscar el documento en la base de datos usando Prisma
    const document = await prisma.file.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Documento no encontrado' }, { status: 404 });
    }

    // Obtener la ruta del archivo desde la base de datos
    const filePath = path.join(process.cwd(), 'public', document.path);

    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Archivo no encontrado en el sistema de archivos' }, { status: 404 });
    }

    // Leer el archivo Excel
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Modificar el contenido del archivo
    const worksheet = workbook.worksheets[0];

    // Obtener los datos necesarios
    const nombres: string[] = [];
    const indicadores: number[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber >= 6) { // A partir de la fila 6
        const nombre = row.getCell('B').value as string | undefined;
        const indicadorCell = row.getCell('E').value;
        let indicador: number;

        if (typeof indicadorCell === 'string') {
          indicador = parseFloat(indicadorCell);
        } else if (typeof indicadorCell === 'number') {
          indicador = indicadorCell;
        } else {
          indicador = NaN;
        }

        if (nombre && !isNaN(indicador)) {
          nombres.push(nombre);
          indicadores.push(indicador);
        }
      }
    });

    // Calcular los pagos
    const sumaIndicadores = indicadores.reduce((acc, val) => acc + val, 0);
    const pagos = indicadores.map(indicador => parseFloat(((indicador / sumaIndicadores) * totalDinero).toFixed(2)));
    const porcentajes = indicadores.map(indicador => parseFloat(((indicador / sumaIndicadores) * 100).toFixed(2)));

    // Escribir los resultados en las columnas F y G
    for (let i = 0; i < nombres.length; i++) {
      const rowNumber = i + 6;
      worksheet.getCell(`F${rowNumber}`).value = pagos[i];
      worksheet.getCell(`G${rowNumber}`).value = `${porcentajes[i]}%`;
    }

    // Modificar las celdas A2, E2 y G2
    const departamento = document.depar; // Asegúrate de que 'departamento' está en tu esquema de Prisma
    const fecha = new Date(document.createdAt); // Asegúrate de que 'fecha' está en tu esquema de Prisma
    const mes = meses[fecha.getMonth()];

    worksheet.getCell('A2').value = {
      richText: [
        { text: 'UNIDAD ORGANIZATIVA:' },
        { text: departamento.toLocaleUpperCase(), font: { bold: true, underline: true } }
      ]
    }
    worksheet.getCell('E2').value = {
      richText: [
        { text: 'MES: ' },
        { text: mes.toLocaleUpperCase(), font: { bold: true, underline: true } }
      ]
    };
    worksheet.getCell('G2').value = {
      richText: [
        { text: 'FONDO DE SALARIO NO UTILIZADO A DISTRIBUIR:' },
        { text: totalDinero.toString().toLocaleUpperCase(), font: { bold: true, underline: true } }
      ]
    };

    // Guardar el archivo modificado
    await workbook.xlsx.writeFile(filePath);

    // Actualizar el estado del archivo a "pagado" en la base de datos
    await prisma.file.update({
      where: { id },
      data: { status: 'pagado' },
    });

    return NextResponse.json({ message: 'Archivo modificado exitosamente y estado actualizado a pagado' });
  } catch (error) {
    console.error('Error al modificar el archivo:', error);
    return NextResponse.json({ error: 'Error al modificar el archivo' }, { status: 500 });
  }
}