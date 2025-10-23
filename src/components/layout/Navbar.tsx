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

export function NavigationMenuDemo() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const navbarBg = isHome && !scrolled ? "bg-transparent" : "bg-white shadow";
  const linkStyle =
    isHome && !scrolled
      ? "text-white hover:text-yellow-300"
      : "text-black hover:text-blue-600";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${navbarBg}`}
    >
      <div className="flex items-center justify-between w-full px-6 py-2">
        {/* === Logo (kiri) === */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/Logo_Dispusipda.png"
            alt="Logo"
            width={80}
            height={80}
            priority
          />
        </Link>

        {/* === Menu Navigasi (kanan) === */}
        <div className="flex items-center ml-auto gap-6">
          <NavigationMenu viewport={false}>
            <NavigationMenuList className="flex items-center gap-2">
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Profil */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`bg-transparent ${linkStyle}`}
                >
                  Profil
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 mt-2">
                  <ul className="grid gap-2 md:w-[100px] lg:w-[400px] p-3">
                    <NavigationMenuLink asChild>
                      <Link href="/profil/sambutan">SAMBUTAN</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/profil/sejarah">
                        SEJARAH DISPUSIPDA JABAR
                      </Link>
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

              {/* === KID === */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`bg-transparent ${linkStyle}`}
                >
                  KID
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 mt-2">
                  <ul className="grid w-[300px] gap-2 p-3">
                    <NavigationMenuLink asChild>
                      <Link href="/kid/survei">Survei Kepuasan</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/kid/pencarian-buku">Pencarian Buku</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/kid/pendaftaran">Pendaftaran Anggota</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/kid/ppid">PPID DISPUSIPDA</Link>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* === BID === */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`bg-transparent ${linkStyle}`}
                >
                  BID
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 mt-2">
                  <ul className="grid w-[250px] gap-2 p-3">
                    <NavigationMenuLink asChild>
                      <Link href="/bid/galeri-foto">Galeri Foto</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/bid/galeri-video">Galeri Video</Link>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* === Media Alih Nasah Kuno === */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={`bg-transparent ${linkStyle}`}
                >
                  Media Alih Nasah Kuno
                </NavigationMenuTrigger>
                <NavigationMenuContent className="absolute top-full left-0 mt-2">
                  <ul className="grid w-[250px] gap-2 p-3">
                    <NavigationMenuLink asChild>
                      <Link href="/media/berita-terbaru">Berita Terbaru</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/media/arsip-berita">Arsip Berita</Link>
                    </NavigationMenuLink>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* === Statistik === */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
                >
                  <Link href="/statistik">Statistik</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
