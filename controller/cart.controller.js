const Cart = require("../models/cart.model.js")
const apiResponse = require("../utils/apiResponse.utils")
const asyncHandler = require("../utils/asyncHandler.utils.js");
const apiError = require("../utils/apiError.utils.js");

const addToCart= asyncHandler(async(req,res)=>{
    const {user,product,totalPrice,totalQuantity} = req.body
    const existingUser = await Cart.findOne({user:user._id})
    if(existingUser){
        Cart.products.push(product)
    }

})