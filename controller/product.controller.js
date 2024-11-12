const Product = require("../models/product.model");
const apiError = require("../utils/apiError.utils.js");
const asyncHandler = require("../utils/asyncHandler.utils.js");

//Get all Products
const getAllProducts = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments({ user: req.user._id });

  const products = await Product.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

const createProductReviews = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user._id.toString();

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const existingReview = product.reviews.find(
    (rev) => rev.user.toString() === userId
  );

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    product.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment,
    });
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

// Get All Reviews of a product
const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new apiError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
const deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new apiError("Product not found", 404));
  }

  product.reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.avg =
    product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
  product.numOfReviews = product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});

const createProduct = asyncHandler(async (req, res) => {
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

  return res
    .status(201)
    .json(new apiResponse(200, createdProduct, "product added successfully"));
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

const getProductDetails = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new apiError(400, "id parameter is missing");
  }
  const findDataById = await Product.findById(id);
  return res.json(new apiResponse(200, findDataById, " products by id "));
});

module.exports = {
  deleteReview,
  getProductDetails,
  getAllProducts,
  createProductReviews,
  getProductReviews,
  createProduct,
  deleteProduct,
  updateProduct,
};
