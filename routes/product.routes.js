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
const {
  verifyUserByJWT,
  verifyAdminByJwt,
} = require("../middleware/auth.middlware");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/multer.middleware.js");

const validateLengthOfProductData = [
  body("name")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long")
    .escape(),
  body("type")
    .trim()
    .isLength({ min: 5 })
    .withMessage("type must be at least 5 characters long")
    .escape(),
  body("desc")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long")
    .escape(),
  body("price")
    .trim()
    .isNumeric()
    .withMessage("Price must be a numeric value")
    .escape(),
];


router.route("/new").post(
  verifyAdminByJwt,
  validateLengthOfProductData,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(
        400,
        errors.array().map((err) => err.msg)
      );
    }
    next();
  },
  upload.single("img"),
  createProduct
);
router
  .route("/:id")
  .put(verifyAdminByJwt, updateProduct)
  .delete(verifyAdminByJwt, deleteProduct)
  .get(getProductDetails);
router.route("/review").put(verifyUserByJWT, createProductReviews);
router
  .route("/reviews")
  .get(getProductReviews)
  .delete(verifyUserByJWT, deleteReview);

module.exports = router;
