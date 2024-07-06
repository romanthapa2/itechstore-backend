const express = require("express");
const {registerUser, loginUser} = require("../controller/user.controller.js");
const {body} = require("express-validator");

const router = express.Router();

router.route('/register').post(
registerUser
)

router.route("/login").post(loginUser)

module.exports = router;