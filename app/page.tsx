"use client";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/map").then((mod) => mod.Map), {
  ssr: false,
});
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-sky-800 min-h-screen">
      <h1 className="text-5xl font-bold text-white">Río Rocha</h1>
      <Map />
    </div>
  );
}
