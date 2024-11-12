const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReviews,
  getProductReviews,
  deleteReview,
} = require("../controller/product.controller");
const { verifyUserByJWT, verifyAdminByJwt } = require("../middleware/auth");
const router = express.Router();


router.route("/products").get(getAllProducts);
router
  .route("/product/new")
  .post(verifyAdminByJwt, createProduct);
router
  .route("/product/:id")
  .put(verifyAdminByJwt, updateProduct)
  .delete(verifyAdminByJwt, deleteProduct)
  .get(getProductDetails);
router.route("/review").put(verifyUserByJWT, createProductReviews);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(verifyUserByJWT, deleteReview);

module.exports = router;
