"use client";

import { ArrowRight, ChevronDown } from "lucide-react";

type HeroSectionProps = {
  scrollToSection: (sectionId: string) => void;
};

export default function HeroSection({ scrollToSection }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/gedung2.jpg")',
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Meningkatkan{" "}
          <span className="text-yellow-400">Kualitas Tenaga Kerja</span>
        </h1>
        <p className="text-lg md:text-2xl mb-8 leading-relaxed opacity-90">
          Memberikan pelatihan dan pengembangan keterampilan melalui balai
          pelatihan untuk meningkatkan daya saing dan kesejahteraan pekerja
          Indonesia.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection("about")}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            Tentang Kami <ArrowRight size={20} />
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
          >
            Layanan Kami
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <ChevronDown size={32} />
      </div>
    </section>
  );
}
