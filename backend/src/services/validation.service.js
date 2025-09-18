import { ErrorApp } from "../utils/ErrorApp.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userRegex = /^[A-Za-z0-9._-]+$/;
const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/u;
const numberRegex = /^\d+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
// Cadena peligrosa de cosas que me van a molestar
const caracteresPeligrosos = /[\$\{\}\[\]]/g; // $ { } [ ]
/* 
    Solo chatgpt y dios saben que show con estas Regex, pero basicamente solo admite alfabeto latino con acentos,
    el usuario no admite acentos ni ñ, los numeros, que sorpresa son numeros.

    Primero se van a hacer las validaciones que obviamente van a ser muy estrictas solo para el
    * email
    * usuario
    * nombres
    * numeros
    
    El caso de los textos va a ser algo especial, mi idea es encriptar en base de datos cuando el usuario meta algo raro
    pero cuando lo traiga de vuelta este aca al 100, chido.
*/



// Encripta caracteres que pueden causar inyecciones, y las encriptamos a ENC[0xAlgo]
export function encriptaCaracteresRaros(text) {
  if (typeof text !== 'string') return text;
  // Normaliza para evitar que alguien quiera usar elementos diferentes del Unicode
  const normalized = text.normalize('NFC');

  return normalized.replace(caracteresPeligrosos, (char) => {
    const code = char.codePointAt(0); // Devolvemos el valor unicode en el indice que como vamos iterando letra por letra, pues es 0
    // representamos en hex, sin ceros innecesarios, pero con prefijo 0x
    const hex = code.toString(16); //Pasamos a hexadecimal
    return `ENC[0x${hex}]`;
  });
}

// Desencripta y trae de vuelta para el usuario
export function desencriptaCaracteresRaros(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/ENC\[0x([0-9a-fA-F]+)\]/g, (_, hex) => { // Regex para encontrar cosas encriptadas en el back y mostrarlas al front
    return String.fromCharCode(parseInt(hex, 16)); //Convertimos del hexadecimal encriptado a su valor original
  });
}

//#region Validaciones anti Jochis
export function validateEmail(email) {
  if (!emailRegex.test(email)) 
    throw new ErrorApp('Formato no valido', 400);
  return email;
}

export function validateContra(password){
    if (!passwordRegex.test(password)){
        throw new ErrorApp("La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial", 400);
    }
    return password
}

export function validateUser(user) {
  if (!userRegex.test(user)) throw new ErrorApp('Nop, no puedes. Deja de meter cosas raras, ni espacios!', 400);
  return user;
}

export function validateName(name) {
  if (!nameRegex.test(name)) throw new ErrorApp('Acaso tu nombre tiene numeros o signos?', 400);
  return name;
}

export function validateNumber(num) {
  if (!numberRegex.test(num)) throw new ErrorApp('en un campo de numeros, adivina genio, SOLO ACEPTA NUMEROS',400);
  return num;
}

export function validateText(text) {
  // Encriptamos caracteres peligrosos
  return encriptaCaracteresRaros(text);
}

//#endregion