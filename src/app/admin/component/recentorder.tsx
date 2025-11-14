"use client";

import React from "react";
import { useState, useEffect } from "react";
import { kategoriDummy } from "../Layout/Datatable/const/kategoridummy";

type ContentItem = {
  id: number;
  judul_berita: string;
  id_kategori: string;
  tanggal_publish: string;
  jam_publish: string;
  status_berita: string;
  jenis_berita: string;
  icon?: string | null;
  keywords?: string | null;
  isi?: string | null;
  gambar_url?: string | null;
  video_url?: string | null;
  dokumen_url?: string | null;
  createdAt?: string;
};

export default function RecentOrders() {
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) throw new Error("Gagal memuat data");
        const result: ContentItem[] = await res.json();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="font-semibold text-slate-800">Daftar Konten</h2>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-6 text-slate-500">Loading...</div>
        ) : (
          <table className="min-w-full text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Judul</th>
                <th className="py-3 px-4 text-left">Tanggal</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Jenis</th>
                <th className="py-3 px-4 text-left">Kategori</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">
                      {item.judul_berita}
                    </td>
                    <td className="py-3 px-4">
                      {item.tanggal_publish
                        ? new Date(item.tanggal_publish).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "-"}
                    </td>
                    <td className="py-3 px-4">{item.status_berita}</td>
                    <td className="py-3 px-4">{item.jenis_berita}</td>
                    <td className="py-3 px-4">
                      {
                        kategoriDummy.find(
                          (k) => k.value === item.id_kategori.toString()
                        )?.label
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    Tidak ada data tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
