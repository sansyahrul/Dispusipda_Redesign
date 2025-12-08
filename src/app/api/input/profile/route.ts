import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { writeFile, mkdir } from "fs/promises";
import path from "path";

interface ProfilePayload {
  judul_profile: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // ambil file dari form-data "gambar"
    const file = formData.get("gambar") as File | null;

    let media_url: string | null = null;
    let media_type: string | null = null;

    if (file && file.size > 0) {
      const mime = file.type;

      // validasi file
      if (!mime.startsWith("image/") && !mime.startsWith("video/")) {
        return NextResponse.json(
          { error: "File harus berupa gambar atau video" },
          { status: 400 }
        );
      }

      // lokasi penyimpanan
      const uploadDir = path.join(process.cwd(), "public/uploads/profile");
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());

      // nama file aman
      const extension = mime.split("/")[1];
      const safeName = file.name.replace(/\s+/g, "_");
      const fileName = `${Date.now()}_${safeName}`;

      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      media_url = `/uploads/profile/${fileName}`;
      media_type = mime.startsWith("video/") ? "video" : "image";
    }

    const payload: ProfilePayload = {
      judul_profile: String(formData.get("judul_profile")),
      tanggal_publish: String(formData.get("tanggal_publish")),
      jam_publish: String(formData.get("jam_publish")),
      jenis_berita: String(formData.get("jenis_berita")),
      id_kategori: String(formData.get("id_kategori")),
      isi: String(formData.get("isi")),
    };

    const result = await prisma.profile.create({
      data: {
        judul_profile: payload.judul_profile,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        media_url,
        media_type,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// ============================
// 📥 GET — Ambil Semua Data
// ============================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");

    const whereClause = kategori ? { id_kategori: Number(kategori) } : {};

    const data = await prisma.profile.findMany({
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

// ============================
// 🗑️ DELETE — Hapus Data
// ============================
export async function DELETE(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    await prisma.profile.delete({ where: { id: Number(id) } });

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
// ✏️ PUT — Update Profile
// ============================
export async function PUT(req: NextRequest) {
  try {
    const id = new URL(req.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const payload: ProfilePayload = {
      judul_profile: String(formData.get("judul_profile")),
      tanggal_publish: String(formData.get("tanggal_publish")),
      jam_publish: String(formData.get("jam_publish")),
      jenis_berita: String(formData.get("jenis_berita")),
      id_kategori: String(formData.get("id_kategori")),
      isi: String(formData.get("isi")),
    };

    // handle upload baru
    const file = formData.get("gambar") as File | null;

    let media_url: string | null = null;
    let media_type: string | null = null;

    if (file && file.size > 0) {
      const mime = file.type;

      const uploadDir = path.join(process.cwd(), "public/uploads/profile");
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await file.arrayBuffer());

      const safeName = file.name.replace(/\s+/g, "_");
      const fileName = `${Date.now()}_${safeName}`;

      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      media_url = `/uploads/profile/${fileName}`;
      media_type = mime.startsWith("video/") ? "video" : "image";
    }

    const updated = await prisma.profile.update({
      where: { id: Number(id) },
      data: {
        judul_profile: payload.judul_profile,
        tanggal_publish: new Date(payload.tanggal_publish),
        jam_publish: payload.jam_publish,
        jenis_berita: payload.jenis_berita,
        id_kategori: Number(payload.id_kategori),
        isi: payload.isi,
        ...(media_url && { media_url }),
        ...(media_type && { media_type }),
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
