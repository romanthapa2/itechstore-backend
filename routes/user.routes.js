const express = require("express");
const { registerUser, loginUser } = require("../controller/user.controller.js");
const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/apiError.utils.js");

const router = express.Router();

const validateRegister = [
  body("name")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters long"),
  body("email").isEmail().normalizeEmail().withMessage("Email is not valid"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

router.post(
  "/register",
  validateRegister,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ApiError(
        400,
        errors.array().map((err) => err.msg)
      );
    }
    next();
  },
  registerUser
);

router.route("/login").post(loginUser);

module.exports = router;
