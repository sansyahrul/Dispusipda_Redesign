"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Sidebar from "@/app/admin/component/sidebar";

export default function AddUser() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menambahkan user");

      await Swal.fire({
        title: "Berhasil!",
        text: "User berhasil ditambahkan 🎉",
        icon: "success",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "OK",
      });

      router.push("/admin/Layout/Users");
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menambahkan user.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6">
        <div>
          <h1 className="text-2xl font-bold dashboard-title mb-10">
            Data User
          </h1>
        </div>
        <div
          className="max-w-5xl mx-auto  border border-slate-200 rounded-2xl shadow-sm p-8"
          style={{ backgroundColor: "#F9FCFF", borderColor: "#C9D4E1" }}
        >
          <h1 className="text-xl dashboard-title mb-8">Tambah User</h1>

          {message && (
            <p
              className={`mb-4 text-center font-semibold ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 ml-10 dashboard-title"
          >
            <div>
              <label className="block text-sm mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Masukkan nama"
              />
            </div>

            <div>
              <label className="block text-sm  mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm  mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Masukkan email"
              />
            </div>

            <div>
              <label className="block text-sm  mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="Masukkan password"
              />
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-100  text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                style={{ backgroundColor: "#154D71" }}
              >
                {loading ? "Menyimpan..." : "Simpan User"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/Layout/Users")}
                className="px-8 py-2.5 bg-gray-300 text-slate-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
