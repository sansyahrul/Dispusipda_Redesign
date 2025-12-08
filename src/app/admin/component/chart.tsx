"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface StatistikChartProps {
  data: Record<string, string | number>[];
}

export default function StatistikChart({ data }: StatistikChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#6b7280",
          border: "1px dashed #d1d5db",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        Belum ada data untuk ditampilkan.
      </div>
    );
  }

  const colors = ["#5048E5", "#7DBBFF", "#A0BCE8", "#C9D4E1"];
  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const valueKeys = keys.slice(1);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#374151" }} />
        <YAxis tick={{ fontSize: 12, fill: "#374151" }} />
        <Tooltip />
        <Legend />

        {valueKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            name={key}
            fill={colors[index % colors.length]}
            radius={[6, 6, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
