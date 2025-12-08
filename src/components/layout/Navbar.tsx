"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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

  const heroPages = [
    "/",
    "/profil",
    "/KID",
    "/BID",
    "/mediaalihnasahkuno",
    "/statistik",
  ];
  const isHeroPage = heroPages.includes(pathname);

  const navbarBg =
    isHeroPage && !scrolled ? "bg-transparent" : "bg-[#154D71] shadow-md";
  const linkStyle =
    isHeroPage && !scrolled
      ? "text-white hover:text-blue-400"
      : "text-white hover:text-blue-400";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${navbarBg}`}
    >
      <div className="flex items-center justify-between w-full px-6 py-2 max-w-7xl mx-auto">
        {/* === LOGO === */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Logo_Dispusipda.png"
            alt="Logo DISPUSIPDA"
            width={75}
            height={75}
            priority
          />
        </Link>

        {/* === MENU === */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-3">
            {/* === HOME === */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* === PROFIL === */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/profil">Profil</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* === KID === */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/KID">KID</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* === BID === */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/BID">BID</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* === MEDIA ALIH NASKAH KUNO === */}
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={`${navigationMenuTriggerStyle()} bg-transparent ${linkStyle}`}
              >
                <Link href="/mediaalihnasahkuno">Media Alih Nasah Kuno</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* === STATISTIK === */}
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
    </nav>
  );
}
