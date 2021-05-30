const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
	id: { type: String, required: true },
	time: { type: Number, default: 0 },
	pokemon: { type: Object, required: true },
	bid: { type: Number, required: true },
	//    cool:{type: Boolean, required: true}
	user: { type: String }
});

module.exports = mongoose.model("Auction", productSchema);