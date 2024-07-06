const express = require('express');
const {body, validationResult }= require('express-validator')
const addProduct = require("../controller/admin.controller.js")
const upload = require("../middleware/multer.middleware.js")
const verifyJWT = require("../middleware/auth.middlware.js")


const router = express.Router();

router.route('/add-product').post(
    [
        body("name").notEmpty().withMessage("name is required"),
        body("type").notEmpty().withMessage("type is required"),
        body("brand").notEmpty().withMessage("brand is required"),
        body("desc").notEmpty().withMessage("description is required"),
        body("price").notEmpty().withMessage("price is required"),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      },
    upload.single("img") , addProduct);

module.exports=router