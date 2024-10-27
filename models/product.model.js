const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  name: { type: String, required: [true,"Please Enter the Name"] },
  type: { type: String, required: [true,"Please Enter the Type"] },
  brand: { type: String, required: [true,"Please Enter the Brand"] },
  desc: { type: String , required: [true,"Please Enter the Description"]},
  price: { type: String, required: [true,"Please Enter the Price"] },
  img: { type: String, required: [true,"Please Select the Image"] },
  stock: {
    type: Number,
    required: [true, "Please Enter The Product Stock"],
    maxlength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
