"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ChevronDown,
  ChevronRight,
  Layout,
  ChartNoAxesColumnIncreasing,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Data Tabel", icon: Calendar, path: "/admin/Layout/Datatable" },
  { name: "Users", icon: Users, path: "/admin/Layout/Users" },
];

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Ambil role user dari session NextAuth
  const { data: session } = useSession();
  const role = session?.user?.role;

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const statistikItems = [
    { name: "Pertumbuhan Koleksi", path: "/admin/Layout/Statistik" },
    { name: "Tren Serah Simpan", path: "/admin/Layout/Serahsimpan" },
  ];

  const inputItems = [
    {
      name: "Hero Section",
      icon: Layout,
      path: "/admin/Layout/input/herosection",
    },
    {
      name: "Undang-Undang",
      icon: Layout,
      path: "/admin/Layout/input/undangundang",
    },
    {
      name: "Peran & Tujuan",
      icon: Layout,
      path: "/admin/Layout/input/tujuan",
    },
    {
      name: "Profile",
      icon: Layout,
      path: "/admin/Layout/input/Profile",
    },
  ];

  const toggleDropdown = (menu: string) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const handleNavClick = (path: string) => {
    setOpenDropdown(null);
    router.push(path);
  };

  return (
    <>
      <aside
        className={`fixed md:static z-20 top-0 left-0 h-full flex flex-col justify-between bg-white shadow-lg border-r border-slate-200 w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Top section */}
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-xl font-bold text-[#3F5E84]">
              Perpustakaan Deposit
            </h2>

            {/*  Nama user yang login */}
            {session?.user && (
              <p className="text-sm text-slate-600 mt-1">
                {session.user.name} ({session.user.role})
              </p>
            )}

            <button
              className="md:hidden text-slate-500"
              onClick={() => setSidebarOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems
              .filter((item) => {
                // ❗ FILTER MENU USERS: hanya superadmin yang boleh melihat
                if (item.name === "Users" && role !== "superadmin")
                  return false;
                return true;
              })
              .map((item) => {
                const isActive = pathname === item.path;

                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium ${
                      isActive
                        ? "bg-[#E7EEF8] text-[#3F5E84]"
                        : "text-slate-700 hover:bg-[#EFF4FB] hover:text-[#3F5E84]"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}

            {/* Statistik Koleksi */}
            <div className="pt-2">
              <button
                onClick={() => toggleDropdown("statistik")}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors font-medium ${
                  openDropdown === "statistik"
                    ? "bg-[#E7EEF8] text-[#3F5E84]"
                    : "text-slate-700 hover:bg-[#EFF4FB] hover:text-[#3F5E84]"
                }`}
              >
                <div className="flex items-center">
                  <ChartNoAxesColumnIncreasing className="w-5 h-5 mr-3" />
                  Statistik Koleksi
                </div>
                {openDropdown === "statistik" ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
              </button>

              {openDropdown === "statistik" && (
                <div className="mt-2 ml-6 space-y-2 border-l-2 border-[#E7EEF8] pl-3">
                  {statistikItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <button
                        key={item.name}
                        onClick={() => router.push(item.path)}
                        className={`flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-[#E7EEF8] text-[#3F5E84] font-semibold"
                            : "text-slate-700 hover:bg-[#EFF4FB] hover:text-[#3F5E84]"
                        }`}
                      >
                        <Layout className="w-4 h-4" />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="pt-2">
              <button
                onClick={() => toggleDropdown("input")}
                className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-colors font-medium ${
                  openDropdown === "input"
                    ? "bg-[#E7EEF8] text-[#3F5E84]"
                    : "text-slate-700 hover:bg-[#EFF4FB] hover:text-[#3F5E84]"
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3" />
                  Input
                </div>
                {openDropdown === "input" ? (
                  <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                )}
              </button>

              {openDropdown === "input" && (
                <div className="mt-2 ml-6 space-y-2 border-l-2 border-[#E7EEF8] pl-3">
                  {inputItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                      <button
                        key={item.name}
                        onClick={() => router.push(item.path)}
                        className={`flex items-center gap-2 w-full text-left px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? "bg-[#E7EEF8] text-[#3F5E84] font-semibold"
                            : "text-slate-700 hover:bg-[#EFF4FB] hover:text-[#3F5E84]"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Logout bawah */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium text-slate-700 hover:bg-[#EFF4FB] hover:text-[#3F5E84]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
        ></div>
      )}
    </>
  );
}
