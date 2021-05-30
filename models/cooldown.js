const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    id: {type:String, required: true},
    time: {type:Number, required:true}
});

module.exports = mongoose.model("Cooldown", productSchema);