"use client";

import { useState, useEffect, useRef } from "react";
import * as htmlToImage from "html-to-image";
import { NavigationMenuDemo } from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/Herosection";
import Footer from "@/components/layout/Footer";
import { useSearchParams } from "next/navigation";

import { CloudDownload } from "lucide-react";
import StatistikChart from "../admin/component/chart";
import SerahsimpanChart from "../admin/component/chartserahsimpan";

import { convertToSerahsimpan } from "@/utils/convertToSerahsimpan";

import { groupByTahun, StatistikChartData } from "@/utils/GroupbyTahun";

import type {
  ProfileData,
  HeroData,
  HomeResponse,
  StatistikImport,
} from "@/types/home";

export default function StatistikPage() {
  const [koleksiData, setKoleksiData] = useState<StatistikChartData[]>([]);
  const [serahsimpanData, setSerahsimpanData] = useState<StatistikChartData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const [hero, setHeroData] = useState<HeroData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const searchParams = useSearchParams();
  const kategori = searchParams.get("kategori") ?? "6";

  const chartKoleksiRef = useRef<HTMLDivElement>(null);
  const chartSerahsimpanRef = useRef<HTMLDivElement>(null);

  // Convert raw API → GroupBy Tahun
  const convertToGroupedChartData = (
    result: StatistikImport[]
  ): StatistikChartData[] => {
    if (result.length === 0) return [];

    const headers = Object.keys(result[0].data);
    return groupByTahun(convertToSerahsimpan(result), headers);
  };

  // ============================
  //    FETCH API HOME
  // ============================
  const fetchHome = async () => {
    try {
      const res = await fetch(`/api/home?kategori=${kategori}`, {
        cache: "no-store",
      });

      const data: HomeResponse = await res.json();

      setProfileData(data.profile ?? null);
      setHeroData(data.hero ?? null);

      // FIXED — Sesuai API baru
      setKoleksiData(convertToGroupedChartData(data.statistik ?? []));
      setSerahsimpanData(convertToGroupedChartData(data.serahsimpan ?? []));
    } catch (err) {
      console.error("Home fetch error:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await fetchHome();
      setLoading(false);
    };

    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kategori]);

  // ============================
  //    DOWNLOAD PNG / JPG
  // ============================
  const handleDownload = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string,
    type: "png" | "jpg" = "png"
  ) => {
    if (!ref.current) return;

    try {
      let dataUrl = "";

      if (type === "png") {
        dataUrl = await htmlToImage.toPng(ref.current, {
          backgroundColor: "white",
        });
      } else {
        dataUrl = await htmlToImage.toJpeg(ref.current, {
          quality: 1,
          backgroundColor: "white",
        });
      }

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${filename}.${type}`;
      link.click();
    } catch (error) {
      console.error("Gagal export chart:", error);
    }
  };

  if (!profileData) return <p className="text-center py-20">Memuat...</p>;

  // ============================
  //      RENDER PAGE
  // ============================
  return (
    <>
      <NavigationMenuDemo />
      <HeroSection data={hero} />

      {/* ===== PROFILE ===== */}
      <section className="py-20 bg-white px-6 text-center md:px-20">
        <h1 className="text-3xl font-semibold text-blue-950 mb-4">
          {profileData.judul_profile}
        </h1>

        <div className="max-w-5xl mx-auto p-10 bg-blue-50 border rounded-xl shadow text-gray-700 text-justify">
          <p>{profileData.isi}</p>
        </div>
      </section>

      {/* ===== KOLEKSI CHART ===== */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-blue-950 text-center mb-10">
          Pertumbuhan Koleksi Pertahun
        </h2>

        <div className="bg-blue-50 p-8 rounded-xl max-w-5xl mx-auto shadow">
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="bg-[#3F5E84] text-white px-4 py-2 rounded"
              onClick={() =>
                handleDownload(chartKoleksiRef, "chart_koleksi", "png")
              }
            >
              <CloudDownload className="inline-block mr-2" />
              Download PNG
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() =>
                handleDownload(chartKoleksiRef, "chart_koleksi", "jpg")
              }
            >
              <CloudDownload className="inline-block mr-2" />
              Download JPG
            </button>
          </div>

          <div ref={chartKoleksiRef} className="w-full h-80 bg-white rounded">
            {loading ? (
              <p>Memuat grafik...</p>
            ) : (
              <StatistikChart data={koleksiData} />
            )}
          </div>
        </div>
      </section>

      {/* ===== SERAH SIMPAN CHART ===== */}
      <section className="py-20 px-6 md:px-20">
        <h2 className="text-3xl font-semibold text-blue-950 text-center mb-10">
          Tren Serah Simpan Daerah
        </h2>

        <div className="bg-blue-50 p-8 rounded-xl max-w-5xl mx-auto shadow">
          <div className="flex justify-center gap-4 mb-4">
            <button
              className="bg-[#3F5E84] text-white px-4 py-2 rounded"
              onClick={() =>
                handleDownload(chartSerahsimpanRef, "chart_serah_simpan", "png")
              }
            >
              <CloudDownload className="inline-block mr-2" />
              Download PNG
            </button>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() =>
                handleDownload(chartSerahsimpanRef, "chart_serah_simpan", "jpg")
              }
            >
              <CloudDownload className="inline-block mr-2" />
              Download JPG
            </button>
          </div>

          <div
            ref={chartSerahsimpanRef}
            className="w-full h-80 bg-white rounded"
          >
            {loading ? (
              <p>Memuat grafik...</p>
            ) : (
              <SerahsimpanChart data={serahsimpanData} />
            )}
          </div>
        </div>
      </section>

      {/* TABLE KOLEKSI */}
      <section className="py-10 px-6 md:px-20">
        <h3 className="text-3xl dashboard-title mb-6 text-center">
          Tabel Data Koleksi
        </h3>

        <div className="overflow-x-auto max-w-6xl mx-auto rounded-lg shadow border border-blue-200">
          <table className="w-full border-collapse text-center">
            <thead className="bg-[#2F4A6E] text-white">
              <tr>
                {koleksiData.length > 0 &&
                  Object.keys(koleksiData[0]).map((key) => (
                    <th key={key} className="p-4 text-sm font-semibold border">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {koleksiData.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="border p-4 text-sm">
                      {idx === 0 ? (
                        <span className="font-semibold text-blue-800">
                          {val}
                        </span>
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* TABLE SERAH SIMPAN */}
      <section className="py-10 px-6 md:px-20">
        <h3 className="text-3xl dashboard-title mb-6 text-center">
          Tabel Data Serah Simpan
        </h3>

        <div className="overflow-x-auto max-w-6xl mx-auto rounded-lg shadow border border-blue-200">
          <table className="w-full border-collapse text-center">
            <thead className="bg-[#2F4A6E] text-white">
              <tr>
                {serahsimpanData.length > 0 &&
                  Object.keys(serahsimpanData[0]).map((key) => (
                    <th key={key} className="p-4 text-sm font-semibold border">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {serahsimpanData.map((row, i) => (
                <tr key={i} className="even:bg-gray-50">
                  {Object.values(row).map((val, idx) => (
                    <td key={idx} className="border p-4 text-sm">
                      {idx === 0 ? (
                        <span className="font-semibold text-blue-800">
                          {val}
                        </span>
                      ) : (
                        val
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Footer />
    </>
  );
}
