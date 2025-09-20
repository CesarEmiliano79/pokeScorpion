"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { fetchNoticia, updateNoticia } from "@/lib/api";
export default function EditarNoticia() {
  const { id } = useParams();
  const router = useRouter();
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [esMostrable, setEsMostrable] = useState(true);

  useEffect(() => {
    const cargaInicialNoticia = async () => {
      try {
        const data = await fetchNoticia(id);
        console.log(data);
        setNoticia(data.data);
        setTitle(data.data.title || "");
        setDescripcion(data.data.descripcion || "");
        setEsMostrable(data.data.esMostrable ?? true);
      } catch (error) {
        console.error("Error al obtener noticia:", error);
      }
      setLoading(false);
    };
    cargaInicialNoticia();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateNoticia(id, title, descripcion, esMostrable, imageBase64);
      if (data.ok) {
        alert("Noticia actualizada correctamente");
        router.push(`/pages/noticias/${id}`);
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al actualizar noticia:", error);
    }
  };

  if (loading) return <p className="text-white p-6">Cargando noticia...</p>;
  if (!noticia) return <p className="text-white p-6">Noticia no encontrada</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black p-6 flex flex-col items-center">
        <div className="max-w-3xl w-full bg-gray-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-indigo-400 mb-6">Editar Noticia</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="5"
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
            </div>

            <div>
                <label className="block text-gray-300 mb-1">Imagen</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {imageBase64 ? (
                    <img
                    src={imageBase64}
                    alt="Nueva imagen"
                    className="mt-3 rounded-lg w-64"
                    />
                ) : (
                    noticia.image && (
                    <img
                        src={`http://localhost:3001/imagenesNoticias/${noticia.image}`}
                        alt="Imagen actual"
                        className="mt-3 rounded-lg w-64"
                    />
                    )
                )}
            </div>


            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={esMostrable}
                onChange={(e) => setEsMostrable(e.target.checked)}
              />
              <span className="text-gray-300">Mostrar en listado</span>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
