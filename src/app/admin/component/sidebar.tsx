"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Data Tabel", icon: Calendar, path: "/admin/Layout/Datatable" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Content", icon: FileText, path: "/admin/Layout/Content" },
  { name: "Logout", icon: Settings, path: "/" },
];

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-20 top-0 left-0 h-full bg-white shadow-md border-r border-slate-200 w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-bold text-blue-600">
            Perpustakaan Deposit
          </h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            ✖
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
        ></div>
      )}
    </>
  );
}
