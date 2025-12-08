import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [hero, tujuan, undangundang, profile] = await Promise.all([
      prisma.hero_section.findMany(),
      prisma.tujuan.findMany(),
      prisma.undang_undang.findMany(),
      prisma.profile.findMany(),
    ]);

    // Satukan data, normalisasi nama field ke `judul` supaya konsisten di frontend
    const allContent = [
      ...hero.map((item) => ({
        id: item.id,
        judul: item.judul_section,
        tanggal_publish: item.tanggal_publish,
        jam_publish: item.jam_publish,
        jenis_berita: item.jenis_berita,
        id_kategori: item.id_kategori,
        gambar_url: item.gambar_url,
        isi: item.isi,
        sumber: "Hero Section",
      })),
      ...tujuan.map((item) => ({
        id: item.id,
        judul: item.judul_tujuan,
        tanggal_publish: item.tanggal_publish,
        jam_publish: item.jam_publish,
        jenis_berita: item.jenis_berita,
        id_kategori: item.id_kategori,
        gambar_url: item.gambar_url,
        isi: item.isi,
        sumber: "Tujuan",
      })),
      ...undangundang.map((item) => ({
        id: item.id,
        judul: item.judul_undang_undang,
        tanggal_publish: item.tanggal_publish,
        jam_publish: item.jam_publish,
        jenis_berita: item.jenis_berita,
        id_kategori: item.id_kategori,
        isi: item.isi,
        sumber: "Undang-Undang",
      })),
      ...profile.map((item) => ({
        id: item.id,
        judul: item.judul_profile,
        tanggal_publish: item.tanggal_publish,
        jam_publish: item.jam_publish,
        jenis_berita: item.jenis_berita,
        id_kategori: item.id_kategori,
        media_url: item.media_url,
        isi: item.isi,
        sumber: "Profile",
      })),
    ];

    return NextResponse.json(allContent, { status: 200 });
  } catch (error) {
    console.error("❌ Gagal mengambil data konten:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data konten" },
      { status: 500 }
    );
  }
}
