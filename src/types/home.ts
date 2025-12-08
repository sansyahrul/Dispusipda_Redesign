export interface ProfileData {
  id: number;
  judul_profile: string;
  isi: string;
  media_url: string | null;
  media_type: "image" | "video" | null;
}

export interface TujuanData {
  id: number;
  judul_tujuan: string;
  isi: string;
  icon?: string | null;
  gambar_url?: string | null;
}

export interface UndangUndangData {
  id: number;
  judul_undang_undang: string;
  isi: string;
}

export interface ContentItem {
  id: number;
  judul_berita: string;
  id_kategori: string;
  tanggal_publish: string;
  jam_publish: string;
  status_berita: string;
  jenis_berita: string;

  icon?: string | null;
  keywords?: string | null;
  isi?: string | null;

  gambar_url?: string | null;
  video_url?: string | null;
  dokumen_url?: string | null;

  createdAt?: string;
  youtube_link: string;
}

export interface HeroData {
  id: number;
  judul_section: string;
  isi: string | null;
  gambar_url: string | null;
}
export interface StatistikImport {
  id: string;
  data: Record<string, string | number | null>;
  createdAt: string;
}

export interface HomeResponse {
  profile: ProfileData | null;
  tujuan: TujuanData[];
  undangUndang: UndangUndangData[];
  content: ContentItem[]; // kalau mau strict kasih tau aku bentuknya
  hero: HeroData;
  serahsimpan: StatistikImport[];
  statistik: StatistikImport[]; // kalau mau strict kasih tau aku bentuknya
}
