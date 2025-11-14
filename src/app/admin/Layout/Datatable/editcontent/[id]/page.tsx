"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
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
  youtube_url: string;
};

type Option = { value: string; label: string };

export default function EditContentForm() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

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
    youtube_url: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const res = await fetch(`/api/content/${id}`);
      if (!res.ok) {
        alert("Gagal memuat data.");
        return;
      }

      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        judul_berita: data.judul_berita ?? "",
        icon: data.icon ?? "",
        tanggal_publish: data.tanggal_publish
          ? new Date(data.tanggal_publish).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        jam_publish:
          data.jam_publish ??
          new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        status_berita: data.status_berita ?? "Publish",
        jenis_berita: data.jenis_berita ?? "Berita",
        id_kategori: data.id_kategori ? String(data.id_kategori) : "1",
        urutan: data.urutan ?? 1,
        keywords: data.keywords ?? "",
        isi: data.isi ?? "",
        youtube_url: data.youtube_url ?? "",
      }));
    };
    fetchData();
  }, [id]);

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
    if (!id) return;

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

      alert("✅ Data berhasil diperbarui!");
      router.push("/admin/Layout/Datatable");
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan saat update.");
    }
  };

  return (
    <div className="flex min-h-screen ">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-2xl dashboard-title">Data Konten</h1>
        </div>

        <div
          className="rounded-lg shadow-sm p-8"
          style={{ backgroundColor: "#F9FCFF", borderColor: "#C9D4E1" }}
        >
          <h2 className="text-xl dashboard-title mb-4">
            Edit Berita / Profil/ Layanan
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
                placeholder="Wawacan Lampahing Wali Kabeh"
              />
              <InputField
                label="Icon"
                name="icon"
                type="text"
                value={formData.icon}
                onChange={handleChange}
              />
            </div>

            {/* Tanggal & Jam Publish */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Tanggal Publish"
                name="tanggal_publish"
                type="date"
                value={formData.tanggal_publish}
                onChange={handleChange}
              />
              <div>
                <label className="block mb-2 text-sm text-gray-600">
                  Jam Publish
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="jam_publish"
                    value={formData.jam_publish}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
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
                  { value: "Youtube", label: "Youtube" },
                  { value: "Profil", label: "Profil" },
                  { value: "Gambar", label: "Gambar" },
                  { value: "Video", label: "Video" },
                  { value: "PDF", label: "PDF" },
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

            {/* Urutan */}
            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="Urutan"
                name="urutan"
                type="number"
                value={formData.urutan}
                onChange={handleChange}
              />

              {/* Upload Gambar */}
              {formData.jenis_berita === "Gambar" && (
                <FileField
                  label="Upload Gambar"
                  name="gambar"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}

              {/* Upload Video */}
              {formData.jenis_berita === "Video" && (
                <FileField
                  label="Upload Video"
                  name="video"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              )}
            </div>

            {/* Upload Dokumen (Full Width) */}
            {formData.jenis_berita === "PDF" && (
              <FileField
                label="Upload Dokumen (PDF)"
                name="dokumen"
                accept=".pdf"
                onChange={handleFileChange}
              />
            )}

            {/* YouTube URL */}
            {formData.jenis_berita === "Youtube" && (
              <InputField
                label="Link YouTube"
                name="youtube_url"
                type="text"
                value={formData.youtube_url}
                onChange={handleChange}
              />
            )}

            {/* Keywords */}
            <TextAreaField
              label="Keywords"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="KID"
              rows={3}
            />

            {/* Isi Berita */}
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
                type="submit"
                className="px-8 py-2.5 bg-blue-900 text-white rounded-md hover:bg-blue-950 transition-colors font-medium"
                style={{ backgroundColor: "#154D71" }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/Layout/Datatable")}
                className="px-8 py-2.5 bg-blue-900 text-white rounded-md hover:bg-blue-950 transition-colors font-medium"
                style={{ backgroundColor: "#154D71" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* Komponen Reusable */
interface InputFieldProps {
  label: string;
  name: keyof FormDataType;
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}
function InputField({
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: "right 0.5rem center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1.5em 1.5em",
          paddingRight: "2.5rem",
        }}
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
  rows?: number;
  placeholder?: string;
}
function TextAreaField({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder,
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
      />
    </div>
  );
}
