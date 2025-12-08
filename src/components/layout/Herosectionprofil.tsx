"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";

type HeroData = {
  id: number;
  judul_section: string;
  isi: string | null;
  gambar_url: string | null;
};

export default function HeroSection({ data }: { data: HeroData | null }) {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      {data?.gambar_url && (
        <Image
          src={data.gambar_url}
          alt="Hero Background"
          fill
          priority
          className="object-cover object-center"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {data?.judul_section ?? "Loading..."}
        </h1>

        <p className="text-lg md:text-2xl mb-8 leading-relaxed opacity-90">
          {data?.isi ?? "Loading deskripsi..."}
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white cursor-pointer animate-bounce"
        onClick={() => scrollToSection("tentang")}
      >
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
