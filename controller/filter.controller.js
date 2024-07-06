const Product = require("../modules/product.module.js");
const asyncHandler = require("../utils/asyncHandler.utils.js")
const apiResponse = require("../utils/apiResponse.utils.js")
const apiError = require("../utils/apiError.utils.js")


const getDataByType = asyncHandler(async(req,res)=>{
  const type = req.query.type;
  if (!type) {
    throw new apiError(400,"type parameter is missing")
  }
  const filteredDataByType = await Product.find({ type });
  apiResponse(200, filteredDataByType, "types of products")
})



const getDataByBrand = asyncHandler(async(req,res)=>{
    const brand = req.query.brand;
    if (!brand) {
      throw new apiError(400,"brand parameter is missing")
    }
    const filteredDataByBrand = await Product.find({ brand });
    apiResponse(200, filteredDataByBrand, " products by brand")
})



const getDataById = asyncHandler(async(req,res)=>{
  const id = req.params.id;
  if (!id) {
    throw new apiError(400,"id parameter is missing")
  }
  const findDataById = await Product.findById(id);
  apiResponse(200, filteredDataById, " products by id ")
})

module.exports = {getDataByType , getDataById , getDataByBrand};
