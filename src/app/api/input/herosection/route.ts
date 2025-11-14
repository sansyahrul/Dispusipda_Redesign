import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface HeroSectionPayload {
  judul_section: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
}

// 🟢 CREATE DATA (POST)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const payload: HeroSectionPayload = {
      judul_section: (formData.get("judul_section") as string) ?? "",
      tanggal_publish: (formData.get("tanggal_publish") as string) ?? "",
      jam_publish: (formData.get("jam_publish") as string) ?? "",
      jenis_berita: (formData.get("jenis_berita") as string) ?? "",
      id_kategori: (formData.get("id_kategori") as string) ?? "0",
      isi: (formData.get("isi") as string) ?? "",
    };

    const gambar = formData.get("gambar") as File | null;
    let gambar_url: string | null = null;

    if (gambar) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, gambar.name);
      await writeFile(filePath, buffer);
      gambar_url = `/uploads/${gambar.name}`;
    }

    const hero = await prisma.hero_section.create({
      data: {
        judul_section: payload.judul_section,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        gambar_url,
      },
    });

    return NextResponse.json(hero, { status: 201 });
  } catch (err) {
    console.error("❌ Error POST:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menyimpan data" },
      { status: 500 }
    );
  }
}

// 🟢 UPDATE DATA (PUT)
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID diperlukan" }, { status: 400 });
    }

    const formData = await req.formData();

    const payload: HeroSectionPayload = {
      judul_section: (formData.get("judul_section") as string) ?? "",
      tanggal_publish: (formData.get("tanggal_publish") as string) ?? "",
      jam_publish: (formData.get("jam_publish") as string) ?? "",
      jenis_berita: (formData.get("jenis_berita") as string) ?? "",
      id_kategori: (formData.get("id_kategori") as string) ?? "0",
      isi: (formData.get("isi") as string) ?? "",
    };

    const gambar = formData.get("gambar") as File | null;
    let gambar_url: string | null = null;

    if (gambar && gambar.size > 0) {
      const bytes = await gambar.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, gambar.name);
      await writeFile(filePath, buffer);
      gambar_url = `/uploads/${gambar.name}`;
    }

    const updatedHero = await prisma.hero_section.update({
      where: { id: Number(id) },
      data: {
        judul_section: payload.judul_section,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        ...(gambar_url && { gambar_url }),
      },
    });

    return NextResponse.json(updatedHero, { status: 200 });
  } catch (err) {
    console.error("❌ Error PUT:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data Hero Section" },
      { status: 500 }
    );
  }
}

// 🟢 GET ALL DATA
export async function GET() {
  try {
    const heroes = await prisma.hero_section.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(heroes, { status: 200 });
  } catch (err) {
    console.error("❌ Error GET:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data Hero Section" },
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

    await prisma.hero_section.delete({
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
