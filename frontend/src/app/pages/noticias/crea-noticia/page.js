'use client';
import ProtectedPage from '@/components/ProtectedPage';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addNoticias } from '@/lib/api';

export default function AddNoticiaPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const router = useRouter();

  // Convierte la imagen a base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {

      const data = await addNoticias(title, description, image);

      if (data.ok) {
        setMensaje('Noticia creada correctamente!');
        setTitle('');
        setDescription('');
        setImage(null);
        setPreview(null);
      } else {
        setMensaje(`${data.mensaje || 'Error al crear la noticia'}`);
      }
    } catch (error) {
      console.error(error);
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="w-full max-w-xl bg-gradient-to-tr from-gray-800 via-gray-900 to-black rounded-3xl shadow-2xl p-10 space-y-6 border border-gray-700">
          <h1 className="text-4xl font-extrabold text-center text-indigo-400 mb-4">
            📰 Agregar Noticia
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-gray-300">Título:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Escribe el título de la noticia"
                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-300">Descripción:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Agrega una descripción breve de la noticia"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-300">Imagen (opcional):</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-gray-200"
              />
            </div>

            {preview && (
              <div className="mt-4">
                <p className="mb-2 font-semibold text-indigo-300">Vista previa:</p>
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-xl max-h-64 w-full object-contain border border-gray-600 shadow-inner"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold rounded-xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              Crear Noticia
            </button>
          </form>
          <Link href="/pages/home" >
                <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold rounded-xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                    Home
                </button>
            </Link>

          {mensaje && (
            <p className="text-center mt-4 font-medium text-yellow-400">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
