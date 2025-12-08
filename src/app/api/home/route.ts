// /app/api/home/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const kategori = Number(searchParams.get("kategori"));

    if (!kategori) {
      return NextResponse.json(
        { error: "kategori wajib diisi" },
        { status: 400 }
      );
    }

    const [
      profile,
      tujuan,
      undangUndang,
      content,
      hero,
      serahsimpan,
      statistik,
    ] = await Promise.all([
      prisma.profile.findFirst({
        where: { id_kategori: kategori },
        select: {
          id: true,
          judul_profile: true,
          isi: true,
          media_url: true,
          media_type: true,
        },
      }),

      prisma.tujuan.findMany({
        where: { id_kategori: kategori },
        select: {
          id: true,
          judul_tujuan: true,
          isi: true,
          gambar_url: true,
        },
      }),

      prisma.undang_undang.findMany({
        where: { id_kategori: kategori },
        select: {
          id: true,
          judul_undang_undang: true,
          isi: true,
        },
      }),

      prisma.content.findMany({
        where: { id_kategori: kategori },
        select: {
          id: true,
          judul_berita: true,
          isi: true,
          gambar_url: true,
          youtube_link: true,
          video_url: true,
          dokumen_url: true,
          tanggal_publish: true,
          status_berita: true,
        },
      }),

      prisma.hero_section.findFirst({
        where: { id_kategori: kategori },
        select: {
          id: true,
          judul_section: true,
          isi: true,
          gambar_url: true,
        },
      }),

      // === SERAH SIMPAN ===
      prisma.serahsimpan.findMany({
        orderBy: { id: "desc" },
      }),

      // === STATISTIK IMPORT ===
      prisma.statistikImport.findMany({
        orderBy: { id: "desc" },
      }),
    ]);

    return NextResponse.json({
      profile,
      tujuan,
      undangUndang,
      content,
      hero,
      serahsimpan,
      statistik, // ← tambahan
    });
  } catch (error) {
    console.error("API /home error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
