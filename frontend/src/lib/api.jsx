// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '/';
console.log(BASE_URL)
export async function fetchNoticias(page = 1, limit = 5) {
  const res = await fetch(`${BASE_URL}/api/noticias/?page=${page}&limit=${limit}`,{
     method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        });
  if (!res.ok) throw new Error("Error al cargar noticias");
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function addNoticias(title, description, image){
  const res = await fetch(`${BASE_URL}/api/noticias/add-noticia`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, descripcion: description, imageBase64: image }),
        credentials: 'include',
      });
  if (!res.ok) throw new Error("Error al crear la noticia");
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export function CargaImagen(nombreImagen) {
  return  `${BASE_URL}/imagenesNoticias/${nombreImagen}`;
}

export async function fetchLogin(email, password) {
  const res = await fetch(`${BASE_URL}/api/autenticacion/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  // Devuelve el status y el json juntos
  const data = await res.json();
  return { ok: res.ok, ...data };
}


export async function fetchRegister(username, email, password, sexo){
  const res = await fetch(`${BASE_URL}/api/autenticacion/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, sexo }),
        credentials: "include",
      });
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function fetchNoticia(id){
  const res = await fetch(`${BASE_URL}/api/noticias/noticia/${id}`);
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function updateNoticia(id, title, descripcion, esMostrable, imageBase64){
  const res = await fetch(`${BASE_URL}/api/noticias/update-noticia/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          descripcion,
          esMostrable,
          imageBase64,
        }),
        credentials: "include", 
      });
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function ocultaNoticia(id) {
  const res = await fetch(`http://localhost:3001/api/noticias/ocultar-noticia/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", 
  });
  const data = await res.json();
  return { ok: res.ok, ...data };
}

export async function ubicacion() {
  const res = await fetch(`${BASE_URL}/api/ubicacion`);
  return res.json();
}

export async function autenticado() {
  const res = await fetch(`${BASE_URL}/api/autenticacion/check`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await res.json();
  return { ok: res.ok, ...data };
}


export async function cerrarSesion(){
  await fetch("http://localhost:3001/api/autenticacion/logout", {
        method: "POST",
        credentials: "include",
      });
}