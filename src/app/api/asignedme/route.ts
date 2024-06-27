import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/libs/prisma"; // Asegúrate de importar prisma correctamente
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { error: "No estás autenticado" },
      { status: 401 }
    );
  }

  const email = session.user.email;

  if (typeof email !== "string") {
    return NextResponse.json(
      { error: "Correo electrónico inválido" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );
  }

  const docAssigned = await prisma.file.findMany({
    where: {
      assignedToId: user.id,
    },
    include: {
      uploadedBy: true, // Incluir datos del usuario que subió el archivo
    },
  });

  return NextResponse.json(docAssigned);
}
