const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
    id: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    name: { type: String, default: null },
    url: { type: String, default: null },
    hp: { type: Number, default: null },
    atk: { type: Number, default: null },
    def: { type: Number, default: null },
    spatk: { type: Number, default: null },
    spdef: { type: Number, default: null },
    speed: { type: Number, default: null },
    moves: { type: Array, default: [] },
    shiny: { type: Boolean, default: false },
    rarity: { type: String, default: null },
    nature: { type: String, default: null },
    totalIV: { type: Number, default: null },
    // ability:{type: String, default :null}
});

module.exports = mongoose.model("Pokemon", PokemonSchema);