"use client";

import { NavigationMenuDemo } from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/Herosection"; // perhatikan huruf besar/kecil

export default function Home() {
  // fungsi untuk scroll ke section tertentu
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
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  );
}
