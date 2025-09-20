"use client";
import { fetchLogin } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchLogin( email, password );
      console.log(data);
      if (!data.ok) {
        setMensaje(data.mensaje || "Ocurrió un error");
        return;
      }

      setMensaje(data.mensaje);
      router.push("/pages/home");
    } catch (error) {
      console.error("Error en fetch:", error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black px-4">
      <div className="bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-md w-full border border-zinc-700">
        <h2 className="text-3xl font-bold text-center text-amber-400 mb-6 drop-shadow-lg">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Correo</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 text-white placeholder-zinc-500 border border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-black font-semibold py-2 rounded-lg hover:bg-amber-400 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center text-red-400 font-medium">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
