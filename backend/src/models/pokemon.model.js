import mongoose from "mongoose";

const AttackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    power: { type: Number, default: null },
    accuracy: { type: Number, default: null },
    pp: { type: Number, default: null },
    type: { type: String, required: true }
}, { _id: false });

const EvolutionSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    image: { type: String }
}, { _id: false });

const PokemonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    attacks: [AttackSchema],
    evolutions: [EvolutionSchema],
    games: [String],
}, { timestamps: true });

export default mongoose.model("Pokemon", PokemonSchema);
