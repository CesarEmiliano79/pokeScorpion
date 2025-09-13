// lib/api.ts
export async function fetchNoticias(page = 1, limit = 5) {
  const res = await fetch(`http://localhost:3001/api/noticias/?page=${page}&limit=${limit}`,{
     method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        });
  if (!res.ok) throw new Error("Error al cargar noticias");
  return res.json();
}
