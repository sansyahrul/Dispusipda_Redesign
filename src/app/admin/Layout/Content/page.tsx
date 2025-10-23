"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Sidebar from "../../component/sidebar";

// 📦 Type untuk form
type FormData = {
  judul_berita: string;
  icon: string;
  tanggal_publish: string;
  jam_publish: string;
  status_berita: string;
  jenis_berita: string;
  id_kategori: string;
  urutan: number;
  keywords: string;
  isi: string;
  gambar: File | null;
};

// 🧩 Data dummy kategori
const kategoriDummy = [
  { id_kategori: "1", nama_kategori: "Berita" },
  { id_kategori: "2", nama_kategori: "Profil" },
  { id_kategori: "3", nama_kategori: "Layanan" },
];

export default function ContentForm() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    judul_berita: "",
    icon: "",
    tanggal_publish: new Date().toISOString().slice(0, 10),
    jam_publish: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status_berita: "Publish",
    jenis_berita: "Berita",
    id_kategori: "1",
    urutan: 1,
    keywords: "",
    isi: "",
    gambar: null,
  });

  // 🧠 Handle perubahan input umum
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, gambar: file }));
  };

  // 🚀 Handle submit form
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Data form:", formData);
    alert("Data berhasil dikirim (cek console)");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <main className="flex-1 p-6 md:ml-0">
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              Tambah Berita / Profil / Layanan
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 🔹 Row 1 */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Judul berita/profil/layanan"
                name="judul_berita"
                type="text"
                placeholder="Judul berita/profil/layanan"
                value={formData.judul_berita}
                onChange={handleChange}
                required
              />
              <InputField
                label="Icon berita/profil/layanan"
                name="icon"
                type="text"
                placeholder="Icon berita/profil/layanan"
                value={formData.icon}
                onChange={handleChange}
              />
            </div>

            {/* 🔹 Row 2 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
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

              <SelectField
                label="Status Berita"
                name="status_berita"
                value={formData.status_berita}
                onChange={handleChange}
                options={[
                  { value: "Publish", label: "Publikasikan" },
                  { value: "Draft", label: "Simpan sebagai draft" },
                ]}
              />
            </div>

            {/* 🔹 Row 3 */}
            <div className="grid md:grid-cols-4 gap-6">
              <SelectField
                label="Jenis Berita"
                name="jenis_berita"
                value={formData.jenis_berita}
                onChange={handleChange}
                options={[
                  { value: "Berita", label: "Berita" },
                  { value: "Profil", label: "Profil" },
                  { value: "Layanan", label: "Layanan" },
                ]}
              />

              <SelectField
                label="Kategori Berita"
                name="id_kategori"
                value={formData.id_kategori}
                onChange={handleChange}
                options={kategoriDummy.map((kategori) => ({
                  value: kategori.id_kategori,
                  label: kategori.nama_kategori,
                }))}
              />

              <FileField
                label="Upload Gambar"
                name="gambar"
                onChange={handleFileChange}
              />

              <InputField
                label="Urutan"
                name="urutan"
                type="number"
                value={formData.urutan}
                onChange={handleChange}
              />
            </div>

            {/* 🔹 Row 4 */}
            <TextAreaField
              label="Keywords dan Ringkasan"
              name="keywords"
              placeholder="Keywords (untuk pencarian Google)"
              value={formData.keywords}
              onChange={handleChange}
            />

            <TextAreaField
              label="Isi Berita"
              name="isi"
              placeholder="Isi berita"
              value={formData.isi}
              onChange={handleChange}
              rows={8}
            />

            {/* 🔹 Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="reset"
                className="px-6 py-3 border rounded-lg text-slate-600 hover:bg-slate-100 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Simpan Data
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* 🧩 Komponen kecil untuk input dan select agar kode rapi */
type InputProps = {
  label: string;
  name: string;
  type: string;
  value?: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
};
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  required,
}: InputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}

type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
};
function SelectField({ label, name, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
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

type TextAreaProps = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
};
function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextAreaProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}

type FileProps = {
  label: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};
function FileField({ label, name, onChange }: FileProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}
