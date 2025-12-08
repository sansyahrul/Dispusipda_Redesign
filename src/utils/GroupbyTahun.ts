export interface StatistikChartData {
  Tahun: string;
  [key: string]: number | string;
}

export interface Serahsimpan {
  id: number;
  data: Record<string, string | number | null>;
  createdAt: string;
}

/**
 * Menggabungkan data berdasarkan Tahun dan menjumlahkan angka-angka.
 * Bisa digunakan untuk semua halaman (Serah Simpan, Koleksi, dll)
 */
export function groupByTahun(
  result: Serahsimpan[],
  headers: string[]
): StatistikChartData[] {
  // 1. Format baris data menjadi angka / string
  const formattedRows: StatistikChartData[] = result.map((item) => {
    const row: StatistikChartData = { Tahun: "" };

    headers.forEach((key) => {
      const raw = item.data[key];

      // Jika kolom Tahun
      if (key.toLowerCase() === "tahun") {
        row.Tahun = String(raw ?? "");
        return;
      }

      // Konversi numeric
      const numeric = Number(raw);
      row[key] = isNaN(numeric) ? 0 : numeric;
    });

    return row;
  });

  // 2. Grouping berdasarkan Tahun
  const grouped: Record<string, StatistikChartData> = {};

  formattedRows.forEach((row) => {
    const tahun = row.Tahun;

    // Jika tahun belum ada → clone data pertama
    if (!grouped[tahun]) {
      grouped[tahun] = { ...row };
      return;
    }

    // Jika sudah ada → jumlahkan angka
    Object.keys(row).forEach((key) => {
      if (key === "Tahun") return;

      const current = Number(grouped[tahun][key] ?? 0);
      const add = Number(row[key] ?? 0);

      grouped[tahun][key] = current + add;
    });
  });

  // Kembalikan sebagai array
  return Object.values(grouped);
}
