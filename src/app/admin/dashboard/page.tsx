"use client";

import Sidebar from "../component/sidebar";
import RecentOrders from "../component/recentorder";
import Chart from "../component/chart";
import DashboardStats from "../component/stats";
import Image from "next/image";

import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 md:ml-0 p-6 space-y-8 w-full">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 border rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Welcome back, here&apos;s what&apos;s happening today
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

        {/* Stats Section */}

        <DashboardStats />
        {/* Chart Section */}
        <Chart />

        {/* Recent Orders Table */}
        <RecentOrders />
      </div>
    </div>
  );
}
