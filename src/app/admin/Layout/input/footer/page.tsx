"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation"; // ✅ Tambah ini
import Sidebar from "../../../component/sidebar";
import { kategoriDummy } from "../../Datatable/const/kategoridummy";

type FormDataType = {
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
  video: File | null;
  dokumen: File | null;
};

type Option = { value: string; label: string };

export default function ContentForm() {
  const router = useRouter(); // ✅ gunakan router untuk redirect
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
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
    video: null,
    dokumen: null,
  });

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

    const form = new FormData();
    (Object.keys(formData) as Array<keyof FormDataType>).forEach((key) => {
      const value = formData[key];
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    });

    try {
      const res = await fetch("/api/content", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload gagal");

      alert("✅ Data berhasil disimpan!");

      // ✅ Redirect otomatis ke DataTable
      router.push("/admin/Layout/Datatable");
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan saat upload.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-8">
            Tambah Berita / Profil / Layanan
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Judul"
                name="judul_berita"
                type="text"
                value={formData.judul_berita}
                onChange={handleChange}
                placeholder="Masukkan judul"
                required
              />
              <InputField
                label="Icon"
                name="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
                placeholder="Masukkan icon"
              />
            </div>

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

            <div className="grid md:grid-cols-3 gap-6">
              <SelectField
                label="Status"
                name="status_berita"
                value={formData.status_berita}
                onChange={handleChange}
                options={[
                  { value: "Publish", label: "Publikasikan" },
                  { value: "Draft", label: "Simpan sebagai draft" },
                ]}
              />
              <SelectField
                label="Jenis"
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
                label="Kategori"
                name="id_kategori"
                value={formData.id_kategori}
                onChange={handleChange}
                options={kategoriDummy}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="Urutan"
                name="urutan"
                type="number"
                value={formData.urutan}
                onChange={handleChange}
              />
              <FileField
                label="Upload Gambar"
                name="gambar"
                accept="image/*"
                onChange={handleFileChange}
              />
              <FileField
                label="Upload Video"
                name="video"
                accept="video/*"
                onChange={handleFileChange}
              />
            </div>

            <FileField
              label="Upload Dokumen (PDF)"
              name="dokumen"
              accept=".pdf"
              onChange={handleFileChange}
            />

            <TextAreaField
              label="Keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Masukkan keywords..."
            />

            <TextAreaField
              label="Isi Berita"
              name="isi"
              value={formData.isi}
              onChange={handleChange}
              placeholder="Isi berita..."
              rows={8}
            />

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="reset"
                className="px-6 py-3 border rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

/* === Reusable Components === */
interface InputFieldProps {
  label: string;
  name: keyof FormDataType;
  type: string;
  value: string | number;
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
      <label className="block mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: keyof FormDataType;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
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

interface FileFieldProps {
  label: string;
  name: keyof FormDataType;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function FileField({ label, name, accept, onChange }: FileFieldProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-slate-600">
        {label}
      </label>
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}
