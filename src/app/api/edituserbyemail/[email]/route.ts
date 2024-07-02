// pages/api/editUser.js
import { prisma } from "@/libs/prisma";
import argon2 from "argon2";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";


interface ParamsProps {
  params: {
    email: string;
  };
}

export async function PUT(req: Request, { params }: ParamsProps) {
  const { email } = params;
  const { name, role, password } = await req.json();

  try {
    // Check if at least one of the fields is provided
    if (!name && !role && !password) {
      return NextResponse.json({ message: 'Nothing to update' }, { status: 400 });
    }

    // Prepare the update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (password) {
      // Hash the password if provided
      const hashedPassword = await argon2.hash(password);
      updateData.password = hashedPassword;
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ message: 'Error updating user', error: errorMessage }, { status: 500 });
  }
}