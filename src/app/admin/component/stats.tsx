"use client";

import React from "react";
import { Users, Ticket, DollarSign, TrendingUp } from "lucide-react";

// Data statistik
const stats = [
  { title: "Users", value: "1,200", icon: Users, color: "bg-blue-500" },
  {
    title: "Tickets Sold",
    value: "3,452",
    icon: Ticket,
    color: "bg-green-500",
  },
  {
    title: "Revenue",
    value: "$12,340",
    icon: DollarSign,
    color: "bg-yellow-500",
  },
  { title: "Growth", value: "+12%", icon: TrendingUp, color: "bg-purple-500" },
];

// Komponen utama
export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white shadow-sm rounded-2xl p-5 flex items-center justify-between border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div>
            <p className="text-slate-500 text-sm">{item.title}</p>
            <h2 className="text-xl font-semibold">{item.value}</h2>
          </div>
          <div className={`${item.color} p-3 rounded-full text-white`}>
            <item.icon className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
