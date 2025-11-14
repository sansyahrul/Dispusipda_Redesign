"use client";

import Sidebar from "../component/sidebar";
import RecentOrders from "../component/recentorder";
import StatistikChart from "../component/chart";
import Image from "next/image";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { StatistikImport } from "../Layout/Statistik/types/statistik";
import SerahsimpanChart from "../component/chartserahsimpan";
import DashboardStats from "../component/stats";

export type StatistikChartData = Record<string, string | number>;

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [koleksiData, setKoleksiData] = useState<StatistikChartData[]>([]);
  const [serahsimpanData, setSerahsimpanData] = useState<StatistikChartData[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchKoleksiData = async (): Promise<void> => {
    try {
      const res = await fetch("/api/Statistik/data", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal fetch data koleksi");
      const result: StatistikImport[] = await res.json();
      if (Array.isArray(result) && result.length > 0) {
        const headers = Object.keys(result[0].data);
        const formatted: StatistikChartData[] = result.map((item) => {
          const mapped: StatistikChartData = {};
          headers.forEach((header) => {
            const value = item.data[header];
            mapped[header] =
              typeof value === "number" || !isNaN(Number(value))
                ? Number(value)
                : String(value);
          });
          return mapped;
        });
        setKoleksiData(formatted);
      } else setKoleksiData([]);
    } catch (err) {
      console.error("❌ Gagal fetch data koleksi:", err);
      setKoleksiData([]);
    }
  };

  const fetchSerahsimpanData = async (): Promise<void> => {
    try {
      const res = await fetch("/api/Serahsimpan/data", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal fetch data serah simpan");
      const result: StatistikImport[] = await res.json();
      if (Array.isArray(result) && result.length > 0) {
        const headers = Object.keys(result[0].data);
        const formatted: StatistikChartData[] = result.map((item) => {
          const mapped: StatistikChartData = {};
          headers.forEach((header) => {
            const value = item.data[header];
            mapped[header] =
              typeof value === "number" || !isNaN(Number(value))
                ? Number(value)
                : String(value);
          });
          return mapped;
        });
        setSerahsimpanData(formatted);
      } else setSerahsimpanData([]);
    } catch (err) {
      console.error("❌ Gagal fetch data serah simpan:", err);
      setSerahsimpanData([]);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchKoleksiData(), fetchSerahsimpanData()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 p-6 md:p-10 w-full space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="dashboard-title text-2xl">Dashboard</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 border rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Image
            src="/profile.svg"
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300"
          />
        </div>

        {/* Stats Button Switch (Koleksi & Statistik) */}
        <DashboardStats />

        {/* Charts Section */}
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1 */}
          <div
            className=" border border-slate-200 rounded-[25px] shadow-md p-6 h-100"
            style={{
              backgroundColor: "#F9FCFF",
              borderColor: "#C9D4E1",
              border: "1px",
            }}
          >
            <h2 className="font-semibold text-slate-700 mb-4">
              Pertumbuhan Koleksi Pertahun
            </h2>
            <div className="w-full h-80">
              {loading ? (
                <p className="text-gray-400 text-sm">Memuat grafik...</p>
              ) : (
                <StatistikChart data={koleksiData} />
              )}
            </div>
          </div>

          {/* Chart 2 */}
          <div
            className=" border border-slate-200 rounded-[25px] shadow-md p-6 h-100"
            style={{
              backgroundColor: "#F9FCFF",
              borderColor: "#C9D4E1",
              border: "1px",
            }}
          >
            <h2 className="font-semibold text-slate-700 mb-4">
              Tren Serah Simpan Daerah
            </h2>
            <div className="w-full h-80">
              {loading ? (
                <p className="text-gray-400 text-sm">Memuat grafik...</p>
              ) : (
                <SerahsimpanChart data={serahsimpanData} />
              )}
            </div>
          </div>
        </div>

        {/* Daftar Konten */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}
