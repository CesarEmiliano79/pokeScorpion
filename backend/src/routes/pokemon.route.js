import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getPokemon, getPokemones, searchPokemon, checarAutenticado } from '../controllers/pokemon.controller.js';
const router = express.Router();
router.get("/", protectRoute, getPokemones); // Paginación
router.get("/pokemon/:pokemonId", protectRoute, getPokemon); // Uno específico
router.get("/search", protectRoute, searchPokemon); // Búsqueda
router.get("/check", protectRoute, checarAutenticado);
export default router;