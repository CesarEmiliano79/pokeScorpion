"use client";
import Navbar from '@/components/Navbar'
import ProtectedPage from '@/components/ProtectedPage'
import { CargaImagen, fetchNoticias } from '@/lib/api';
import React, { useEffect, useRef, useState } from 'react'
export default function Home() {
  const [noticias, setNoticias] = useState([]);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    const cargaInicialNoticias = async () => {
      try {
        
        const data = await fetchNoticias();
        setNoticias(data.noticias || []);
        console.log(data.noticias)
      } catch (error) {
        console.error("Error al cargar noticias:", error);
      }
    };

  cargaInicialNoticias();
}, []);

  return (
    <ProtectedPage>
      <Navbar />
      <main className="bg-black min-h-screen text-white px-6 py-10">
        
        {/* Carrusel */}
        <section className="overflow-hidden mb-10">
  <div className="flex space-x-6 carrusel-animado">
    {noticias.concat(noticias).map((noticia, index) => (
      <div
        key={index}
        className="bg-gray-800 rounded-2xl shadow-xl p-4 w-80 flex-shrink-0 transition-transform hover:scale-105 hover:shadow-2xl"
      >
        {noticia.image && (
          <img
            src={CargaImagen(noticia.image)}
            alt={noticia.title}
            className="rounded-xl w-full h-40 object-cover mb-4"
          />
        )}
        <h3 className="text-xl font-bold text-indigo-400 mb-2 line-clamp-1">{noticia.title}</h3>
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">{noticia.descripcion || "Sin descripción."}</p>
        <div className="flex justify-between items-center text-gray-400 text-xs">
          <span>Autor: {noticia.autor?.username || "Desconocido"}</span>
          <span>{new Date(noticia.fechaCreacion).toLocaleDateString()}</span>
        </div>
      </div>
    ))}
  </div>
</section>



        {/* Mensaje de bienvenida */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">¡Hola usuario!</h2>
          <p className="text-lg text-gray-300">
            Estas son las <span className="text-yellow-400">10 noticias más interesantes</span> que hay.
          </p>
        </section>
      </main>
    </ProtectedPage>
  );
}
