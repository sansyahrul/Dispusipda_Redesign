"use client";

import Sidebar from "../../component/sidebar";
import Image from "next/image";
import { Menu, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

export default function Datatable() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data dummy
  const [data, setData] = useState([
    {
      id: 1,
      name: "Event Musik Bandung",
      date: "2025-10-12",
      location: "Bandung",
      tickets: 120,
    },
    {
      id: 2,
      name: "Festival Kuliner",
      date: "2025-11-01",
      location: "Jakarta",
      tickets: 80,
    },
    {
      id: 3,
      name: "Pameran Teknologi",
      date: "2025-09-20",
      location: "Surabaya",
      tickets: 150,
    },
  ]);

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 md:ml-0 p-6 w-full space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 border rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Data Tabel</h1>
            <p className="text-sm text-slate-500 mt-1">
              List data event yang bisa kamu kelola
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-slate-800">Daftar Event</h2>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" /> Tambah Data
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Nama Event</th>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-left">Lokasi</th>
                  <th className="py-3 px-4 text-left">Tiket</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4">{item.location}</td>
                    <td className="py-3 px-4">{item.tickets}</td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="inline w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="inline w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-slate-500">
                      Tidak ada data tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
