"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export function NavigationMenuDemo() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const navbarBg = isHome && !scrolled ? "bg-transparent" : "bg-white shadow";

  // text warna dinamis
  const linkStyle =
    isHome && !scrolled
      ? "text-white hover:text-yellow-300"
      : "text-black hover:text-blue-600";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${navbarBg}`}
    >
      <div className="flex items-center justify-between w-full px-6 py-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 ml-4">
          <Image
            src="/Logo_Dispusipda.png"
            alt="Logo"
            width={80}
            height={80}
            priority
          />
        </Link>

        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {/* Home */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle} `}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Profil */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`bg-transparent ${linkStyle}`}>
                Profil
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute top-full left-0 mt-2">
                <ul className="grid gap-2 md:w-[100px] lg:w-[400px] p-3">
                  <NavigationMenuLink asChild>
                    <Link href="/profil/sambutan">SAMBUTAN</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/profil/sejarah">SEJARAH DISPUSIPDA JABAR</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/profil/tugas-fungsi">
                      TUGAS POKOK DAN FUNGSI
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/profil/struktur">STRUKTUR ORGANISASI</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/profil/visi-misi">VISI DAN MISI</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/profil/sdm">SUMBER DAYA MANUSIA</Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Layanan */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`bg-transparent ${linkStyle}`}>
                Layanan
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute top-full left-0 mt-2">
                <ul className="grid w-[350px] gap-2 p-3">
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/survei">
                      SURVEI KEPUASAN MASYARAKAT
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/pencarian-buku">
                      PENCARIAN BUKU PERPUSTAKAAN
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/pendaftaran">
                      PENDAFTARAN ANGGOTA PERPUSTAKAAN
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/ppid">PPID DISPUSIPDA JABAR</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/wakaf-buku">WAKAF BUKU (WAJJIT)</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/maca-dina">
                      MACA DINA DIGITAL LIBRARY
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/sikn-jikn">
                      SIKN JIKN DISPUSIPDA JABAR
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/pengaduan">PENGADUAN</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/perbaikan-arsip">PERBAIKAN ARSIP</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/saaski">SAASKI</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/sidik">SIDIK</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/galeri-covid">
                      GALLERY ARSIP COVID-19
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/layanan/pameran">PAMERAN KEARSIPAN</Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Pengajuan Buku */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/pengajuan-buku">Pengajuan Buku</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Galeri */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`bg-transparent ${linkStyle}`}>
                Galeri
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute top-full left-0 mt-2">
                <ul className="grid w-[200px] gap-2 p-3">
                  <NavigationMenuLink asChild>
                    <Link href="/galeri/foto">Galeri Foto</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/galeri/video">Galeri Video</Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Berita */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`bg-transparent ${linkStyle}`}>
                Berita
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute top-full left-0 mt-2">
                <ul className="grid w-[220px] gap-2 p-3">
                  <NavigationMenuLink asChild>
                    <Link href="/berita/terbaru">Berita Terbaru</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link href="/berita/arsip">Arsip Berita</Link>
                  </NavigationMenuLink>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Unduhan */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/unduhan">Unduhan</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Kontak */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/kontak">Kontak</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 mr-7">
          <Button asChild variant="outline">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
