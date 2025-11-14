"use client";

import React from "react";
import {
  LineChart,
  Line,
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

export default function SerahsimpanChart({ data }: StatistikChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[300px] text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg">
        Belum ada data untuk ditampilkan.
      </div>
    );
  }

  // Ambil key dari data pertama
  const keys = Object.keys(data[0]);
  const xKey =
    keys.find((key) => key.toLowerCase().includes("tahun")) || keys[0];

  // Ambil kolom selain tahun
  const valueKeys = keys.filter(
    (key) => key !== xKey && typeof data[0][key] === "number"
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 40, right: 40, left: 10, bottom: 20 }}
      >
        <CartesianGrid stroke="#f1f5f9" strokeWidth={1} />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          domain={[0, "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          iconType="circle"
          wrapperStyle={{
            fontSize: "13px",
            color: "#475569",
            marginBottom: 10,
          }}
        />

        <Line
          type="monotone"
          dataKey={valueKeys[0]}
          stroke="#6474ff"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 6, fill: "#6474ff" }}
        />
        {valueKeys[1] && (
          <Line
            type="monotone"
            dataKey={valueKeys[1]}
            stroke="#ff5cf6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: "#ff5cf6" }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
