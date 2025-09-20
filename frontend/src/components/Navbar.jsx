"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/app/css/Navbar.css";
import { autenticado, cerrarSesion } from "@/lib/api";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const router = useRouter();
  // Verificar si el usuario tiene cookie JWT válida
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await autenticado();

        if (!data.ok) {
          setIsLogged(false);
          return;
        }

        setAdmin(data.esAdmin);
        setIsLogged(true);
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        setIsLogged(false);
      }
    };

    checkAuth();
  }, []);

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await cerrarSesion();
      setIsLogged(false);
      router.replace("/"); // Redirige al inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <nav>
      {/* LOGO */}
      <div>
        <Link href="/" className="NavbarLogo">
          <Image src="/ScorpionWebPoke.png" width={60} height={60} alt="PokeLogo" />
          <h1>PokeScorpion</h1>
        </Link>
      </div>

      {/* BOTÓN HAMBURGUESA */}
      <div className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* RUTAS */}
      <div className={`Rutas ${isOpen ? "active" : ""}`}>
        {!isLogged ? (
          <>
            <Link href="/pages/somos">Qué es PokeScorpion?</Link>
            <Link href="/pages/login">Inicia Sesión</Link>
            <Link href="/pages/register">¡Regístrate!</Link>
          </>
        ) : (
          <>
            <Link href="/pages/home">Home</Link>
            <Link href="/pages/noticias">Noticias</Link>
            {/* <Link href="/pages/pokemones">Pokemones</Link> */}
            {console.log("Aqui si hay o no hay admin " + isAdmin)}
            {isAdmin && <Link href="/pages/noticias/crea-noticia">Agrega noticia</Link>}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
