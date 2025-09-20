"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { autenticado, CargaImagen, fetchNoticia, ocultaNoticia } from "@/lib/api";
export default function NoticiaDetalle() {
  const { id } = useParams();
  const router = useRouter();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  useEffect(() => {
      const checkAuth = async () => {
        try {
          const data = await autenticado();
  
          if (data.ok) {
            setAdmin(data.esAdmin)
            console.log("Si es admin")
          }
          
        } catch (error) {
          console.error('Error al verificar sesión:', error);
        }
      };
  
      checkAuth();
    }, []);
  useEffect(() => {
    const CargaInicialNoticia = async () => {
      try {
        
        const data = await fetchNoticia(id);
        setNoticia(data["data"]);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    CargaInicialNoticia();
  }, [id]);
  useEffect

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-800">
        <div className="text-white text-lg animate-pulse">Cargando noticia...</div>
      </div>
    );

  if (!noticia)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 dark:bg-gray-800">
        <p className="text-white text-lg">Noticia no encontrada</p>
      </div>
    );

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black p-6 flex flex-col items-center">

      {isAdmin && (
            <button
                onClick={() => router.push(`/pages/noticias/${id}/editar`)}
                className="self-start mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
                Modificar
            </button>
      )}


      {isAdmin && <button
        onClick={async() => {
        await ocultaNoticia(id);
        router.push('/pages/noticias/');
        }}
        className="self-start mb-4 px-4 py-2 bg-gray-700 dark:bg-gray-600 text-white rounded hover:bg-gray-600 dark:hover:bg-gray-500 transition"
      >
        Ocultar
      </button>}

      <div className="max-w-4xl w-full bg-gray-800 dark:bg-gray-900 rounded-2xl shadow-xl p-6">
        <h1 className="text-4xl font-bold text-indigo-400 mb-4">{noticia.title}</h1>

        {noticia.image && (
          <img
            src={CargaImagen(noticia.image)}
            alt={noticia.titulo}
            className="rounded-xl w-full h-64 object-cover mb-6 shadow-lg"
          />
        )}

        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{noticia.descripcion}</p>

        <div className="flex justify-between text-gray-400 text-sm">
          <span>Autor: {noticia.autor?.username || "Desconocido"}</span>
          <span>{new Date(noticia.fechaCreacion).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
    </>
  );
}
