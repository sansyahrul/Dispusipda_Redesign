import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

/* ============================================================
   Helper: cek apakah benar-benar File, bukan string
============================================================ */
function isRealFile(file: FormDataEntryValue | null): file is File {
  return file instanceof File && typeof file.arrayBuffer === "function";
}

/* ============================================================
   Helper: hapus file lama
============================================================ */
const deleteOldFile = async (fileUrl: string | null) => {
  if (!fileUrl) return;

  const filePath = path.join(process.cwd(), "public", fileUrl);

  if (fs.existsSync(filePath)) {
    try {
      await fs.promises.unlink(filePath);
      console.log("🗑 File lama dihapus:", filePath);
    } catch (err) {
      console.error("Gagal hapus file:", err);
    }
  }
};

/* ============================================================
   Helper: simpan file baru
============================================================ */
const saveFile = async (file: File | null) => {
  if (!isRealFile(file)) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
};

/* ============================================================
   GET /api/content/[id]
============================================================ */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const content = await prisma.content.findUnique({ where: { id } });

    if (!content) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (err) {
    console.error("GET Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ============================================================
   PUT /api/content/[id]
============================================================ */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const data = await req.formData();

    // -------- Data Text --------
    const judul_berita = data.get("judul_berita")?.toString() ?? "";
    const icon = data.get("icon")?.toString() ?? "";
    const tanggal_publish_str = data.get("tanggal_publish")?.toString();
    const tanggal_publish = tanggal_publish_str
      ? new Date(tanggal_publish_str)
      : new Date();

    const jam_publish = data.get("jam_publish")?.toString() ?? "";
    const status_berita = data.get("status_berita")?.toString() ?? "";
    const jenis_berita = data.get("jenis_berita")?.toString() ?? "";

    const id_kategori = Number(data.get("id_kategori")?.toString() ?? 1);
    const urutan = Number(data.get("urutan")?.toString() ?? 1);
    const keywords = data.get("keywords")?.toString() ?? "";
    const isi = data.get("isi")?.toString() ?? "";
    const youtube_link = data.get("youtube_link")?.toString() ?? "";

    // -------- Ambil data lama --------
    const existing = await prisma.content.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    // -------- Ambil file upload baru --------
    const gambarFile = data.get("gambar");
    const videoFile = data.get("video");
    const dokumenFile = data.get("dokumen");

    let gambar_url = existing.gambar_url;
    let video_url = existing.video_url;
    let dokumen_url = existing.dokumen_url;

    // -------- Proses Gambar --------
    if (isRealFile(gambarFile) && gambarFile.size > 0) {
      await deleteOldFile(existing.gambar_url);
      gambar_url = await saveFile(gambarFile);
    }

    // -------- Proses Video --------
    if (isRealFile(videoFile) && videoFile.size > 0) {
      await deleteOldFile(existing.video_url);
      video_url = await saveFile(videoFile);
    }

    // -------- Proses PDF / ZIP / HTML --------
    if (isRealFile(dokumenFile) && dokumenFile.size > 0) {
      await deleteOldFile(existing.dokumen_url);
      dokumen_url = await saveFile(dokumenFile);
    }

    // -------- Update Database --------
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
        youtube_link,
        gambar_url,
        video_url,
        dokumen_url,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ error: "Gagal update data" }, { status: 500 });
  }
}

/* ============================================================
   DELETE /api/content/[id]
============================================================ */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  try {
    const existing = await prisma.content.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 });
    }

    await deleteOldFile(existing.gambar_url);
    await deleteOldFile(existing.video_url);
    await deleteOldFile(existing.dokumen_url);

    await prisma.content.delete({ where: { id } });

    return NextResponse.json({ message: "Berhasil dihapus" });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ error: "Gagal menghapus" }, { status: 500 });
  }
}
