"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRegister } from "@/lib/api";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sexo, setSexo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {

      const data = await fetchRegister(username, email, password, sexo);

      if (!data.ok) {
        setMensaje(data.mensaje || "Ocurrió un error");
        return;
      }

      setMensaje(data.mensaje);
      // Limpiar formulario
      setUsername("");
      setEmail("");
      setPassword("");
      setSexo("");

      router.push("/pages/home"); 
    } catch (error) {
      console.error("Error en fetch:", error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="bg-black border border-neutral-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-white">
        <h2 className="text-3xl font-bold text-center mb-6">Registro</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-black border border-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          >
            <option value="" disabled>Selecciona tu sexo</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>

          <button
            type="submit"
            className="w-full bg-amber-600 text-black font-semibold py-2 rounded-lg hover:bg-amber-500 transition-colors duration-300"
          >
            Registrarse
          </button>
        </form>

        {mensaje && (
          <p className="mt-4 text-center text-red-400 font-medium">{mensaje}</p>
        )}
      </div>
    </div>
  );
}
