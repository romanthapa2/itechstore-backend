const mongooes = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { Schema } = mongooes;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validator: [validator.isEmail, "please enter valid email"],
  },
  password: { type: String, required: true ,minLength:[6,"name cannot be less than 6 character"], },
  role: { type: String, default: "guest", enum: ["user", "admin", "guest"] },
  date: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCSS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCSS_TOKEN_SECRET_EXPREY,
    }
  );
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");


  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongooes.model("User", userSchema);
