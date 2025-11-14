import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

interface ContentForm {
  judul_berita: string;
  icon: string;
  tanggal_publish: Date;
  jam_publish: string;
  status_berita: string;
  jenis_berita: string;
  id_kategori: number;
  urutan: number;
  keywords: string;
  isi: string;
  gambar?: File | null;
  video?: File | null;
  dokumen?: File | null;
  youtube_link: string;
}

async function saveFile(file: File | null): Promise<string | null> {
  if (!file) return null;

  // Pastikan file valid
  if (!(file instanceof File) || !("arrayBuffer" in file)) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Buat folder upload jika belum ada
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data content" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Fungsi bantu untuk ambil data form
    const getString = (key: string): string =>
      formData.get(key)?.toString().trim() ?? "";

    const getNumber = (key: string): number =>
      parseInt(formData.get(key)?.toString() ?? "0", 10);

    // Ambil data dari form
    const contentData: ContentForm = {
      judul_berita: getString("judul_berita"),
      icon: getString("icon"),
      tanggal_publish: new Date(
        getString("tanggal_publish") || new Date().toISOString()
      ),
      jam_publish: getString("jam_publish"),
      status_berita: getString("status_berita"),
      jenis_berita: getString("jenis_berita"),
      id_kategori: getNumber("id_kategori"),
      urutan: getNumber("urutan"),
      keywords: getString("keywords"),
      isi: getString("isi"),
      youtube_link: getString("youtube_link"),
      gambar: formData.get("gambar") as File | null,
      video: formData.get("video") as File | null,
      dokumen: formData.get("dokumen") as File | null,
    };

    // Upload file (skip kalau jenis berita = YouTube)
    const gambar_url =
      contentData.jenis_berita !== "Youtube"
        ? await saveFile(contentData.gambar ?? null)
        : null;

    const video_url =
      contentData.jenis_berita !== "Youtube"
        ? await saveFile(contentData.video ?? null)
        : null;

    const dokumen_url = await saveFile(contentData.dokumen ?? null);

    // Simpan ke database Prisma
    const content = await prisma.content.create({
      data: {
        judul_berita: contentData.judul_berita,
        icon: contentData.icon,
        tanggal_publish: contentData.tanggal_publish,
        jam_publish: contentData.jam_publish,
        status_berita: contentData.status_berita,
        jenis_berita: contentData.jenis_berita,
        id_kategori: contentData.id_kategori,
        urutan: contentData.urutan,
        keywords: contentData.keywords,
        isi: contentData.isi,
        gambar_url,
        video_url,
        dokumen_url,
        youtube_link: contentData.youtube_link,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error saat menyimpan content:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data content" },
      { status: 500 }
    );
  }
}
