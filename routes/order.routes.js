const express=require("express");
const {verifyUserByJWT,verifyAdminByJwt}=require("../middleware/auth.middlware");
const { newOrder, myorder, getAllOrders, updateOrder, deleteOrder } = require("../controller/order.controller");

const router=express.Router();

router.route("/new").post(verifyUserByJWT,newOrder);
router.route("/me/:id").get(verifyUserByJWT,myorder);
router.route("/admin/orders").get(verifyAdminByJwt,getAllOrders);
router.route("/admin/:id").put(verifyAdminByJwt,updateOrder).delete(verifyAdminByJwt,deleteOrder);

module.exports=router;