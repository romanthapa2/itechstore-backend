const express = require('express');
const {body, validationResult }= require('express-validator')
const addProduct = require("../controller/admin.controller.js")
const upload = require("../middleware/multer.middleware.js")

const ApiError = require("../utils/apiError.utils.js")
const router = express.Router();

const validateLengthOfProductData =
  [
    body("name")
    .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
  body("type")
  .isLength({ min: 5 }).withMessage('type must be at least 5 characters long'),
  body("desc")
  .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
  body("price")
  .isLength({min:3}).withMessage("Price must be at least 3 characters long")
  ]

router.route('/add-product').post(
  validateLengthOfProductData,(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(400, errors.array().map(err => err.msg));
    }
    next();
  },

  upload.single("img"),
  addProduct
  )

module.exports=router