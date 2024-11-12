const express=require("express");
const {verifyUserByJWT,verifyAdminByJwt}=require("../middleware/auth.middlware");
const { newOrder, myorder, getAllOrders, updateOrder, deleteOrder } = require("../controller/order.controller");

const router=express.Router();

router.route("/order/new").post(verifyUserByJWT,newOrder);
router.route("/order/me/:id").get(verifyUserByJWT,myorder);
router.route("/admin/order").get(verifyAdminByJwt,getAllOrders);
router.route("/admin/order/:id").put(verifyAdminByJwt,updateOrder).delete(verifyAdminByJwt,deleteOrder);

module.exports=router;