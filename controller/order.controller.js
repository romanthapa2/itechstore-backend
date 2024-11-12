const Order=require("../models/order.model");
const Product=require("../models/product.model");
const User=require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler.utils")
const apiError = require("../utils/apiError.utils")


const newOrder = asyncHandler(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,}=req.body;

    const orders = await Order.create({shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt: Date.now(),user: req.user._id,});
    
      res.status(201).json({
        success: true,
        orders,
      });
});
  

const myorder=asyncHandler(async(req,res,next)=>{
  const orders=await Order.find({user:req.params.id});

  res.status(200).json({
    success:true,
    orders
  });
});


const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});


const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new apiError("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new apiError("You have already delivered this order", 400));
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock -= quantity;

  await product.save({ validateBeforeSave: false });
}


const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new apiError("Order not found with this Id", 404));
  }

  await User.findByIdAndDelete(req.params.id,{
    new:true,
    runValidators:true,
    useFindAndModify:false
  });

  res.status(200).json({
    success: true,
  });
});

module.exports = {newOrder,myorder,getAllOrders,updateOrder,deleteOrder}