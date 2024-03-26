const mongoose = require("mongoose");
const { Schema } = mongoose;
const adminSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  brand: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: String, required: true },
  img: {
    type: String, required: true
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("admin", adminSchema);