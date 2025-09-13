import Pokemon from "../models/pokemon.model.js";

//GET /api/pokemones?page=1&limit=10
export const getPokemones = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = Number(page);
        limit = Number(limit);

        // Validar números
        if (!Number.isInteger(page) || !Number.isInteger(limit)) {
            return res.status(400).json({ success: false, mensaje: "Los parámetros deben ser enteros" });
        }

        // Validar límites
        if (limit <= 0) {
            return res.status(400).json({ success: false, mensaje: "El límite debe ser mayor a 0" });
        }

        if (limit > 10) {
            return res.status(400).json({ success: false, mensaje: "No puedes pedir más de 10 resultados" });
        }

        const total = await Pokemon.countDocuments();
        const totalPages = Math.ceil(total / limit);

        if (page <= 0 || page > totalPages) {
            return res.status(404).json({ success: false, mensaje: "Página fuera de rango" });
        }

        const pokemones = await Pokemon.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ _id: 1 })
            .select("name image");

        res.json({
            success: true,
            page,
            totalPages,
            total,
            limit: pokemones.length,
            data: pokemones
        });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: "Error obteniendo pokemones", error: error.mensaje });
    }
};


// GET /api/pokemon/:pokemonId
export const getPokemon = async (req, res) => {
    try {
        const { pokemonId } = req.params;

        // Validar ID de Mongo
        if (!pokemonId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, mensaje: "ID inválido" });
        }

        const pokemon = await Pokemon.findById(pokemonId).select("name types image stats");
        if (!pokemon) {
            return res.status(404).json({ success: false, mensaje: "Pokémon no encontrado" });
        }

        res.json({ success: true, data: pokemon });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: "Error obteniendo el Pokémon", error: error.mensaje });
    }
};



// GET /api/pokemones/search?query=pika

export const searchPokemon = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === "") {
            return res.status(400).json({ success: false, mensaje: "Debes enviar un parámetro de búsqueda" });
        }

        const results = await Pokemon.find({
            name: { $regex: query, $options: "i" }
        })
            .limit(10)
            .select("name types image");

        res.json({
            success: true,
            total: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: "Error buscando pokemones", error});
    }
};

/**
 * Verificar usuario autenticado
 */
export const checarAutenticado = (req, res) => {
    try {
        res.status(200).json({ success: true, user: req.user });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: "Error interno del servidor", error });
    }
};
