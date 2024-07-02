import { prisma } from "@/libs/prisma";
import { PrismaClientRustPanicError } from "@prisma/client/runtime/library";
import { hash } from "argon2";

interface ParamProps{
  params:{
    id:string
  }
}

//!Obtener Usuario por ID
export async function GET( req:Request,  { params }: ParamProps) {

  try {
    if (!params || !params.id || !params.id[0]) {
      // Si no hay parámetro 'id' o 'params' no está definido
      const users = await prisma.user.findMany();
      return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Si hay parámetro 'id', hacer un findUnique
    const { id } = params;
    const user = await prisma.user.findUnique({
      where: { id:id[0]}, // Parseamos a entero el ID
    });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

//!Crear Usuario
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    // Validar los datos de entrada
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name ,Email and Password are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Verificar si el email ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already exists" }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Crear el nuevo usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hash(password),
        role: role || "USER", // Asignar el rol por defecto si no se proporciona
      },
    });

    const {password:_ , ...rest} = user
    
    return new Response(JSON.stringify(rest), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

//!Editar usuario
export async function PUT(request: Request, { params }: ParamProps) {
  try {
    const { id } = params;
    const { name, email, password, role } = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing user ID parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updateData: { [key: string]: any } = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== id[0]) {
        return new Response(
          JSON.stringify({ error: "Email already exists" }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      // Validar el formato del email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      updateData.email = email;
    }

    if (password !== undefined) {
      updateData.password = await hash(password);
    }

    if (role !== undefined) updateData.role = role;

    const user = await prisma.user.update({
      where: { id: id[0] },
      data: updateData,
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

//! Eliminar usuario
export async function DELETE(request: Request, { params }: any) {
 
  try {
    const { id } = params;

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: id[0] },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Eliminar el usuario de la base de datos
    await prisma.user.delete({
      where: { id: id[0] },
    });

    return new Response(
      JSON.stringify({ message: "User deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
