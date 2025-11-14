"use client";

import Sidebar from "../../component/sidebar";
import Image from "next/image";
import { Menu, Edit, Trash2, Plus } from "lucide-react";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import DeleteAlertDialog from "../Alert/hapus/page";

type UserItem = {
  id: number;
  name: string;
  role: string;
  email: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
};

export default function DatatableUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧩 State modal hapus
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 🧩 State modal edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<Partial<UserItem>>({});

  // 🧩 Alert sukses
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // 🧠 Ambil data user
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Gagal memuat data user");
        const result: UserItem[] = await res.json();
        setData(result);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🗑️ Hapus user
  const openDeleteDialog = (id: number) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/user/${deleteId}`, { method: "DELETE" });
      if (!res.ok) return;

      setData((prev) => prev.filter((item) => item.id !== deleteId));
      setShowDeleteDialog(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 2000);
    } catch (error) {
      console.error("Gagal menghapus user:", error);
    }
  };

  // ✏️ Edit user
  const openEditModal = (user: UserItem) => {
    setEditData(user);
    setShowEditModal(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editData.id) return;

    // Hilangkan password jika kosong
    const updatedData = { ...editData };
    if (!updatedData.password) delete updatedData.password;

    try {
      const res = await fetch(`/api/user/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Gagal update user");

      // Update tabel lokal
      setData((prev) =>
        prev.map((u) => (u.id === editData.id ? { ...u, ...updatedData } : u))
      );

      setShowEditModal(false);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 2000);
    } catch (err) {
      console.error("Gagal update user:", err);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-[#3F5E84]">
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
            <h1 className="text-2xl font-bold">Data User</h1>
            <p className="text-sm text-slate-500 mt-1">
              Menampilkan data akun user dari database
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#C9D4E1] shadow-sm overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b border-[#C9D4E1]">
            <h2 className="text-[18px] font-semibold">Daftar User</h2>
            <Link
              href="/admin/Layout/Users/adduser"
              className="flex items-center gap-2 bg-[#3F5E84] text-white text-sm px-4 py-2 rounded-md hover:bg-[#324E70] transition"
            >
              <Plus className="w-4 h-4" /> Tambah User
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6 text-slate-500">Loading...</div>
            ) : (
              <table className="min-w-full text-[15px] text-[#3F5E84]">
                <thead className="bg-[#EAF0F8] font-semibold">
                  <tr>
                    <th className="py-3 px-5 text-left">#</th>
                    <th className="py-3 px-5 text-left">Nama</th>
                    <th className="py-3 px-5 text-left">Email</th>
                    <th className="py-3 px-5 text-left">Role</th>
                    <th className="py-3 px-5 text-left">Dibuat</th>
                    <th className="py-3 px-5 text-left">Diperbarui</th>
                    <th className="py-3 px-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 ? (
                    data.map((user, index) => (
                      <tr
                        key={user.id}
                        className="border-t border-[#C9D4E1] hover:bg-[#F7FAFF] transition"
                      >
                        <td className="py-3 px-5">{index + 1}</td>
                        <td className="py-3 px-5 font-medium">{user.name}</td>
                        <td className="py-3 px-5">{user.email}</td>
                        <td className="py-3 px-5 capitalize">{user.role}</td>
                        <td className="py-3 px-5">
                          {new Date(user.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-5">
                          {new Date(user.updatedAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="py-3 px-5 text-center space-x-3">
                          <button
                            onClick={() => openEditModal(user)}
                            className="hover:text-blue-700 transition"
                            title="Edit User"
                          >
                            <Edit className="inline w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            title="Hapus"
                            onClick={() => openDeleteDialog(user.id)}
                            className="text-red-500 hover:text-red-700 transition"
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
                        Tidak ada data user
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Modal Edit */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#F9FCFF] rounded-2xl shadow-xl border border-[#C9D4E1] w-full max-w-md p-6 relative animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-[#3F5E84]">
              Edit User
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name || ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email || ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Password (Opsional)
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Biarkan kosong jika tidak ingin mengubah"
                  value={editData.password || ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Role</label>
                <select
                  name="role"
                  value={editData.role || ""}
                  onChange={handleEditChange}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#3F5E84] text-white rounded-lg hover:bg-[#324E70]"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Alert */}
      <DeleteAlertDialog
        isOpen={showDeleteDialog}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteDialog(false)}
      />

      {showSuccessAlert && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn">
          ✅ Berhasil disimpan!
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
