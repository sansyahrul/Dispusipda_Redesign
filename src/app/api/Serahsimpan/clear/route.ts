import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    await prisma.serahsimpan.deleteMany();
    return NextResponse.json({ message: "✅ Semua data berhasil dihapus." });
  } catch (error) {
    console.error("Gagal hapus data:", error);
    return NextResponse.json({ error: "Gagal hapus data" }, { status: 500 });
  }
}
