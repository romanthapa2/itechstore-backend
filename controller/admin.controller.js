const Product = require("../modules/product.module.js");
const { validationResult } = require("express-validator");
const asyncHandler = require("../utils/asyncHandler.utils.js");
const apiError = require("../utils/apiError.utils.js");
const apiResponse = require("../utils/apiResponse.utils.js");


const addProduct = asyncHandler(async (req, res) => {
  // validate if the req data is according to the rules set up
  // get the data from the fronted
  // check for images
  // create a new admin in database
  // check for data creation
  // return a json
  
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

module.exports = addProduct;
