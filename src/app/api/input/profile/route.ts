import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

interface ProfilePayload {
  judul_profile: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
}

// ============================
// 📤 POST — Tambah Data Profile
// ============================
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const payload: ProfilePayload = {
      judul_profile: formData.get("judul_profile") as string,
      tanggal_publish: formData.get("tanggal_publish") as string,
      jam_publish: formData.get("jam_publish") as string,
      jenis_berita: formData.get("jenis_berita") as string,
      id_kategori: formData.get("id_kategori") as string,
      isi: (formData.get("isi") as string) ?? "",
    };

    // 🖼️ Upload Gambar
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

    // 💾 Simpan ke Database
    const hero = await prisma.profile.create({
      data: {
        judul_profile: payload.judul_profile,
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

// ============================
// 📥 GET — Ambil Semua Data
// ============================
export async function GET() {
  try {
    const heroes = await prisma.profile.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(heroes, { status: 200 });
  } catch (err) {
    console.error("❌ Error GET:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data Profile" },
      { status: 500 }
    );
  }
}

// ============================
// 🗑️ DELETE — Hapus Data
// ============================
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

    await prisma.profile.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { message: "Data berhasil dihapus" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error DELETE:", err);
    return NextResponse.json(
      { error: "Gagal menghapus data Profile" },
      { status: 500 }
    );
  }
}

// ============================
// ✏️ PUT — Update Data Profile
// ============================
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan di parameter URL" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const payload: ProfilePayload = {
      judul_profile: formData.get("judul_profile") as string,
      tanggal_publish: formData.get("tanggal_publish") as string,
      jam_publish: formData.get("jam_publish") as string,
      jenis_berita: formData.get("jenis_berita") as string,
      id_kategori: formData.get("id_kategori") as string,
      isi: (formData.get("isi") as string) ?? "",
    };

    // 🖼️ Handle gambar (opsional)
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

    // 🔄 Update data di Prisma
    const updated = await prisma.profile.update({
      where: { id: Number(id) },
      data: {
        judul_profile: payload.judul_profile,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        ...(gambar_url && { gambar_url }), // hanya update gambar jika baru
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("❌ Error PUT:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data Profile" },
      { status: 500 }
    );
  }
}
