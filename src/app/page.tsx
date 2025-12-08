"use client";

import { NavigationMenuDemo } from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/Herosectionprofil";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import FloatingAI from "@/components/Floatingai";
import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { convertToSerahsimpan } from "@/utils/convertToSerahsimpan";

import StatistikChart from "./admin/component/chart";
import { groupByTahun, StatistikChartData } from "@/utils/GroupbyTahun";

import { kategoriDummy } from "./admin/Layout/Datatable/const/kategoridummy";

interface KategoriStat {
  id_kategori: number;
  _count: { id: number };
}

import type { HeroData, HomeResponse, StatistikImport } from "@/types/home";

export default function StatistikPage() {
  const [koleksiData, setKoleksiData] = useState<StatistikChartData[]>([]);

  // NEW → simpan hasil statistik kategori
  const [statKategori, setStatKategori] = useState<KategoriStat[]>([]); // NEW
  const [hero, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const kategori = searchParams.get("kategori") ?? "4"; // default BID
  const chartKoleksiRef = useRef<HTMLDivElement>(null);

  /** Convert raw API → GroupBy Tahun */
  const convertToGroupedChartData = (
    result: StatistikImport[]
  ): StatistikChartData[] => {
    if (result.length === 0) return [];
    const headers = Object.keys(result[0].data);
    return groupByTahun(convertToSerahsimpan(result), headers);
  };

  /** === FETCH KOLEKSI (Grafik Tahunan) === */

  const fetchHome = async () => {
    try {
      const res = await fetch(`/api/home?kategori=${kategori}`, {
        cache: "no-store",
      });

      const data: HomeResponse = await res.json();

      setHeroData(data.hero ?? null);

      // FIXED — Sesuai API baru
      setKoleksiData(convertToGroupedChartData(data.statistik ?? []));
    } catch (err) {
      console.error("Home fetch error:", err);
    }
  };

  /** === FETCH CAPAIAN KONTEN BERDASARKAN KATEGORI === */

  /** === NEW: FETCH STATISTIK KATEGORI === */
  const fetchStatKategori = async () => {
    try {
      const res = await fetch("/api/content/statistik", {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Gagal fetch statistik kategori");

      const result: KategoriStat[] = await res.json();

      setStatKategori(result);
    } catch (err) {
      console.error("StatKategori error:", err);
      setStatKategori([]);
    }
  };

  /** LOAD SEMUA DATA */
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchHome(),

        fetchStatKategori(), // NEW
      ]);
      setLoading(false);
    };

    loadAll();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategori]);

  return (
    <>
      <NavigationMenuDemo />
      <HeroSection data={hero} />

      {/* ================== LAYANAN UNGGULAN ================== */}
      <section id="unggulan" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-semibold text-blue-950 mb-10">
          Layanan Unggulan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center px-6 md:px-16">
          {[
            {
              img: "/cardkid.jpeg",
              title: "KID (Katalog Induk Daerah)",
              desc: "Telusuri Koleksi!",
              link: "/KID",
            },
            {
              img: "/cardbid.jpeg",
              title: "BID (Bibliografi Daerah)",
              desc: "Lihat Bibliografi!",
              link: "/BID",
            },
            {
              img: "/cardmediaalihnasahkuno.jpeg",
              title: "Media Alih Naskah Kuno",
              desc: "Jelajahi Naskah Kuno!",
              link: "/mediaalihnasahkuno",
            },
            {
              img: "/cardstatistikkoleksi.jpeg",
              title: "Statistik Koleksi",
              desc: "Lihat Statistik!",
              link: "/statistik",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className="p-5 flex flex-col h-full">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="w-full h-48 object-cover rounded-t-xl mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>

                <Link href={item.link} className="mt-auto">
                  <button className="w-full bg-[#3F5E84] text-white py-2 rounded-lg font-semibold hover:bg-blue-950 transition">
                    {item.desc}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="statistik" className="bg-white py-20 text-center">
        <h2 className="text-3xl font-semibold text-blue-950 mb-10">
          Statistik & Capaian Konten
        </h2>

        {/* ==== NEW: GRID STATISTIK KATEGORI ==== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {statKategori.map((item) => {
            const kategoriName =
              kategoriDummy.find((k) => Number(k.value) === item.id_kategori)
                ?.label || "Tidak diketahui";

            return (
              <div
                key={item.id_kategori}
                className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow"
              >
                <p className="text-xl font-bold text-blue-950">
                  {item._count.id}
                </p>
                <p className="text-gray-600">Konten dari {kategoriName}</p>
              </div>
            );
          })}
        </div>

        {/* ==== GRAFIK PER TAHUN ==== */}
        <section className="py-20 px-6 md:px-20">
          <h2 className="text-3xl font-semibold text-blue-950 text-center mb-10">
            Statistik Pertumbuhan Koleksi Pertahun
          </h2>

          <div className="bg-blue-50 p-8 rounded-xl max-w-5xl mx-auto shadow">
            <div ref={chartKoleksiRef} className="w-full h-80 bg-white rounded">
              {loading ? (
                <p>Memuat grafik...</p>
              ) : (
                <StatistikChart data={koleksiData} />
              )}
            </div>
          </div>
        </section>
      </section>

      {/* === TESTIMONI === */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-3xl font-semibold text-blue-950 mb-3">
          Testimoni Pengguna
        </h2>
        <p className="text-2xl font-medium text-blue-950 mb-12">
          Apa kata mereka yang telah menggunakan layanan kami
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              isi: "Perpustakaan Deposit sangat membantu penelitian saya...",
              nama: "Dr. Rizki Ahmad",
              profesi: "Peneliti Sejarah",
            },
            {
              isi: "Katalog Induk Daerah sangat memudahkan saya...",
              nama: "Siti Aminah",
              profesi: "Mahasiswa",
            },
            {
              isi: "Layanan yang profesional dan koleksi yang lengkap...",
              nama: "Budi Prasetyo, M.Si",
              profesi: "Akademisi",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-200 rounded-2xl shadow-sm p-6 text-left hover:shadow-md transition"
            >
              <p className="text-gray-700 italic mb-4">“{item.isi}”</p>
              <h3 className="font-semibold text-blue-950">{item.nama}</h3>
              <p className="text-gray-500 text-sm">{item.profesi}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === FORM TESTIMONI === */}
      <section className="py-20 bg-white flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="bg-blue-50 border border-blue-200 rounded-2xl shadow-md p-8 w-[90%] max-w-md text-center transform hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-950 mb-6 flex items-center justify-center gap-2">
            Tulis Testimoni Kamu
            <span className="text-sky-500 text-2xl">✦</span>
          </h2>

          <form className="flex flex-col space-y-4">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Nama Lengkap"
              className="bg-blue-100 placeholder-blue-800/60 text-blue-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Instansi / Profesi"
              className="bg-blue-100 placeholder-blue-800/60 text-blue-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 transition-all"
            />
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              rows={4}
              placeholder="Ceritain pengalaman kamu di layanan ini...."
              className="bg-blue-100 placeholder-blue-800/60 text-blue-900 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-300 resize-none transition-all"
            ></motion.textarea>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className=" bg-[#3F5E84] hover:bg-blue-950 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              Kirim Sekarang
            </motion.button>
          </form>
        </motion.div>
      </section>
      <Footer />
      <FloatingAI />
    </>
  );
}
