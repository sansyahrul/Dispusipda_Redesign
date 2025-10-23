"use client";

import React from "react";

const recentOrders = [
  {
    id: "ORD-001",
    user: "Alice Johnson",
    event: "Music Fest",
    amount: "$120",
    status: "paid",
    time: "2 hours ago",
  },
  {
    id: "ORD-002",
    user: "Bob Smith",
    event: "Tech Conference",
    amount: "$85",
    status: "pending",
    time: "5 hours ago",
  },
  {
    id: "ORD-003",
    user: "Clara Davis",
    event: "Art Workshop",
    amount: "$40",
    status: "paid",
    time: "8 hours ago",
  },
  {
    id: "ORD-004",
    user: "David Wilson",
    event: "Food Carnival",
    amount: "$95",
    status: "canceled",
    time: "1 day ago",
  },
];
export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">
        Data Terakhir
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Event</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium">{order.id}</td>
                <td className="px-6 py-4">{order.user}</td>
                <td className="px-6 py-4">{order.event}</td>
                <td className="px-6 py-4 font-medium text-slate-800">
                  {order.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "canceled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
