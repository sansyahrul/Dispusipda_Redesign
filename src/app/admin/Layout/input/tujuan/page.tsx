"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import { kategoriDummy } from "../../Datatable/const/kategoridummy";
import { Edit, Trash2 } from "lucide-react";

type FormDataType = {
  judul_tujuan: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
  gambar: File | null;
};

type TujuanItem = {
  id: number;
  judul_tujuan: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: number;
  isi: string | null;
  gambar_url?: string | null;
};

export default function FormTujuanPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tujuanData, setTujuanData] = useState<TujuanItem[]>([]);

  // 🟢 State untuk edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<FormDataType>({
    judul_tujuan: "",
    tanggal_publish: "",
    jam_publish: "",
    jenis_berita: "Tujuan",
    id_kategori: "1",
    isi: "",
    gambar: null,
  });

  const [formData, setFormData] = useState<FormDataType>({
    judul_tujuan: "",
    tanggal_publish: new Date().toISOString().slice(0, 10),
    jam_publish: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    jenis_berita: "Tujuan",
    id_kategori: "1",
    isi: "",
    gambar: null,
  });

  // ============================ FETCH DATA ============================
  const fetchTujuanData = async () => {
    try {
      const res = await fetch("/api/input/tujuan");
      if (!res.ok) throw new Error("Gagal memuat data Tujuan");
      const result: TujuanItem[] = await res.json();
      setTujuanData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTujuanData();
  }, []);

  // ============================ HANDLE INPUT ============================
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

  // ============================ SUBMIT (CREATE) ============================
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
      const res = await fetch("/api/input/tujuan", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Tujuan berhasil disimpan 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setFormData({
        judul_tujuan: "",
        tanggal_publish: new Date().toISOString().slice(0, 10),
        jam_publish: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        jenis_berita: "Tujuan",
        id_kategori: "1",
        isi: "",
        gambar: null,
      });

      fetchTujuanData();
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menyimpan data.",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // ============================ DELETE ============================
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
      const res = await fetch(`/api/input/tujuan?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      await Swal.fire("Dihapus!", "Data berhasil dihapus.", "success");
      fetchTujuanData();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  };

  // ============================ EDIT ============================
  const handleEdit = (item: TujuanItem) => {
    setSelectedId(item.id);
    setEditFormData({
      judul_tujuan: item.judul_tujuan,
      tanggal_publish: item.tanggal_publish.split("T")[0],
      jam_publish: item.jam_publish,
      jenis_berita: item.jenis_berita,
      id_kategori: item.id_kategori.toString(),
      isi: item.isi || "",
      gambar: null,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEditFormData((prev) => ({ ...prev, gambar: file }));
  };

  const handleUpdate = async () => {
    if (!selectedId) return;

    const form = new FormData();
    (Object.keys(editFormData) as Array<keyof FormDataType>).forEach((key) => {
      const value = editFormData[key];
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    });

    try {
      const res = await fetch(`/api/input/tujuan?id=${selectedId}`, {
        method: "PUT",
        body: form,
      });

      if (!res.ok) throw new Error("Gagal update data");

      await Swal.fire("Berhasil!", "Data berhasil diperbarui 🎉", "success");
      setShowEditModal(false);
      fetchTujuanData();
    } catch (err) {
      Swal.fire("Gagal", "Terjadi kesalahan saat update data.", "error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 p-8">
        {/* ===================== FORM ===================== */}
        <div
          className="rounded-lg shadow-sm p-8 mb-10"
          style={{ backgroundColor: "#F9FCFF", border: "1px solid #C9D4E1" }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Tambah Tujuan
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Judul Tujuan"
              name="judul_tujuan"
              type="text"
              value={formData.judul_tujuan}
              onChange={handleChange}
              placeholder="Masukkan judul tujuan..."
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
                options={[{ value: "Tujuan", label: "Tujuan" }]}
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
              placeholder="Tulis isi konten tujuan..."
              rows={6}
            />

            <div className="flex justify-end gap-4 pt-6">
              <button
                type="reset"
                className="px-8 py-2.5 bg-gray-300 rounded-md"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-2.5 text-white rounded-md font-medium"
                style={{ backgroundColor: "#154D71" }}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>

        {/* ===================== TABLE ===================== */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Tujuan</h2>

          {loading ? (
            <div className="text-center py-6 text-gray-500">Memuat data...</div>
          ) : tujuanData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Belum ada data Tujuan
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
                {tujuanData.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{item.judul_tujuan}</td>
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
                        onClick={() => handleEdit(item)}
                        className="hover:text-blue-800"
                      >
                        <Edit
                          className="inline w-4 h-4"
                          style={{ color: "#008DE1" }}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="hover:text-red-800"
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

        {/* ===================== MODAL EDIT ===================== */}
        {showEditModal && (
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
                Edit Tujuan
              </h2>

              <div className="space-y-4">
                <InputField
                  label="Judul Tujuan"
                  name="judul_tujuan"
                  type="text"
                  value={editFormData.judul_tujuan}
                  onChange={handleEditChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Tanggal Publish"
                    name="tanggal_publish"
                    type="date"
                    value={editFormData.tanggal_publish}
                    onChange={handleEditChange}
                  />
                  <InputField
                    label="Jam Publish"
                    name="jam_publish"
                    type="time"
                    value={editFormData.jam_publish}
                    onChange={handleEditChange}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <SelectField
                    label="Jenis Berita"
                    name="jenis_berita"
                    value={formData.jenis_berita}
                    onChange={handleChange}
                    options={[{ value: "Tujuan", label: "Tujuan" }]}
                  />
                  <SelectField
                    label="Kategori"
                    name="id_kategori"
                    value={editFormData.id_kategori}
                    onChange={handleEditChange}
                    options={kategoriDummy}
                  />
                </div>

                <FileField
                  label="Ubah Gambar (opsional)"
                  name="gambar"
                  accept="image/*"
                  onChange={handleEditFile}
                />

                <TextAreaField
                  label="Isi Konten"
                  name="isi"
                  value={editFormData.isi}
                  onChange={handleEditChange}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 rounded-md bg-gray-300 text-gray-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-6 py-2 rounded-md text-white"
                  style={{ backgroundColor: "#154D71" }}
                >
                  Simpan Perubahan
                </button>
              </div>
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
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
        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
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
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </div>
  );
}
