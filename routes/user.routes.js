const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  resetPassword,
  updatePassword,
  forgotPassword,
} = require("../controller/user.controller.js");
const { body, validationResult } = require("express-validator");
const ApiError = require("../utils/apiError.utils.js");
const {
  verifyUserByJWT,
  verifyAdminByJwt,
} = require("../middleware/auth.middlware");

const router = express.Router();

const validateRegister = [
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
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/password/update").put(verifyUserByJWT, updatePassword);
router.route("/logout").post(logout);

module.exports = router;
