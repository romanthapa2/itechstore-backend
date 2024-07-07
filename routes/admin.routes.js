const express = require('express');
const {body, validationResult }= require('express-validator')
const addProduct = require("../controller/admin.controller.js")
const upload = require("../middleware/multer.middleware.js")
const verifyJWT = require("../middleware/auth.middlware.js")


const router = express.Router();

router.post('/add-product',(req,res,next)=>{
    body("name")
            .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
     body("type")
     .isLength({ min: 5 }).withMessage('type must be at least 5 characters long'),
    body("desc")
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),
    body("price")
    .isLength({min:3}).withMessage("Price must be at least 3 characters long")
    next()
},
  upload.single("img"),
  addProduct
  )

module.exports=router