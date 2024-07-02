import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma"

interface ParamsProps{
    params:{
        email:string
    }
}

export async function GET(req:Request ,{params}:ParamsProps) {
    const { email } = params
    const user = await prisma.user.findUnique({
        where:{
            email
        }
    })

   return NextResponse.json(user)
}