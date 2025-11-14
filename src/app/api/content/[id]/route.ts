import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// === Helper untuk simpan file ===

// === Helper untuk hapus file lama ===
const deleteOldFile = async (fileUrl: string | null) => {
  if (!fileUrl) return;
  const filePath = path.join(process.cwd(), "public", fileUrl);
  if (fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
      console.log("🗑️ File lama dihapus:", filePath);
    } catch (err) {
      console.error("Gagal hapus file lama:", err);
    }
  }
};

const saveFile = async (file: File | null) => {
  if (!file) return null;
  if (!file.name) return null; // antisipasi field kosong

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
};

// === GET /api/content/[id] ===
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  try {
    const content = await prisma.content.findUnique({ where: { id } });
    if (!content)
      return NextResponse.json(
        { error: "Content tidak ditemukan" },
        { status: 404 }
      );

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error GET content:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// === PUT /api/content/[id] ===
// === PUT /api/content/[id] ===
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  try {
    const data = await req.formData();

    // --- Ambil data teks ---
    const judul_berita = data.get("judul_berita")?.toString() ?? "";
    const icon = data.get("icon")?.toString() ?? "";
    const tanggal_publish_str = data.get("tanggal_publish")?.toString();
    const tanggal_publish = tanggal_publish_str
      ? new Date(tanggal_publish_str)
      : new Date();
    const jam_publish = data.get("jam_publish")?.toString() ?? "";
    const status_berita = data.get("status_berita")?.toString() ?? "";
    const jenis_berita = data.get("jenis_berita")?.toString() ?? "";
    const id_kategori_str = data.get("id_kategori")?.toString();
    const id_kategori = id_kategori_str ? parseInt(id_kategori_str) : 1;
    const urutan_str = data.get("urutan")?.toString();
    const urutan = urutan_str ? parseInt(urutan_str) : 1;
    const keywords = data.get("keywords")?.toString() ?? "";
    const isi = data.get("isi")?.toString() ?? "";

    // --- Ambil data lama ---
    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Content tidak ditemukan" },
        { status: 404 }
      );
    }

    // --- File upload baru ---
    const gambarFile = data.get("gambar") as File | null;
    const videoFile = data.get("video") as File | null;
    const dokumenFile = data.get("dokumen") as File | null;

    // --- Simpan file baru jika ada, hapus lama ---
    let gambar_url = existing.gambar_url;
    let video_url = existing.video_url;
    let dokumen_url = existing.dokumen_url;

    if (gambarFile && gambarFile.size > 0) {
      await deleteOldFile(existing.gambar_url ?? null);
      gambar_url = await saveFile(gambarFile);
    }

    if (videoFile && videoFile.size > 0) {
      await deleteOldFile(existing.video_url ?? null);
      video_url = await saveFile(videoFile);
    }

    if (dokumenFile && dokumenFile.size > 0) {
      await deleteOldFile(existing.dokumen_url ?? null);
      dokumen_url = await saveFile(dokumenFile);
    }

    // --- Update database ---
    const updated = await prisma.content.update({
      where: { id },
      data: {
        judul_berita,
        icon,
        tanggal_publish,
        jam_publish,
        status_berita,
        jenis_berita,
        id_kategori,
        urutan,
        keywords,
        isi,
        gambar_url,
        video_url,
        dokumen_url,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(" Error PUT content:", error);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

// === DELETE /api/content/[id] ===
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  try {
    const existing = await prisma.content.findUnique({ where: { id } });
    if (!existing)
      return NextResponse.json(
        { error: "Content tidak ditemukan" },
        { status: 404 }
      );

    // 🧹 Hapus file fisik kalau ada
    await deleteOldFile(existing.gambar_url ?? null);
    await deleteOldFile(existing.video_url ?? null);
    await deleteOldFile(existing.dokumen_url ?? null);

    await prisma.content.delete({ where: { id } });

    return NextResponse.json({ message: "Content berhasil dihapus" });
  } catch (error) {
    console.error("Error DELETE content:", error);
    return NextResponse.json(
      { error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
