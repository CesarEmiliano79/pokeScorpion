"use client";
import Navbar from '@/components/Navbar'
import ProtectedPage from '@/components/ProtectedPage'
import React from 'react'
import MapComponent from '@/components/Map'

export default function Home() {
  return (
    <ProtectedPage>
      <Navbar />
      <main className="bg-black min-h-screen text-white flex flex-col items-center px-6">
        <section className="w-full max-w-4xl text-center mt-20 mb-16">
          <h2 className="text-5xl font-extrabold mb-6 tracking-wide">
            Bienvenido a <span className="text-red-500">pokeScorpion</span>
          </h2>
          <p className="text-xl text-gray-300">
            Noticias y novedades del mundo Pokémon con presencia en 
            <span className="text-yellow-400"> Ciudad de México</span> y 
            <span className="text-yellow-400"> Guadalajara</span>.
          </p>
        </section>
        <section className="w-full max-w-5xl bg-neutral-900 rounded-2xl shadow-lg p-10 mb-16">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">
            Sobre Nosotros
          </h2>
          <p className="text-lg leading-relaxed mb-4 text-gray-300">
            En <span className="text-red-500 font-semibold">pokeScorpion</span> 
            nos apasiona el universo de Pokémon y creemos que la mejor forma de 
            fortalecer la comunidad es a través de la información clara, veraz 
            y entretenida. Nuestro objetivo es mantenerte actualizado con 
            las últimas noticias, eventos y curiosidades de esta franquicia 
            que ha marcado a generaciones enteras.
          </p>
          <p className="text-lg leading-relaxed mb-4 text-gray-300">
            Fundado con la misión de crear un espacio de referencia para 
            entrenadores y fanáticos, pokeScorpion se ha consolidado como un 
            punto de encuentro donde la pasión por Pokémon se vive al máximo. 
            Nos enorgullece contar con presencia en 
            <span className="text-yellow-400"> Ciudad de México</span> y 
            <span className="text-yellow-400"> Guadalajara</span>, dos ciudades 
            clave para nuestra comunidad.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Mi nombre es <span className="font-semibold">Alan Giovanni Torres Mora</span>, 
            y como parte de un proyecto académico desarrollé este sitio web 
            con el propósito de demostrar cómo puede estructurarse una plataforma 
            de noticias digitales moderna, con un diseño formal y funcional.
          </p>
        </section>

        {/* Mapa de la republica con nuestras supuestas sucursales */}
        <section className="w-full max-w-5xl mb-16">
          <h2 className="text-3xl font-bold text-center mb-6">Nuestras Sucursales</h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
            <MapComponent />
          </div>
        </section>
      </main>
    </ProtectedPage>
  )
}
