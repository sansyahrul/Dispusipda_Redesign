"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Sidebar from "../../../component/sidebar";
import { kategoriDummy } from "../../Datatable/const/kategoridummy";
import { Edit, Trash2 } from "lucide-react";

type FormDataType = {
  judul_profile: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: string;
  isi: string;
  gambar: File | null;
};

type ProfileItem = {
  id: number;
  judul_profile: string;
  tanggal_publish: string;
  jam_publish: string;
  jenis_berita: string;
  id_kategori: number;
  isi: string | null;
  gambar_url?: string | null;
};

export default function FormProfilePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileItem[]>([]);

  const [formData, setFormData] = useState<FormDataType>({
    judul_profile: "",
    tanggal_publish: new Date().toISOString().slice(0, 10),
    jam_publish: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    jenis_berita: "Profil",
    id_kategori: "1",
    isi: "",
    gambar: null,
  });

  // Fetch data
  const fetchProfileData = async () => {
    try {
      const res = await fetch("/api/input/profile");
      if (!res.ok) throw new Error("Gagal memuat data Profile");
      const result: ProfileItem[] = await res.json();
      setProfileData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
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

  // Submit form
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
      const res = await fetch("/api/input/profile", {
        method: "POST",
        body: form,
      });
      if (!res.ok) throw new Error("Gagal menyimpan data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Profile berhasil disimpan 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setFormData({
        judul_profile: "",
        tanggal_publish: new Date().toISOString().slice(0, 10),
        jam_publish: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        jenis_berita: "Profil",
        id_kategori: "1",
        isi: "",
        gambar: null,
      });

      fetchProfileData();
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

  // Hapus data
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
      const res = await fetch(`/api/input/profile?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus data");

      await Swal.fire({
        title: "Dihapus!",
        text: "Data berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      fetchProfileData();
    } catch (err) {
      Swal.fire({
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // =============== ✨ STATE MODAL EDIT ===============
  const [editingProfile, setEditingProfile] = useState<ProfileItem | null>(
    null
  );
  const [editForm, setEditForm] = useState<FormDataType>({
    judul_profile: "",
    tanggal_publish: "",
    jam_publish: "",
    jenis_berita: "Profil",
    id_kategori: "1",
    isi: "",
    gambar: null,
  });

  // Saat klik tombol Edit
  const handleEdit = (item: ProfileItem) => {
    setEditingProfile(item);
    setEditForm({
      judul_profile: item.judul_profile,
      tanggal_publish: item.tanggal_publish.split("T")[0],
      jam_publish: item.jam_publish,
      jenis_berita: item.jenis_berita,
      id_kategori: item.id_kategori.toString(),
      isi: item.isi || "",
      gambar: null,
    });
  };

  // Handle input di modal edit
  const handleEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    const file = files && files.length > 0 ? files[0] : null;
    setEditForm((prev) => ({ ...prev, [name]: file }));
  };

  // Simpan perubahan
  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    const form = new FormData();
    (Object.keys(editForm) as Array<keyof FormDataType>).forEach((key) => {
      const value = editForm[key];
      if (value instanceof File) form.append(key, value);
      else form.append(key, String(value));
    });

    try {
      const res = await fetch(`/api/input/profile?id=${editingProfile.id}`, {
        method: "PUT",
        body: form,
      });
      if (!res.ok) throw new Error("Gagal memperbarui data");

      await Swal.fire({
        title: "Berhasil!",
        text: "Data Profile berhasil diperbarui 🎉",
        icon: "success",
        confirmButtonColor: "#154D71",
      });

      setEditingProfile(null);
      fetchProfileData();
    } catch (err) {
      console.error(err);
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
        {/* Form Section */}
        <div
          className="rounded-lg shadow-sm p-8 mb-10"
          style={{
            backgroundColor: "#F9FCFF",
            borderColor: "#C9D4E1",
            borderWidth: "1px",
          }}
        >
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">
            Tambah Data Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Judul Profile"
              name="judul_profile"
              type="text"
              value={formData.judul_profile}
              onChange={handleChange}
              placeholder="Masukkan judul profile..."
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
                options={[{ value: "Profil", label: "Profil" }]}
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
              placeholder="Tulis isi profile..."
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

        {/* Table Section */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Profile</h2>
          {loading ? (
            <div className="text-center py-6 text-gray-500">Memuat data...</div>
          ) : profileData.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              Belum ada data Profile
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
                {profileData.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{item.judul_profile}</td>
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
      </main>
      {/* ✨ MODAL EDIT PROFILE */}
      {/* ======== MODAL EDIT PROFILE ======== */}
      {editingProfile && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="rounded-lg shadow-sm p-8 w-full max-w-2xl relative border border-[#C9D4E1]"
            style={{ backgroundColor: "#F9FCFF" }}
          >
            {/* Tombol close */}
            <button
              onClick={() => setEditingProfile(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Edit Profile
            </h2>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              {/* Judul */}
              <InputField
                label="Judul Profile"
                name="judul_profile"
                type="text"
                value={editForm.judul_profile}
                onChange={handleEditChange}
                required
              />

              {/* Tanggal & Jam */}
              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Tanggal Publish"
                  name="tanggal_publish"
                  type="date"
                  value={editForm.tanggal_publish}
                  onChange={handleEditChange}
                />
                <InputField
                  label="Jam Publish"
                  name="jam_publish"
                  type="time"
                  value={editForm.jam_publish}
                  onChange={handleEditChange}
                />
              </div>

              {/* Jenis & Kategori */}
              <div className="grid md:grid-cols-2 gap-6">
                <SelectField
                  label="Jenis Berita"
                  name="jenis_berita"
                  value={editForm.jenis_berita}
                  onChange={handleEditChange}
                  options={[{ value: "Profil", label: "Profil" }]}
                />
                <SelectField
                  label="Kategori"
                  name="id_kategori"
                  value={editForm.id_kategori}
                  onChange={handleEditChange}
                  options={kategoriDummy}
                />
              </div>

              {/* Upload Gambar */}
              <FileField
                label="Ganti Gambar (opsional)"
                name="gambar"
                accept="image/*"
                onChange={handleEditFileChange}
              />

              {/* Isi Konten */}
              <TextAreaField
                label="Isi Konten"
                name="isi"
                value={editForm.isi}
                onChange={handleEditChange}
                placeholder="Tulis isi profil..."
                rows={6}
              />

              {/* Tombol Aksi */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setEditingProfile(null)}
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
