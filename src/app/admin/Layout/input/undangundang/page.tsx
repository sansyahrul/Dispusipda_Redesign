"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import { kategoriDummy } from "../../Datatable/const/kategoridummy";
import { Edit, Trash2 } from "lucide-react";

type FormDataType = {
  judul_undang_undang: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
};

type UndangUndangItem = {
  id: number;
  judul_undang_undang: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: number;
  isi: string | null;
};

export default function FormUndangUndangPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dataList, setDataList] = useState<UndangUndangItem[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
    judul_undang_undang: "",
    tanggal_publish: new Date().toISOString().slice(0, 10),
    jam_publish: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    jenis_berita: "Undang-Undang",
    id_kategori: "1",
    isi: "",
  });

  // ============================
  // 🔁 Fetch Data dari API
  // ============================
  const fetchData = async () => {
    try {
      const res = await fetch("/api/input/undangundang");
      if (!res.ok) throw new Error("Gagal memuat data");
      const result: UndangUndangItem[] = await res.json();
      setDataList(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  // 📝 Handle Form Change
  // ============================
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================
  // 🚀 Submit Data
  // ============================
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/input/undangundang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Undang-Undang berhasil disimpan 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setFormData({
        judul_undang_undang: "",
        tanggal_publish: new Date().toISOString().slice(0, 10),
        jam_publish: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        jenis_berita: "Undang-Undang",
        id_kategori: "1",
        isi: "",
      });

      fetchData();
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // 🗑️ Delete Data
  // ============================
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Hapus Data?",
      text: "Yakin ingin menghapus data ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/input/undangundang?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      await Swal.fire({
        title: "Dihapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      fetchData();
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // ============================
  // ✏️ Edit Data
  // ============================
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<UndangUndangItem | null>(null);

  const openEditModal = (item: UndangUndangItem) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;

    try {
      const res = await fetch(`/api/input/undangundang?id=${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Gagal memperbarui data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Undang-Undang berhasil diperbarui 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setShowEditModal(false);
      fetchData();
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat memperbarui data.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-8">
        {/* FORM SECTION */}
        <div
          className="rounded-lg shadow-sm p-8 mb-10"
          style={{
            backgroundColor: "#F9FCFF",
            borderColor: "#C9D4E1",
            borderWidth: "1px",
          }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Tambah Data Undang-Undang
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Judul Undang-Undang"
              name="judul_undang_undang"
              type="text"
              value={formData.judul_undang_undang}
              onChange={handleChange}
              placeholder="Masukkan judul undang-undang..."
              required
            />

            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Tanggal Publish"
                name="tanggal_publish"
                type="date"
                value={formData.tanggal_publish}
                onChange={handleChange}
              />
              <InputField
                label="Jam Publish"
                name="jam_publish"
                type="time"
                value={formData.jam_publish}
                onChange={handleChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <SelectField
                label="Jenis Berita"
                name="jenis_berita"
                value={formData.jenis_berita}
                onChange={handleChange}
                options={[{ value: "Undang-Undang", label: "Undang-Undang" }]}
              />
              <SelectField
                label="Kategori"
                name="id_kategori"
                value={formData.id_kategori}
                onChange={handleChange}
                options={kategoriDummy}
              />
            </div>

            <TextAreaField
              label="Isi Konten"
              name="isi"
              value={formData.isi}
              onChange={handleChange}
              placeholder="Tulis isi undang-undang..."
              rows={6}
            />

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="reset"
                className="px-8 py-2.5 bg-gray-300 text-slate-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 text-white rounded-md font-medium transition-colors"
                style={{ backgroundColor: "#154D71" }}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Undang-Undang</h2>
          {loading ? (
            <div className="text-center py-6 text-gray-500">Memuat data...</div>
          ) : dataList.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Belum ada data Undang-Undang
            </div>
          ) : (
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-800 uppercase text-xs font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Judul</th>
                  <th className="py-3 px-4 text-left">Tanggal</th>
                  <th className="py-3 px-4 text-left">Jenis</th>
                  <th className="py-3 px-4 text-left">Kategori</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{item.judul_undang_undang}</td>
                    <td className="py-3 px-4">
                      {new Date(item.tanggal_publish).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>
                    <td className="py-3 px-4">{item.jenis_berita}</td>
                    <td className="py-3 px-4">
                      {
                        kategoriDummy.find(
                          (k) => k.value === item.id_kategori.toString()
                        )?.label
                      }
                    </td>
                    <td className="py-3 px-4 text-center space-x-3">
                      <button onClick={() => openEditModal(item)}>
                        <Edit
                          className="inline w-4 h-4"
                          style={{ color: "#008DE1" }}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className=" hover:text-red-800"
                      >
                        <Trash2
                          className="inline w-4 h-4"
                          style={{ color: "#7DBBFF" }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ======== MODAL EDIT ======== */}
      {showEditModal && editData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="rounded-lg shadow-sm p-8 w-full max-w-2xl relative border border-[#C9D4E1]"
            style={{ backgroundColor: "#F9FCFF" }}
          >
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Undang-Undang
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Judul */}
              <InputField
                label="Judul Undang-Undang"
                name="judul_undang_undang"
                type="text"
                value={editData.judul_undang_undang}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    judul_undang_undang: e.target.value,
                  })
                }
              />

              {/* Tanggal & Jam */}
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Tanggal Publish"
                  name="tanggal_publish"
                  type="date"
                  value={editData.tanggal_publish.slice(0, 10)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      tanggal_publish: e.target.value,
                    })
                  }
                />
                <InputField
                  label="Jam Publish"
                  name="jam_publish"
                  type="time"
                  value={editData.jam_publish}
                  onChange={(e) =>
                    setEditData({ ...editData, jam_publish: e.target.value })
                  }
                />
              </div>

              {/* Jenis & Kategori */}
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField
                  label="Jenis Berita"
                  name="jenis_berita"
                  value={editData.jenis_berita}
                  onChange={(e) =>
                    setEditData({ ...editData, jenis_berita: e.target.value })
                  }
                  options={[{ value: "Undang-Undang", label: "Undang-Undang" }]}
                />
                <SelectField
                  label="Kategori"
                  name="id_kategori"
                  value={String(editData.id_kategori)}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      id_kategori: Number(e.target.value),
                    })
                  }
                  options={kategoriDummy}
                />
              </div>

              {/* Isi */}
              <TextAreaField
                label="Isi Konten"
                name="isi"
                value={editData.isi || ""}
                onChange={(e) =>
                  setEditData({ ...editData, isi: e.target.value })
                }
                placeholder="Tulis isi undang-undang..."
                rows={6}
              />

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-8 py-2.5 bg-gray-300 text-slate-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 text-white rounded-md font-medium transition-colors"
                  style={{ backgroundColor: "#154D71" }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable Fields */
interface InputFieldProps {
  label: string;
  name: keyof FormDataType;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}: InputFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: keyof FormDataType;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}
function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  name: keyof FormDataType;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
}
function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-600">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
