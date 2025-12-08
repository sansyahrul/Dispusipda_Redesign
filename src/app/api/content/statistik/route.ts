import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.content.groupBy({
      by: ["id_kategori"],
      _count: { id: true },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("ERROR FETCHING STATISTIK:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistik" },
      { status: 500 }
    );
  }
}
