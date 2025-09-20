// components/NewsCard.js
import React from "react";
import Link from "next/link";

export default function NewsCard( noticia ) {
  return (
    <Link href={`/pages/noticias/${noticia._id}`}>
      <div className="bg-gray-900 rounded-2xl shadow-xl p-4 w-80 flex-shrink-0 transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer">
        {noticia.image && (
          <img
            src={`http://localhost:3001/imagenesNoticias/${noticia.image}`}
            alt={noticia.titulo}
            className="rounded-xl w-full h-40 object-cover mb-4"
          />
        )}

        <h3 className="text-xl font-bold text-indigo-400 mb-2 line-clamp-1">
          {noticia.title}
        </h3>

        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
          {noticia.descripcion || "Sin descripción."}
        </p>

        <div className="flex justify-between items-center text-gray-400 text-xs">
          <span>Autor: {noticia.autor?.username || "Desconocido"}</span>
          <span>{new Date(noticia.fechaCreacion).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}
