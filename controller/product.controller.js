const Product = require("../models/product.model");
const ApiError = require("../utils/apiError.utils.js");
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

//Details of Product
const createProductReviews = asyncHandler(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const userId = req.user._id.toString();

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const existingReview = product.reviews.find((rev) => rev.user.toString() === userId);

  if (existingReview) {
    existingReview.rating = Number(rating);
    existingReview.comment = comment;
  } else {
    product.reviews.push({ user: req.user._id, rating: Number(rating), comment });
    product.numOfReviews = product.reviews.length;
  }

  product.ratings = product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});


// Get All Reviews of a product
const getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ApiError("Product not found", 404));
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
    return next(new ApiError("Product not found", 404));
  }

  product.reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );


  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.avg = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;
  product.numOfReviews = product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true });
});



module.exports= {deleteReview,getAllProducts,getProductDetails,createProductReviews,getProductReviews};