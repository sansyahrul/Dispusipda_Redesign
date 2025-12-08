"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { NavigationMenuDemo } from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/Herosection";
import { FaBalanceScale } from "react-icons/fa";

import {
  BsDatabaseCheck,
  BsSearchHeart,
  BsClipboard2Data,
  BsBookHalf,
  BsPeople,
  BsFileEarmarkText,
} from "react-icons/bs";

import type {
  ProfileData,
  UndangUndangData,
  TujuanData,
  HeroData,
  HomeResponse,
} from "@/types/home";

import { IconType } from "react-icons";

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

export default function ProfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [tujuan, setTujuan] = useState<TujuanData[]>([]);
  const [undang, setUndang] = useState<UndangUndangData[]>([]);
  const [hero, setHero] = useState<HeroData | null>(null);
  const searchParams = useSearchParams();
  const kategori = searchParams.get("kategori") ?? "1";

  // === FETCH HOME ===
  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/home?kategori=${kategori}`);
      const data: HomeResponse = await res.json(); // ⬅ tipe aman

      setProfile(data.profile ?? null);
      setTujuan(data.tujuan ?? []);
      setUndang(data.undangUndang ?? []);
      setHero(data.hero ?? null);
    }

    loadData();
  }, [kategori]);

  if (!profile) return null;

  return (
    <>
      <NavigationMenuDemo />

      <HeroSection data={hero} />

      {/* === Apa Itu === */}
      <section className="py-20 bg-white px-6 md:px-16 text-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-stretch">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-semibold text-blue-950 mb-4">
              {profile.judul_profile}
            </h2>

            <p className="text-gray-700 leading-relaxed mb-4 text-justify whitespace-pre-line">
              {profile.isi}
            </p>
          </div>

          {/* Media */}
          <div className="flex items-center justify-center h-full">
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
                alt="Profile Media"
                className="w-full h-full max-h-[500px] rounded-xl shadow-lg object-cover bg-white"
              />
            )}
          </div>
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

          <div className="grid md:grid-cols-3 gap-6">
            {undang.map((item) => (
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

      {/* === Peran Strategis === */}
      <section className="py-20 bg-white text-center text-gray-800">
        <h2 className="text-3xl font-semibold text-blue-950 mb-4">
          Peran Strategis Perpustakaan Deposit Daerah
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mx-auto px-10">
          {tujuan.map((item) => {
            const IconComponent =
              iconMap[item.icon ?? ""] ??
              fallbackIcons[Math.floor(Math.random() * fallbackIcons.length)];

            return (
              <div
                key={item.id}
                className="flex w-full items-center gap-6 bg-white border border-[#DDEAFF] rounded-2xl p-8 shadow-sm"
              >
                <IconComponent className="text-[#7DBBFF] w-16 h-16 flex-shrink-0" />
                <div className="text-blue-900 leading-relaxed text-[18px] font-medium text-left">
                  {item.judul_tujuan}
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
