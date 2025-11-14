import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.serahsimpan.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gagal ambil data:", error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}
