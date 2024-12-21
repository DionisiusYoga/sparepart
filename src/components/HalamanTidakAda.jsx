"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const HalamanTidakAda = () => {
  const router = useRouter();
  useEffect(() => {
    document.body.classList.add("loaded");
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="grid h-screen place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200 py-8">404</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Uh-oh!
        </p>

        <p className="mt-4 text-gray-500">
          Halaman yang Anda cari tidak tersedia.
        </p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-block rounded bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default HalamanTidakAda;
