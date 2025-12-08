"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import Sidebar from "../../component/sidebar";
import { BarChart3 } from "lucide-react";
import SerahsimpanChart from "../../component/chartserahsimpan";
import { groupByTahun } from "@/utils/GroupbyTahun";

interface Serahsimpan {
  id: number;
  data: Record<string, string | number | null>;
  createdAt: string;
}

export interface StatistikChartData {
  Tahun: string;
  [key: string]: number | string;
}

export default function StatistikImportPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<Serahsimpan[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<StatistikChartData[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/Serahsimpan/data", { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal mengambil data statistik");
      const result: Serahsimpan[] = await res.json();

      if (result.length > 0) {
        const firstRow = result[0].data;
        const cols = Object.keys(firstRow);
        setHeaders(cols);

        const groupedData = groupByTahun(result, cols);

        setData(result);
        setChartData(groupedData);
      } else {
        setData([]);
        setHeaders([]);
        setChartData([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUploadSerahsimpan = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/Serahsimpan/import", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      alert(result.message || "Upload selesai");
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat upload file.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = async (): Promise<void> => {
    if (!confirm("Yakin ingin menghapus semua data import?")) return;
    try {
      const res = await fetch("/api/Serahsimpan/clear", { method: "DELETE" });
      const result = await res.json();
      alert(result.message);
      await fetchData();
    } catch (err) {
      console.error("Gagal hapus data:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-8">
        <h1 className="text-2xl dashboard-title">Kelola Statistik</h1>

        {/* CARD UPLOAD */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
          <div
            className=" border border-slate-200 rounded-[25px] shadow-md p-6 w-200 h-75"
            style={{
              backgroundColor: "#F9FCFF",
              borderColor: "#C9D4E1",
              border: "1px",
            }}
          >
            <div className=" flex items-center gap-3 mb-3">
              <BarChart3 className=" w-6 h-6" style={{ color: "#7DBBFF" }} />
              <h2
                className="text-lg font-semibold text-slate-700"
                style={{ color: "#7DBBFF" }}
              >
                Tren Serah Simpan Penerbit Daerah
              </h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 text-center mt-15">
              Input data tren serah simpan dari Jumlah Penerbit Aktif dan Jumlah
              Serah Simpan per tahun. Data
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 text-center mt-8">
              akan ditampilkan dalam grafik garis.
            </p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleUploadSerahsimpan}
              className="hidden"
              id="upload-koleksi"
              disabled={isLoading}
            />

            <div className="flex justify-center">
              <label
                htmlFor="upload-koleksi"
                className={`${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-blue-800"
                } flex justify-center mt-6 text-white px-20 py-2 rounded-md text-sm font-medium cursor-pointer inline-block`}
                style={{ backgroundColor: "#7DBBFF" }}
              >
                {isLoading
                  ? "Mengunggah..."
                  : "+ Input Data Pertumbuhan Koleksi"}
              </label>
            </div>
          </div>
        </div>

        {/* TABEL DATA */}
        <div className="bg-white rounded-2xl border border-[#C9D4E1] shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#C9D4E1]">
            <h2 className="text-[18px] font-semibold dashboard-title">
              Daftar Konten
            </h2>
            {data.length > 0 && (
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 bg-[#3F5E84] text-white text-sm px-4 py-2 rounded-md hover:bg-[#324E70] transition"
              >
                Hapus Semua Data
              </button>
            )}
          </div>

          {data.length === 0 ? (
            <p className="text-gray-500 text-sm mb-6">
              Belum ada data yang diimport.
            </p>
          ) : (
            <table className="min-w-full text-[15px] text-[#3F5E84]">
              <thead className="bg-[#EAF0F8] text-[#3F5E84] font-semibold">
                <tr>
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="border-t border-[#C9D4E1] hover:bg-[#F7FAFF] transition"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    {headers.map((header) => (
                      <td
                        key={header}
                        className="py-3 px-5 text-gray-700 text-center"
                      >
                        {item.data[header] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* CHART DALAM CARD */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-slate-700 font-semibold mb-4 text-sm">
              📈 Visualisasi Data Serah Simpan
            </h3>
            <div className="w-full h-[400px]">
              <SerahsimpanChart data={chartData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
