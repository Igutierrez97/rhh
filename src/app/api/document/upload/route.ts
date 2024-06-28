import { writeFile, mkdir, access } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
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

export const POST = async (req: any) => {
  const session = await getServerSession(authOptions);

  const formData = await req.formData();

  const file = formData.get("file");
  const depa = formData.get("depa");
  const assignedTo = formData.get("assignedTo");
  console.log("departament", depa);

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  const mimeType = getMimeType(file);
  const fileExtension = getFileExtension(file.name);

  // Lista de tipos MIME y extensiones válidas para archivos de Excel
  const validMimeTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const validExtensions = [".xls", ".xlsx"];

  // Verificar si el tipo MIME y la extensión son válidos
  if (
    !validMimeTypes.includes(mimeType) ||
    !validExtensions.includes(fileExtension)
  ) {
    return NextResponse.json(
      { error: "Archivo no válido. Solo se permiten archivos de Excel." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const originalFilename = file.name.replaceAll(" ", "_");

  const directory = path.join(process.cwd(), "public", "assets");

  try {
    // Verifica si el directorio existe, y créalo si no
    await mkdir(directory, { recursive: true });

    // Generar un nombre único en caso de archivo duplicado
    const { filePath, filename: uniqueFilename } = await generateUniqueFileName(
      directory,
      originalFilename
    );

    // Escribe el archivo en el directorio especificado con el nombre único
    await writeFile(filePath, buffer);

    console.log(depa);

    if (session?.user?.email) {
      // Guardar la información del archivo en la base de datos usando Prisma
      const savedFile = await prisma.file.create({
        data: {
          name: file.name,
          path: `/assets/${uniqueFilename}`,
          depar: depa, // Usar el campo recibido del formulario
          status:"pendiente",
          assignedTo: {
            connect: {
              id: assignedTo,
            },
          },
          uploadedBy: {
            connect: {
              email: session?.user?.email,
            },
          },
        },
      });
    }

    return NextResponse.json(
      {
        
        Message: "Archivo de Excel guardado correctamente.",
        url: `/assets/${uniqueFilename}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error al guardar el archivo:", error);
    return NextResponse.json(
      { error: "Error al guardar el archivo de Excel." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
