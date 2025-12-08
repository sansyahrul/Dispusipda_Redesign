"use client";

import { useState, useEffect } from "react";

import { NavigationMenuDemo } from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/Herosection";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Footer from "@/components/layout/Footer";
import { FaBalanceScale } from "react-icons/fa";

import {
  BsDatabaseCheck,
  BsSearchHeart,
  BsClipboard2Data,
  BsBookHalf,
  BsPeople,
  BsFileEarmarkText,
} from "react-icons/bs";

import { IconType } from "react-icons";
import Image from "next/image";

import type {
  ProfileData,
  UndangUndangData,
  TujuanData,
  ContentItem,
  HeroData,
  HomeResponse,
} from "@/types/home";

const iconMap: Record<string, IconType> = {
  BsDatabaseCheck,
  BsSearchHeart,
  BsClipboard2Data,
  BsBookHalf,
  BsPeople,
  BsFileEarmarkText,
};

const fallbackIcons = [
  BsDatabaseCheck,
  BsSearchHeart,
  BsClipboard2Data,
  BsBookHalf,
  BsPeople,
  BsFileEarmarkText,
];

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [Tujuan, setTujuan] = useState<TujuanData[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [data, setUndang] = useState<UndangUndangData[]>([]);

  const searchParams = useSearchParams();
  const kategori = searchParams.get("kategori") ?? "3";

  // === FETCH PROFILE ===
  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/home?kategori=${kategori}`);
      const data: HomeResponse = await res.json(); // ⬅ tipe aman

      setProfile(data.profile ?? null);
      setTujuan(data.tujuan ?? []);
      setUndang(data.undangUndang ?? []);
      setHero(data.hero ?? null);
      setContent(data.content ?? []);
    }

    loadData();
  }, [kategori]);

  if (!profile) return null;
  return (
    <>
      <NavigationMenuDemo />

      {/* Hero Section mengikuti kategori */}
      <HeroSection data={hero} />

      {/* === Apa Itu Perpustakaan Deposit === */}
      <section className="py-20 bg-white px-6 md:px-16 text-gray-800">
        <h2 className="text-center text-3xl font-semibold text-blue-950 mb-10">
          {profile.judul_profile}
        </h2>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Media */}
          <div className="flex items-center justify-center h-full w-full">
            {profile.media_type === "video" ? (
              <video
                src={profile.media_url ?? ""}
                controls
                autoPlay
                loop
                muted
                className="w-full h-full max-h-[500px] rounded-xl shadow-lg object-contain bg-white"
              />
            ) : (
              <Image
                src={profile.media_url ?? ""}
                width={1000}
                height={600}
                className="w-full h-full max-h-[500px] rounded-xl shadow-lg object-cover bg-white"
                alt="Profile Media"
              />
            )}
          </div>

          {/* Isi */}
          <div className="flex flex-col justify-center">
            <p className="bg-blue-50 border border-blue-200 rounded-2xl p-8 md:p-10 shadow-md leading-relaxed text-gray-700 text-justify">
              {profile.isi}
            </p>
          </div>
        </div>
      </section>

      {/* === Tujuan dan Fungsi === */}
      <section className="py-20 bg-white text-center text-gray-800">
        <h2 className="text-3xl font-semibold text-blue-950 mb-4">
          {Tujuan[0]?.judul_tujuan || "Tujuan dan Manfaat"}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
          {Tujuan.map((item) => {
            const IconComponent =
              iconMap[item.icon ?? ""] ??
              fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];

            return (
              <div
                key={item.id}
                className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <IconComponent className="text-blue-700 text-4xl mx-auto mb-4" />

                <h3 className="text-blue-950 font-semibold mb-2">
                  {item.judul_tujuan}
                </h3>
                <p className="text-gray-700 text-sm">{item.isi}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* === Dasar Hukum === */}
      <section className="py-20 bg-white px-6 md:px-16 text-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex items-center gap-3">
            <FaBalanceScale className="text-blue-950 text-5xl" />
            <h2 className="text-3xl font-semibold text-blue-950">
              Dasar Hukum Perpustakaan Deposit
            </h2>
          </div>

          {/* Grid isi */}
          <div className="grid md:grid-cols-3 gap-6">
            {data.map((item) => (
              <div
                key={item.id}
                className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-blue-950 font-semibold mb-2">
                  {item.judul_undang_undang}
                </h3>
                <p className="text-gray-700 text-sm">{item.isi}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <button className="bg-[#3F5E84] hover:bg-blue-950 text-white font-medium py-3 px-8 rounded-lg transition">
              Lihat Dokumen Lengkap
            </button>
          </div>
        </div>
      </section>

      {/* === Peran BID dalam Ekosistem Deposit === */}
      <section className="py-20 bg-white text-center text-gray-800">
        <h2 className="text-3xl font-semibold text-blue-950 mb-6">
          Peran BID dalam Ekosistem Deposit
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-6">
          {[
            "Menyediakan data BIBLIOGRAFIS terstandar yang menjadi dasar penyusunan statistik penerbitan daerah",
            "Mendukung penyusunan Katalog Induk Daerah dan Katalog Induk Nasional(KIN)",
            "Meningkatkan visibilitas karya lokal dalam jaringan informasi nasional dan global",
            "Menjadi memori kolektif daerah yang mencerminkan dinamika, budaya, ekonomi, dan ilmu pengetahuan",
          ].map((title, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="text-gray-700">{title}</p>
            </div>
          ))}
        </div>

        <Button className="mt-10 bg-[#3F5E84] text-white px-8 py-3 rounded-xl hover:bg-blue-950">
          Lihat Dokumen Lengkap
        </Button>
      </section>

      <section className="py-20 bg-white text-center text-gray-800">
        <h2 className="text-3xl font-semibold text-blue-950 mb-10">
          Koleksi Digital Kami
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {content.length === 0 && (
            <p className="col-span-3 text-gray-500">
              Belum ada koleksi digital.
            </p>
          )}

          {content.map((item) => {
            const youtubeMatch = item.youtube_link?.match(
              /(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
            );
            const youtubeId = youtubeMatch ? youtubeMatch[1] : null;

            const youtubeThumbnail = youtubeId
              ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
              : null;

            return (
              <div
                key={item.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
              >
                {/* HEADER */}
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-lg text-slate-800 leading-snug line-clamp-2">
                    {item.judul_berita}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.tanggal_publish
                      ? new Date(item.tanggal_publish).toLocaleDateString(
                          "id-ID",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "-"}{" "}
                    • {item.status_berita}
                  </p>
                </div>

                {/* MEDIA */}
                <div className="relative">
                  {/* YOUTUBE */}
                  {youtubeThumbnail && (
                    <a
                      href={item.youtube_link ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <Image
                        src={youtubeThumbnail}
                        alt="Thumbnail YouTube"
                        width={400}
                        height={250}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                        <div className="bg-white rounded-full p-3"></div>
                      </div>
                    </a>
                  )}

                  {/* GAMBAR */}
                  {!youtubeThumbnail && item.gambar_url && (
                    <Image
                      src={item.gambar_url}
                      alt="Gambar Konten"
                      width={400}
                      height={250}
                      className="w-full h-56 object-cover"
                    />
                  )}

                  {/* VIDEO */}
                  {!youtubeThumbnail && !item.gambar_url && item.video_url && (
                    <video
                      src={item.video_url}
                      controls
                      className="w-full h-56 object-cover"
                    />
                  )}

                  {/* PDF / DOKUMEN */}
                  {!youtubeThumbnail &&
                    !item.gambar_url &&
                    !item.video_url &&
                    item.dokumen_url && (
                      <iframe
                        src={`${item.dokumen_url}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-64 border-t border-slate-200"
                      />
                    )}

                  {/* PLACEHOLDER */}
                  {!youtubeThumbnail &&
                    !item.gambar_url &&
                    !item.video_url &&
                    !item.dokumen_url && (
                      <div className="w-full h-56 flex items-center justify-center bg-slate-100 text-slate-400">
                        Tidak ada media
                      </div>
                    )}
                </div>

                {/* ISI / DESCRIPTION */}
                {item.isi && (
                  <div
                    className="p-4 text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.isi }}
                  />
                )}

                {/* === BUTTON SECTION === */}
                <div className="p-4 border-t border-slate-100 flex justify-center">
                  {item.dokumen_url ? (
                    <a
                      href={item.dokumen_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#3F5E84] hover:bg-blue-950 text-white px-6 py-2 rounded-lg font-medium"
                    >
                      Lihat Selengkapnya
                    </a>
                  ) : (
                    <button
                      disabled
                      className="bg-gray-300 text-white px-6 py-2 rounded-lg font-medium cursor-not-allowed"
                    >
                      Tidak Ada Dokumen
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}
