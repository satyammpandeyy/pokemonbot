const mongoose = require("mongoose");

const GuildSchema = new mongoose.Schema({
    id: {type: String, required: true},
    pokemon: {type: Object, required: true},
    price: {type: Number, required: true}
});

module.exports = mongoose.model("Market", GuildSchema);