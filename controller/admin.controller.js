const Product = require("../models/product.model.js");
const asyncHandler = require("../utils/asyncHandler.utils.js");
const apiError = require("../utils/apiError.utils.js");
const apiResponse = require("../utils/apiResponse.utils.js");


const addProduct = asyncHandler(async (req, res) => {
  
  const { name, type, brand, desc, price } = req.body;
  const img = `${req?.file?.path}`;
 

  const product = await Product.create({
    name,
    type,
    brand,
    desc,
    price,
    img,
  });

  const createdProduct = await Product.findById(product._id);

  if (!createdProduct) {
    throw new apiError(500, "error creating product");
  }

  return res.status(201).json(new apiResponse(200, createdProduct, "product added successfully"));
});


//Delete Products--Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new apiError("Product not found", 404));
  }

  await Product.findByIdAndDelete(req.params.id, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Product Deleted",
  });
});

//Update Products--Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new apiError("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});


module.exports = {addProduct,deleteProduct, updateProduct};
