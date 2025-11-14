import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

// Tipe untuk setiap baris hasil Excel (dinamis tapi type-safe)
type ExcelRow = (string | number | null)[];
type ExcelData = ExcelRow[];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file diunggah" },
        { status: 400 }
      );
    }

    // Ambil buffer file Excel
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Baca workbook
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Ambil semua data dalam bentuk 2D array (tanpa header tetap)
    const data = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    }) as ExcelData;

    if (data.length === 0) {
      return NextResponse.json({ error: "File kosong" }, { status: 400 });
    }

    // Baris pertama = header, sisanya = data isi
    const headers = data[0].map((h, i) => (h ? String(h) : `Kolom_${i + 1}`));
    const rows = data.slice(1);

    // Simpan ke database
    for (const row of rows) {
      // Gabungkan header dan nilai menjadi object JSON
      const record = Object.fromEntries(
        headers.map((header, index) => [header, row[index] ?? null])
      );

      await prisma.statistikImport.create({
        data: {
          data: record,
        },
      });
    }

    return NextResponse.json({
      message: ` Berhasil impor ${rows.length} baris data dinamis.`,
    });
  } catch (err) {
    console.error(" Error import:", err);
    return NextResponse.json(
      { error: "Gagal impor data Excel" },
      { status: 500 }
    );
  }
}
