"use client";

import { NavigationMenuDemo } from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/Herosection";

export default function Home() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <NavigationMenuDemo />
      <HeroSection scrollToSection={scrollToSection} />

      {/* Section Layanan Kami */}
      <section
        id="layanan"
        className="py-16 px-4 md:px-16 bg-white text-center"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">
          Layanan Kami
        </h2>

        {/* Layanan Pemustaka */}
        <div className="mb-10 text-left pl-4 md:pl-8">
          <h3 className="text-xl font-medium text-blue-900 mb-6">
            Layanan Pemustaka dan Kunjungan
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
            <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition">
              <img
                src="/images/layanan1.png"
                alt="Survei Kepuasan Masyarakat"
                className="rounded-lg w-full h-32 object-cover mb-3"
              />
              <p className="font-medium text-gray-700">
                Survei Kepuasan Masyarakat
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition">
              <img
                src="/images/layanan2.png"
                alt="Pencarian Buku"
                className="rounded-lg w-full h-32 object-cover mb-3"
              />
              <p className="font-medium text-gray-700">
                Pencarian Buku Perpustakaan
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition">
              <img
                src="/images/layanan3.png"
                alt="Pendaftaran Anggota"
                className="rounded-lg w-full h-32 object-cover mb-3"
              />
              <p className="font-medium text-gray-700">
                Pendaftaran Anggota Perpustakaan
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition">
              <img
                src="/images/layanan4.png"
                alt="iCandil"
                className="rounded-lg w-full h-32 object-cover mb-3"
              />
              <p className="font-medium text-gray-700">
                iCandil - Dinas Digital Library
              </p>
            </div>
          </div>
        </div>

        {/* Layanan Informasi */}
        <div className="relative mt-16">
          <img
            src="/images/layanan-informasi.png"
            alt="Layanan Informasi"
            className="rounded-2xl w-full h-60 object-cover opacity-90"
          />
          <h3 className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold bg-black/40 rounded-2xl">
            Layanan Informasi
          </h3>
        </div>

        {/* === LAYANAN KELEMBAGAAN === */}
        <section
          id="kelembagaan"
          className="mt-20 border-2 border-blue-300 rounded-xl p-8 text-left"
        >
          <h3 className="text-2xl font-semibold text-blue-900 mb-8">
            Layanan Kelembagaan
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-blue-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Perpustakaan Anjap
              </h4>
              <p className="text-gray-600 text-sm">
                We provide a wide range of informative sources, catalog
                services, and digital guides for researchers and readers.
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                PTD DISPUSIPDA JABAR
              </h4>
              <p className="text-gray-600 text-sm">
                We coordinate all data on library services and availability in
                districts to improve knowledge sharing.
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Wali Data DISPUSIPDA
              </h4>
              <p className="text-gray-600 text-sm">
                We ensure information database solutions including data
                collection, updating, and validation.
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-2">SDK</h4>
              <p className="text-gray-600 text-sm">
                Our experienced team provides professional consultation and
                guidance for archive management and data security.
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-2">SAARIP</h4>
              <p className="text-gray-600 text-sm">
                Provide data guidance for information system improvement and
                archival development.
              </p>
            </div>

            <div className="border border-blue-200 rounded-lg p-5 hover:shadow-md transition">
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                SIENK DISPUSIPDA JABAR
              </h4>
              <p className="text-gray-600 text-sm">
                Comprehensive database including library networks, service
                evaluation, and policy support.
              </p>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
