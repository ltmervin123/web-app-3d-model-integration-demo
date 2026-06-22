"use client";
import ButterflyViewer from "@/components/ButterflyViewer";
import SpeciesInfo from "@/components/SpeciesInfo";
import { butterflyData } from "@/data/species";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white  font-roboto">
      {/* 3D Viewer Section */}
      <div className="w-full md:w-1/2 h-[50vh] md:h-screen bg-gray-100  relative">
        <ButterflyViewer />
      </div>

      {/* Metadata Section */}
      <main className="w-full md:w-1/2 overflow-y-auto p-6 md:p-8 flex flex-col justify-start">
        <SpeciesInfo species={butterflyData} />
      </main>
    </div>
  );
}
