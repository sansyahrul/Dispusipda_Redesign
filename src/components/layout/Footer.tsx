"use client";

import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#154D71] text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
        {/* Logo & Deskripsi */}
        <div className="flex flex-col items-center md:items-start">
          <Image
            src="/Logo_Dispusipda.png"
            alt="Logo DISPUSIPDA"
            width={160}
            height={160}
            className="mb-3 object-contain"
          />
          <p className="text-lg text-gray-300 text-center md:text-left font-semibold leading-snug">
            Dinas Perpustakaan dan Kearsipan Daerah
            <br />
            Provinsi Jawa Barat
          </p>
        </div>

        {/* Isi Footer */}
        <div className="flex flex-col md:flex-row justify-between flex-1 gap-10 md:gap-16 text-center md:text-left">
          {/* Jam Operasional */}
          <div className="flex-1 space-y-2 text-white">
            <h3 className="text-xl font-semibold mb-2">Jam Operasional</h3>
            <p className="text-gray-200 text-sm font-light">
              Senin - Sabtu : 08.00 - 16.00 WIB
            </p>
            <p className="text-gray-200 text-sm font-light">
              Minggu, Cuti Bersama dan Libur Nasional : Tutup
            </p>
          </div>

          {/* Kontak Kami */}
          <div className="space-y-4 text-white">
            <h3 className="text-xl font-semibold mb-2">Kontak Kami</h3>

            <div className="flex items-center space-x-3 text-gray-200 font-light">
              <FaPhone className="text-xl" />
              <a
                href="tel:0227320048"
                className="hover:underline text-gray-300"
              >
                022–7320048
              </a>
            </div>

            <div className="flex items-center space-x-3 text-gray-200 font-light">
              <FaEnvelope className="text-xl" />
              <a
                href="mailto:dispusipda@jabarprov.go.id"
                className="hover:underline text-gray-300"
              >
                dispusipda@jabarprov.go.id
              </a>
            </div>

            <div className="flex items-start space-x-3 text-gray-200 font-light">
              <FaMapMarkerAlt className="text-xl mt-1" />
              <a
                href="https://www.google.com/maps/place/DINAS+PERPUSTAKAAN+DAN+KEARSIPAN+DAERAH+PROVINSI+JAWA+BARAT"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-gray-300"
              >
                Jl. Kawaluyan Indah II No.4, <br />
                Kecamatan Buahbatu, Kota Bandung <br />
                Jawa Barat 40286
              </a>
            </div>
          </div>

          {/* Follow Us */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4 text-xl">
              <a
                href="https://www.instagram.com/dispusipdajabar/?hl=id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.facebook.com/DispusipdaJabar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.youtube.com/@DispusipdaJabar"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-blue-800 pt-4 text-center text-sm text-gray-300">
        © 2025. Design by{" "}
        <span className="font-semibold text-blue-200">Tim IT STMIK IM</span>
      </div>
    </footer>
  );
}
