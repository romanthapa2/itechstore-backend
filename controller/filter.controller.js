const Product = require("../models/product.model.js");
const asyncHandler = require("../utils/asyncHandler.utils.js");
const apiResponse = require("../utils/apiResponse.utils.js");
const apiError = require("../utils/apiError.utils.js");

const getDataByFilters = asyncHandler(async (req, res) => {
  const { type, brand } = req.query;

  if (!type && !brand) {
    throw new apiError(400, "Either 'type' or 'brand' parameter is required");
  }

  const filter = {};
  if (type) {
    filter.type = type;
  }
  if (brand) {
    filter.brand = brand;
  }

  const filteredData = await Product.find(filter).select("-desc");

  return res.json(new apiResponse(200, filteredData, "Filtered products"));
});

const getDataBySearch = asyncHandler(async (req, res) => {
  const { search } = req.query;
  if (!search) {
    throw new apiError(400, "Search parameter is missing");
  }
  const searchRegex = new RegExp(search, "i");
  const searchData = await Product.find({
    $or: [{ name: searchRegex }, { brand: searchRegex }, { type: searchRegex }],
  }).select("-desc");
  return res.json(new apiResponse(200, searchData, "Products by search"));
});

const getDataById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) {
    throw new apiError(400, "id parameter is missing");
  }
  const findDataById = await Product.findById(id);
  return res.json(new apiResponse(200, findDataById, " products by id "));
});

module.exports = { getDataById, getDataByFilters, getDataBySearch };
