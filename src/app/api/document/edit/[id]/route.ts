import { writeFile, unlink, access, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

// Función para obtener el tipo MIME de un archivo
function getMimeType(file: any) {
  return file.type;
}

// Función para obtener la extensión de un archivo
function getFileExtension(filename: any) {
  return path.extname(filename).toLowerCase();
}

// Función para generar un nombre único en caso de archivo duplicado
async function generateUniqueFileName(directory: any, originalName: any) {
  let filename = originalName.replaceAll(" ", "_");
  const ext = path.extname(filename);
  const baseName = path.basename(filename, ext);
  let count = 1;

  while (true) {
    const newName = count > 1 ? `${baseName}_${count}${ext}` : filename;
    const filePath = path.join(directory, newName);

    try {
      await access(filePath); // Intenta acceder al archivo para verificar su existencia
      count++;
    } catch (error) {
      // El archivo no existe, nombre único encontrado
      return { filePath, filename: newName };
    }
  }
}

interface ParamsProps {
  params: {
    id: string;
  };
}

export const PUT = async (req: any, { params }: ParamsProps) => {
  const formData = await req.formData();
  const fileId = params.id;

  const file = formData.get("file");
  const depa = formData.get("depa");
  const assignedTo = formData.get("assignedTo");

  if (!depa || !assignedTo) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  let filePath;
  let uniqueFilename;

  if (file && file.name) {
    const mimeType = getMimeType(file);
    const fileExtension = getFileExtension(file.name);

    // Lista de tipos MIME y extensiones válidas para archivos de Excel
    const validMimeTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const validExtensions = [".xls", ".xlsx"];

    // Verificar si el tipo MIME y la extensión son válidos
    if (!validMimeTypes.includes(mimeType) || !validExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Archivo no válido. Solo se permiten archivos de Excel." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalFilename = file.name.replaceAll(" ", "_");

    const directory = path.join(process.cwd(), "public", "assets");

    try {
      // Verificar si el directorio existe, y créalo si no
      await mkdir(directory, { recursive: true });

      // Obtener información del archivo anterior
      const existingFile = await prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!existingFile) {
        return NextResponse.json(
          { error: `Archivo con ID ${fileId} no encontrado.` },
          { status: 404 }
        );
      }

      const existingFilePath = existingFile.path
        ? path.join(process.cwd(), "public", existingFile.path)
        : null;

      // Eliminar el archivo anterior si existe
      if (existingFilePath) {
        await unlink(existingFilePath);
      }

      // Generar un nombre único para el nuevo archivo
      ({ filePath, filename: uniqueFilename } = await generateUniqueFileName(
        directory,
        originalFilename
      ));

      // Guardar el nuevo archivo
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      return NextResponse.json(
        { error: "Error al procesar el archivo de Excel." },
        { status: 500 }
      );
    }
  }

  try {
    // Actualizar la información del archivo en la base de datos usando Prisma
    const updateData: any = {
      depar: depa,
      assignedTo: {
        connect: {
          id: assignedTo,
        },
      },
    };

    if (file && file.name) {
      updateData.name = file.name;
      updateData.path = `/assets/${uniqueFilename}`;
    }

    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: updateData,
    });

    return NextResponse.json(
      {
        updatedFile,
        message: "Archivo de Excel actualizado correctamente.",
        ...(file && file.name && { url: `/assets/${uniqueFilename}` }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar el archivo:", error);
    return NextResponse.json(
      { error: "Error al actualizar el archivo de Excel." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
