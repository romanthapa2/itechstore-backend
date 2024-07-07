const express = require('express');
const {body, validationResult }= require('express-validator')
const addProduct = require("../controller/admin.controller.js")
const upload = require("../middleware/multer.middleware.js")
const verifyJWT = require("../middleware/auth.middlware.js")


const router = express.Router();

router.route('/add-product').post(
    upload.single("img") , addProduct);

module.exports=router