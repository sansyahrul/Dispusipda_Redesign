import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface TujuanPayload {
  judul_tujuan: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const judul_tujuan = formData.get("judul_tujuan");
    const tanggal_publish = formData.get("tanggal_publish");
    const jam_publish = formData.get("jam_publish");
    const jenis_berita = formData.get("jenis_berita");
    const id_kategori = formData.get("id_kategori");
    const isi = formData.get("isi");

    const payload: TujuanPayload = {
      judul_tujuan: (judul_tujuan instanceof File ? "" : judul_tujuan) ?? "",
      tanggal_publish:
        (tanggal_publish instanceof File ? "" : tanggal_publish) ?? "",
      jam_publish: (jam_publish instanceof File ? "" : jam_publish) ?? "",
      jenis_berita: (jenis_berita instanceof File ? "" : jenis_berita) ?? "",
      id_kategori: (id_kategori instanceof File ? "" : id_kategori) ?? "",
      isi: (isi instanceof File ? "" : isi) ?? "",
    };

    // Gambar optional
    const file = formData.get("gambar");
    const gambar = file instanceof File ? file : null;

    let gambar_url: string | null = null;

    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");

      await writeFile(path.join(uploadDir, gambar.name), buffer);
      gambar_url = `/uploads/${gambar.name}`;
    }

    const hero = await prisma.tujuan.create({
      data: {
        judul_tujuan: payload.judul_tujuan,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        gambar_url, // bisa null
      },
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");

    const whereClause = kategori ? { id_kategori: Number(kategori) } : {};

    const data = await prisma.tujuan.findMany({
      where: whereClause,
      orderBy: { id: "desc" },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("❌ Error GET:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data Profile" },
      { status: 500 }
    );
  }
}

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

    const formData = await req.formData();

    const payload: TujuanPayload = {
      judul_tujuan: formData.get("judul_tujuan") as string,
      tanggal_publish: formData.get("tanggal_publish") as string,
      jam_publish: formData.get("jam_publish") as string,
      jenis_berita: formData.get("jenis_berita") as string,
      id_kategori: formData.get("id_kategori") as string,
      isi: (formData.get("isi") as string) ?? "",
    };

    const gambar = formData.get("gambar") as File | null;
    let gambar_url: string | undefined = undefined; // biar tidak overwrite kalau kosong

    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");

      await writeFile(path.join(uploadDir, gambar.name), buffer);
      gambar_url = `/uploads/${gambar.name}`;
    }

    const updatedTujuan = await prisma.tujuan.update({
      where: { id: Number(id) },
      data: {
        judul_tujuan: payload.judul_tujuan,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        ...(gambar_url && { gambar_url }), // hanya update gambar jika ada
      },
    });

    return NextResponse.json(updatedTujuan, { status: 200 });
  } catch (err) {
    console.error("❌ Error PUT:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data Tujuan" },
      { status: 500 }
    );
  }
}

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

    await prisma.tujuan.delete({
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
