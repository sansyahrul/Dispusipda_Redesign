"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import { kategoriDummy } from "../../Datatable/const/kategoridummy";
import { Edit, Trash2, X } from "lucide-react";

type FormDataType = {
  judul_section: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
  gambar: File | null;
};

type HeroSectionItem = {
  id: number;
  judul_section: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: number;
  isi: string | null;
  gambar_url?: string | null;
};

export default function FormHeroSection() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FormDataType>({
    judul_section: "",
    tanggal_publish: new Date().toISOString().slice(0, 10),
    jam_publish: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    jenis_berita: "Hero_section",
    id_kategori: "1",
    isi: "",
    gambar: null,
  });

  const [heroData, setHeroData] = useState<HeroSectionItem[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<HeroSectionItem | null>(null);

  const fetchHeroData = async () => {
    try {
      const res = await fetch("/api/input/herosection");
      if (!res.ok) throw new Error("Gagal memuat data Hero Section");
      const result: HeroSectionItem[] = await res.json();
      setHeroData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroData();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files && files.length > 0 ? files[0] : null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const form = new FormData();
    (Object.keys(formData) as Array<keyof FormDataType>).forEach((key) => {
      const value = formData[key];
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    });

    try {
      const res = await fetch("/api/input/herosection", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Hero Section berhasil disimpan 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setFormData({
        judul_section: "",
        tanggal_publish: new Date().toISOString().slice(0, 10),
        jam_publish: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        jenis_berita: "Hero_section",
        id_kategori: "1",
        isi: "",
        gambar: null,
      });

      fetchHeroData();
    } catch (err) {
      console.error(err);
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
      const res = await fetch(`/api/input/herosection?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      await Swal.fire({
        title: "Dihapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      fetchHeroData();
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const openEditModal = (item: HeroSectionItem) => {
    setEditData(item);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;

    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/input/herosection?id=${editData.id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Gagal memperbarui data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data berhasil diperbarui 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setShowEditModal(false);
      setEditData(null);
      fetchHeroData();
    } catch {
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
        {/* ======== FORM TAMBAH ======== */}
        <div
          className="rounded-lg shadow-sm p-8 mb-10 border border-[#C9D4E1]"
          style={{ backgroundColor: "#F9FCFF" }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Tambah Hero Section
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Judul Section"
              name="judul_section"
              type="text"
              value={formData.judul_section}
              onChange={handleChange}
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
                options={[{ value: "Hero_section", label: "Hero Section" }]}
              />
              <SelectField
                label="Kategori"
                name="id_kategori"
                value={formData.id_kategori}
                onChange={handleChange}
                options={kategoriDummy}
              />
            </div>

            <FileField
              label="Upload Gambar"
              name="gambar"
              accept="image/*"
              onChange={handleFileChange}
            />
            <TextAreaField
              label="Isi Konten"
              name="isi"
              value={formData.isi}
              onChange={handleChange}
              placeholder="Tulis isi hero section..."
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

        {/* ======== TABEL ======== */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Hero Section</h2>
          {loading ? (
            <div className="text-center py-6 text-gray-500">Memuat data...</div>
          ) : heroData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Belum ada data Hero Section
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
                {heroData.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{item.judul_section}</td>
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
                      <button
                        onClick={() => openEditModal(item)}
                        className="hover:text-blue-800"
                      >
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

        {/* ======== MODAL EDIT ======== */}
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
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Edit Hero Section
              </h2>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Judul */}
                <InputField
                  label="Judul Section"
                  name="judul_section"
                  type="text"
                  value={editData.judul_section}
                  onChange={(e) =>
                    setEditData({ ...editData, judul_section: e.target.value })
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
                      setEditData({
                        ...editData,
                        jam_publish: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Jenis Berita & Kategori */}
                <div className="grid md:grid-cols-2 gap-6">
                  <SelectField
                    label="Jenis Berita"
                    name="jenis_berita"
                    value={editData.jenis_berita}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        jenis_berita: e.target.value,
                      })
                    }
                    options={[{ value: "Hero_section", label: "Hero Section" }]}
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

                {/* Isi Konten */}
                <TextAreaField
                  label="Isi Konten"
                  name="isi"
                  value={editData.isi || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, isi: e.target.value })
                  }
                  placeholder="Tulis isi hero section..."
                  rows={6}
                />

                {/* Gambar */}
                <FileField
                  label="Upload Gambar Baru (opsional)"
                  name="gambar"
                  accept="image/*"
                  onChange={() => {}}
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
      </main>
    </div>
  );
}

/* ==============================
   Reusable Input Components
============================== */
interface InputFieldProps {
  label: string;
  name: keyof FormDataType;
  type: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}
function InputField({
  label,
  name,
  type,
  value,
  onChange,
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
        required={required}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400"
      />
    </div>
  );
}

interface FileFieldProps {
  label: string;
  name: keyof FormDataType;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
function FileField({ label, name, accept, onChange }: FileFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-600">{label}</label>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:bg-gray-50 hover:file:bg-gray-100"
      />
    </div>
  );
}
