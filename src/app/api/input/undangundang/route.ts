import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UndangUndangPayload {
  judul_undang_undang: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
}

// 🟢 CREATE
export async function POST(req: NextRequest) {
  try {
    const payload: UndangUndangPayload = await req.json();

    const data = await prisma.undang_undang.create({
      data: {
        judul_undang_undang: payload.judul_undang_undang,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("❌ Error POST:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data" },
      { status: 500 }
    );
  }
}

// 🟢 READ
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kategori = searchParams.get("kategori");

  const whereClause = kategori ? { id_kategori: Number(kategori) } : {};
  const data = await prisma.undang_undang.findMany({
    where: whereClause,
    orderBy: { id: "desc" },
  });

  return NextResponse.json(data);
}

// 🟡 UPDATE (PUT)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const payload: UndangUndangPayload = await req.json();

    const updated = await prisma.undang_undang.update({
      where: { id: Number(id) },
      data: {
        judul_undang_undang: payload.judul_undang_undang,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("❌ Error PUT:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data undang-undang" },
      { status: 500 }
    );
  }
}

// 🔴 DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.undang_undang.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error DELETE:", err);
    return NextResponse.json(
      { error: "Gagal menghapus data undang-undang" },
      { status: 500 }
    );
  }
}
