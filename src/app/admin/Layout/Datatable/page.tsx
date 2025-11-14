"use client";

import Sidebar from "../../component/sidebar";
import Image from "next/image";
import { Menu, Edit, Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import DeleteAlertDialog from "@/app/admin/Layout/Alert/hapus/page";
import { kategoriDummy } from "./const/kategoridummy";

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
  youtube_link: string;
};

export default function Datatable() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Tambahan untuk alert hapus
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  // 🔥 Saat tombol "Ya, Hapus!" diklik di popup
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/content/${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(`Gagal menghapus data: ${err.error || res.statusText}`);
        return;
      }

      // ✅ Update state agar tampilan langsung berubah
      setData((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Terjadi kesalahan saat menghapus data");
    } finally {
      setDeleteId(null); // Tutup dialog
    }
  };

  // 🔥 Saat klik icon hapus
  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 md:ml-0 p-6 w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 border rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold dashboard-title">Data Konten</h1>
            <p className="text-sm text-slate-500 mt-1">
              Menampilkan data berita, profil, dan layanan dari database
            </p>
          </div>

          <Image
            src="/profile.svg"
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500"
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl border border-[#C9D4E1] shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#C9D4E1]">
            <h2 className="text-[18px] font-semibold dashboard-title">
              Daftar Konten
            </h2>
            <Link
              href="/admin/Layout/Content"
              className="flex items-center gap-2 bg-[#3F5E84] text-white text-sm px-4 py-2 rounded-md hover:bg-[#324E70] transition"
            >
              <Plus className="w-4 h-4" /> Tambah Data
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6 text-slate-500">Loading...</div>
            ) : (
              <table className="min-w-full text-[15px] text-[#3F5E84]">
                <thead className="bg-[#EAF0F8] text-[#3F5E84] font-semibold">
                  <tr>
                    <th className="py-3 px-5 text-left">#</th>
                    <th className="py-3 px-5 text-left">Judul</th>
                    <th className="py-3 px-5 text-left">Tanggal</th>
                    <th className="py-3 px-5 text-left">Status</th>
                    <th className="py-3 px-5 text-left">Jenis</th>
                    <th className="py-3 px-5 text-left">Kategori</th>
                    <th className="py-3 px-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-t border-[#C9D4E1] hover:bg-[#F7FAFF] transition"
                      >
                        <td className="py-3 px-5">{index + 1}</td>
                        <td className="py-3 px-5">{item.judul_berita}</td>
                        <td className="py-3 px-5">
                          {item.tanggal_publish
                            ? new Date(item.tanggal_publish).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="py-3 px-5">{item.status_berita}</td>
                        <td className="py-3 px-5">{item.jenis_berita}</td>
                        <td className="py-3 px-5">
                          {
                            kategoriDummy.find(
                              (k) => k.value === item.id_kategori.toString()
                            )?.label
                          }
                        </td>
                        <td className="py-3 px-5 text-center space-x-3">
                          <Link
                            href={`/admin/Layout/Datatable/editcontent/${item.id}`}
                            className="text-[#3F5E84] hover:text-[#1E3A8A] transition"
                          >
                            <Edit
                              className="inline w-4 h-4"
                              style={{ color: "#008DE1" }}
                            />
                          </Link>
                          <button
                            title="Hapus"
                            onClick={() => handleDeleteClick(item.id)}
                            className="transition"
                            style={{ color: "#7DBBFF" }}
                          >
                            <Trash2 className="inline w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-slate-500"
                      >
                        Tidak ada data tersedia
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Card Content Section */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 mt-8">
          {data.map((item) => {
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
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-lg text-slate-800 leading-snug line-clamp-2">
                    {item.judul_berita}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.tanggal_publish
                      ? new Date(item.tanggal_publish).toLocaleDateString(
                          "id-ID",
                          { year: "numeric", month: "short", day: "numeric" }
                        )
                      : "-"}{" "}
                    • {item.status_berita}
                  </p>
                </div>

                {/* Media Section */}
                <div className="relative">
                  {youtubeThumbnail && (
                    <a
                      href={item.youtube_link}
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
                        <div className="bg-white rounded-full p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="black"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  )}

                  {!youtubeThumbnail && item.gambar_url && (
                    <Image
                      src={item.gambar_url}
                      alt="Gambar Konten"
                      width={400}
                      height={250}
                      className="w-full h-56 object-cover"
                    />
                  )}

                  {item.video_url && (
                    <video
                      src={item.video_url}
                      controls
                      className="w-full h-56 object-cover"
                    />
                  )}

                  {item.dokumen_url && (
                    <iframe
                      src={item.dokumen_url}
                      className="w-full h-64 border-t border-slate-200"
                    />
                  )}
                </div>

                {item.isi && (
                  <div
                    className="p-4 text-sm text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.isi }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ✅ Popup konfirmasi hapus */}
      <DeleteAlertDialog
        isOpen={deleteId !== null}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
