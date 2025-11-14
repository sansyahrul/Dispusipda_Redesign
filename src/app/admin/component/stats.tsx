"use client";

import React from "react";
import { File, ChartNoAxesCombined } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    { title: "Koleksi", icon: File },
    { title: "Statistik", icon: ChartNoAxesCombined },
  ];

  return (
    <div className="flex justify-center gap-16 mt-10">
      {stats.map((item) => (
        <button
          key={item.title}
          className="
            flex items-center justify-center gap-3
            border border-[#B0C4DE]
            rounded-xl
            px-12 py-6
            bg-white
            hover:bg-[#f1f5f9]
            transition-all
            duration-200
            text-[#3F5E84]
            font-semibold
            text-[18px]
            shadow-sm
          "
        >
          <span>{item.title}</span>
          <item.icon size={26} strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
