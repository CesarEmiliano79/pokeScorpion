import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black px-4">
      <div className="flex flex-col items-center bg-zinc-800 rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
        

        <Image
          src="/sad-pikachu.gif"
          alt="error 404"
          width={160}
          height={160}
          className="mb-6"
        />

        <h1 className="text-8xl font-extrabold text-amber-600 mb-4">404</h1>
        <p className="text-gray-400 text-lg mb-6">
          Lo sentimos, pero no pudimos encontrar lo que quieres :(
        </p>

        <Link
          href="/"
          className="px-8 py-2 w-80 mt-10 bg-amber-600 text-black font-semibold rounded-xl shadow-md hover:bg-amber-500 transition-colors duration-300"
        >
          Regresa
        </Link>
      </div>
    </div>
  );
}
