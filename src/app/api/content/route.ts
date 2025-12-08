import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";

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
  gambar: File | Blob | null;
  video: File | Blob | null;
  dokumen: File | Blob | null;
  youtube_link: string;
}

function isFile(file: File | Blob | null): file is File {
  return file !== null && typeof (file as File).name === "string";
}

async function saveFile(file: File | Blob | null): Promise<string | null> {
  if (!file) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = isFile(file)
    ? `${Date.now()}-${file.name}`
    : `file-${Date.now()}`;

  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}

async function saveAndExtractZip(
  file: File | Blob | null
): Promise<string | null> {
  if (!file || !isFile(file)) return null;

  if (!file.name.endsWith(".zip")) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const baseDir = path.join(process.cwd(), "public", "uploads", "html");
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const zipName = `html-${Date.now()}.zip`;
  const zipPath = path.join(baseDir, zipName);

  await writeFile(zipPath, buffer);

  const zip = new AdmZip(zipPath);
  const extractDir = path.join(baseDir, `extracted-${Date.now()}`);
  fs.mkdirSync(extractDir, { recursive: true });

  zip.extractAllTo(extractDir, true);

  const indexPath = path.join(extractDir, "index.html");
  if (!fs.existsSync(indexPath)) return null;

  return `/uploads/html/${path.basename(extractDir)}/index.html`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = searchParams.get("kategori");

    const whereClause = kategori ? { id_kategori: Number(kategori) } : {};

    const contents = await prisma.content.findMany({
      where: whereClause,
      orderBy: { id: "desc" },
    });

    return NextResponse.json(contents, { status: 200 });
  } catch (err) {
    console.error("❌ Error GET:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const getString = (key: string): string =>
      formData.get(key)?.toString().trim() ?? "";

    const getNumber = (key: string): number =>
      parseInt(formData.get(key)?.toString() ?? "0", 10);

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

      // FIX utama — pastikan undefined menjadi NULL
      gambar: (formData.get("gambar") ?? null) as File | Blob | null,
      video: (formData.get("video") ?? null) as File | Blob | null,
      dokumen: (formData.get("dokumen") ?? null) as File | Blob | null,
    };

    const gambar_url =
      contentData.jenis_berita === "Gambar"
        ? await saveFile(contentData.gambar)
        : null;

    const video_url =
      contentData.jenis_berita === "Video"
        ? await saveFile(contentData.video)
        : null;

    let dokumen_url: string | null = null;

    if (
      isFile(contentData.dokumen) &&
      contentData.dokumen.name.endsWith(".zip")
    ) {
      dokumen_url = await saveAndExtractZip(contentData.dokumen);
    } else {
      dokumen_url = await saveFile(contentData.dokumen);
    }

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
    console.error("❌ Error saat menyimpan content:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data content" },
      { status: 500 }
    );
  }
}
