import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface ParamsProps {
  params: {
    id: string;
  };
}

interface BodyProps {
    name?:string,
    depar?:string,
    assignedToId?: string;
}

export async function DELETE(req: Request, { params }: ParamsProps) {
    const { id } = params;
    try {
      const file = await prisma.file.delete({ where: { id } });
      return NextResponse.json(file);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ message: "Archivo no encontrado" }, { status: 400 });
      } else {
        console.error('Error eliminando archivo:', error);
        return NextResponse.json({ message: "Error Interno" }, { status: 500 });
      }
    }
  }

  export async function PUT(req: Request, { params }: ParamsProps) {
    const { id } = params;
    const body: BodyProps = await req.json();
  
    try {
      // Actualizar el archivo con los nuevos datos
      const updatedFile = await prisma.file.update({
        where: { id },
        data: {
          name: body.name,
          depar: body.depar,
          assignedToId: body.assignedToId,
        },
      });
  
      // Devolver la respuesta con el archivo actualizado
      return NextResponse.json(updatedFile);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return NextResponse.json({ message: "Archivo no encontrado" }, { status: 404 });
      } else {
        console.error('Error actualizando archivo:', error);
        return NextResponse.json({ message: "Error Interno" }, { status: 500 });
      }
    }
  }