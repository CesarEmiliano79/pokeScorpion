// app/noticias/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import Pagination from "@/components/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { fetchNoticias } from "@/lib/api";
import Navbar from "@/components/Navbar";

export default function NoticiasPage() {
  const { currentPage, goToPage } = usePagination(1);
  const [noticias, setNoticias] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNoticias = async () => {
      setLoading(true);
      try {
        const data = await fetchNoticias(currentPage, 10);
        setNoticias(data.noticias);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    loadNoticias();
  }, [currentPage]);

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-6">Noticias</h1>

      {loading ? (
        <p className="text-white">Cargando...</p>
      ) : noticias.length === 0 ? (
        <p className="text-white">No hay noticias</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {noticias.map((noticia) => (
            <NewsCard key={noticia._id} {...noticia} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
    </>
    
  );
}
