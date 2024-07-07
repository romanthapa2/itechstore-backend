const express = require("express");
const {registerUser, loginUser} = require("../controller/user.controller.js");
const {body} = require("express-validator");

const router = express.Router();
[
    body('username')
      .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
      .isAlphanumeric().withMessage('Username must contain only letters and numbers'),
    body('email')
      .isEmail().withMessage('Email is not valid'),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
  ],
router.route('/register').post(
    
registerUser
)

router.route("/login").post(loginUser)

module.exports = router;