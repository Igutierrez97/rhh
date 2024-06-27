import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/libs/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);
  if (session && session.user?.email && session.user.role === "USER") {
    // Obtener el email del usuario desde la sesión
    const email = session.user.email;

    // Obtener el ID del usuario a partir del email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      // Obtener todos los documentos que ha subido el usuario incluyendo la información del usuario
      const documents = await prisma.file.findMany({
        where: {
          uploadedById: user.id,
        },
        include: {
          uploadedBy: true,
          assignedTo:true // Incluye la información del usuario
        },
      });

      // Formatear los documentos para incluir el nombre del usuario
      const formattedDocuments = documents.map(doc => ({
        ...doc,
        uploadedByName: doc.uploadedBy.name,
      }));

      return NextResponse.json(formattedDocuments);
    } else {
      return NextResponse.json({ error: "Usuario inválido" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
}
