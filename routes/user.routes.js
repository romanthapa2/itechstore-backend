const express = require("express");
const {registerUser, loginUser} = require("../controller/user.controller.js");
const {body} = require("express-validator");

const router = express.Router();

router.route('/register').post( [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],
registerUser
)

router.route("/login").post(loginUser)

module.exports = router;