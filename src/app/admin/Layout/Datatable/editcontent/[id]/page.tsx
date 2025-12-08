"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/admin/component/sidebar";
import { kategoriDummy } from "../../const/kategoridummy";

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
  youtube_link: string;
};

type Option = { value: string; label: string };

export default function EditContentForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
    youtube_link: "",
  });

  /* ============================================
    LOAD DATA EXISTING
  ============================================ */
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await fetch(`/api/content/${id}`);
      if (!res.ok) {
        Swal.fire("Gagal", "Gagal memuat data", "error");
        return;
      }

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        judul_berita: data.judul_berita ?? "",
        icon: data.icon ?? "",
        tanggal_publish: data.tanggal_publish
          ? new Date(data.tanggal_publish).toISOString().slice(0, 10)
          : prev.tanggal_publish,
        jam_publish: data.jam_publish ?? prev.jam_publish,
        status_berita: data.status_berita ?? "Publish",
        jenis_berita: data.jenis_berita ?? "Berita",
        id_kategori: data.id_kategori ? String(data.id_kategori) : "1",
        urutan: data.urutan ?? 1,
        keywords: data.keywords ?? "",
        isi: data.isi ?? "",
        youtube_link: data.youtube_link ?? "",
      }));
    };

    fetchData();
  }, [id]);

  /* ============================================
    HANDLERS
  ============================================ */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files && files.length > 0 ? files[0] : null,
    }));
  };

  /* ============================================
    SUBMIT UPDATE
  ============================================ */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);

    const form = new FormData();
    (Object.keys(formData) as Array<keyof FormDataType>).forEach((key) => {
      const value = formData[key];
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    });

    try {
      const res = await fetch(`/api/content/${id}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Update gagal");

      await Swal.fire({
        title: "Berhasil!",
        text: "Konten berhasil diperbarui 🎉",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      router.push("/admin/Layout/Datatable");
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat update", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl dashboard-title">Edit Konten</h1>
        </div>

        <div
          className="rounded-lg shadow-sm p-8"
          style={{ backgroundColor: "#F9FCFF", borderColor: "#C9D4E1" }}
        >
          <h2 className="text-xl dashboard-title mb-4">
            Edit Berita / Profil / Layanan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul & Icon */}
            <div className="grid md:grid-cols-2 gap-6 bg-white">
              <InputField
                label="Judul"
                name="judul_berita"
                type="text"
                value={formData.judul_berita}
                onChange={handleChange}
                placeholder="Masukkan judul konten..."
                required
              />
              <InputField
                label="Icon"
                name="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
                placeholder="Contoh: file-text"
              />
            </div>

            {/* Tanggal & Jam */}
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

            {/* Status, Jenis, Kategori */}
            <div className="grid md:grid-cols-3 gap-6">
              <SelectField
                label="Status"
                name="status_berita"
                value={formData.status_berita}
                onChange={handleChange}
                options={[
                  { value: "Publish", label: "Publikasikan" },
                  { value: "Draft", label: "Simpan sebagai Draft" },
                ]}
              />

              <SelectField
                label="Jenis"
                name="jenis_berita"
                value={formData.jenis_berita}
                onChange={handleChange}
                options={[
                  { value: "Berita", label: "Berita" },
                  { value: "Youtube", label: "Youtube" },
                  { value: "Profil", label: "Profil" },
                  { value: "Gambar", label: "Gambar" },
                  { value: "Video", label: "Video" },
                  { value: "PDF", label: "PDF" },
                  { value: "HTML", label: "HTML (ZIP)" },
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

            {/* Urutan + File */}
            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="Urutan"
                name="urutan"
                type="number"
                value={formData.urutan}
                onChange={handleChange}
              />

              {formData.jenis_berita === "Gambar" && (
                <FileField
                  label="Upload Gambar"
                  name="gambar"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}

              {formData.jenis_berita === "Video" && (
                <FileField
                  label="Upload Video"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              )}
            </div>

            {formData.jenis_berita === "PDF" && (
              <FileField
                label="Upload Dokumen (PDF)"
                name="dokumen"
                accept=".pdf"
                onChange={handleFileChange}
              />
            )}

            {formData.jenis_berita === "HTML" && (
              <FileField
                label="Upload File ZIP (HTML)"
                name="dokumen"
                accept=".zip"
                onChange={handleFileChange}
              />
            )}

            {formData.jenis_berita === "Youtube" && (
              <InputField
                label="Link YouTube"
                name="youtube_link"
                type="text"
                value={formData.youtube_link}
                onChange={handleChange}
                placeholder="Masukkan URL YouTube..."
              />
            )}

            {/* Keywords & Isi */}
            <TextAreaField
              label="Keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              rows={3}
              placeholder="Masukkan keyword..."
            />

            <TextAreaField
              label="Isi Berita"
              name="isi"
              value={formData.isi}
              onChange={handleChange}
              rows={6}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/Layout/Datatable")}
                className="px-8 py-2.5 bg-gray-300 text-slate-800 rounded-md hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-blue-900 text-white rounded-md hover:bg-blue-950 transition-colors font-medium"
                style={{ backgroundColor: "#154D71" }}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* =====================================================
    REUSABLE COMPONENTS
===================================================== */

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
      <label className="block mb-2 text-sm text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
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
      <label className="block mb-2 text-sm text-gray-600">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
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
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500 file:bg-gray-50 file:px-4 file:py-2 file:rounded-md file:border-0 hover:file:bg-gray-100"
      />
    </div>
  );
}
