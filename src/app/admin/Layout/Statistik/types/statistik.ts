export interface StatistikImport {
  id: string;
  data: Record<string, string | number>;
  createdAt: string;
}

export interface StatistikChartData {
  tahun: string;
  karya_cetak: number;
  karya_rekam: number;
}
