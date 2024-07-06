const express = require('express');
const {body, validationResult }= require('express-validator')
const addProduct = require("../controller/admin.controller.js")
const upload = require("../middleware/multer.middleware.js")
const verifyJWT = require("../middleware/auth.middlware.js")


const router = express.Router();

router.route('/add-product').post(verifyJWT ,
    [
        body("name").notEmpty().withMessage("name is required"),
        body("type").notEmpty().withMessage("type is required"),
        body("brand").notEmpty().withMessage("brand is required"),
        body("desc").notEmpty().withMessage("description is required"),
        body("price").notEmpty().withMessage("price is required"),
        body("img").notEmpty().withMessage("image is required")
    ],
    upload.single("img") , addProduct);

module.exports=router