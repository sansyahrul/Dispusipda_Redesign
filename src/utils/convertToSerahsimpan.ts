import { Serahsimpan } from "./GroupbyTahun";

export interface StatistikImport {
  id: string;
  data: Record<string, string | number | null>;
  createdAt: string;
}

/**
 * Mengubah StatistikImport[] menjadi Serahsimpan[]
 * karena id di StatistikImport = string → harus jadi number
 */
export function convertToSerahsimpan(items: StatistikImport[]): Serahsimpan[] {
  return items.map((item) => ({
    ...item,
    id: Number(item.id),
  }));
}
