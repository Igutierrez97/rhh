import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import path from 'path';
import { promises as fs } from 'fs';

interface ParamsProps {
  params: {
    id: string;
  };
}


export async function DELETE(req: Request, { params }: ParamsProps) {
  const { id } = params;

  try {
    // Primero, obtén la información del archivo a eliminar
    const file = await prisma.file.findUnique({ where: { id } });

    if (!file) {
      return NextResponse.json({ message: "Archivo no encontrado" }, { status: 400 });
    }

    // Elimina la entrada del archivo en la base de datos
    await prisma.file.delete({ where: { id } });

    // Construye la ruta completa del archivo en el sistema de archivos
    const filePath = path.join(process.cwd(), 'public', file.path);

    // Intenta eliminar el archivo del sistema de archivos
    await fs.unlink(filePath);

    return NextResponse.json(file);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ message: "Archivo no encontrado" }, { status: 400 });
    } else {
      console.error('Error eliminando archivo:', error);
      return NextResponse.json({ message: "Error Interno" }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}


