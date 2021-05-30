const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    id: { type: String, required: true },
    time: { type: Number, default: 0 }
});

module.exports = mongoose.model("Daily", productSchema);