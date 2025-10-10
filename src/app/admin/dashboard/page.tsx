"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // contoh sederhana: kalau belum login, redirect ke login
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Dashboard Admin
        </h1>
        <p className="text-gray-700 mb-8">
          Selamat datang di halaman Dashboard DISPUSIPDA Jawa Barat 🎉
        </p>

        <div className="space-x-4">
          <button
            onClick={() => alert("Lihat Data Pengguna")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Lihat Data
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
          >
            Logout
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-8">
          © 2025 DISPUSIPDA Jawa Barat
        </p>
      </div>
    </div>
  );
}
