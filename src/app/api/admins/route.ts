import { prisma } from "@/libs/prisma"
import { NextResponse } from "next/server"

//!Obtiene una lista con todos los admins del sitio
export async function GET(){
    const admins = await prisma.user.findMany({where:{role:"ADMIN"}})
    if(!admins){
        return NextResponse.json([])
    }
    return NextResponse.json(admins)
}