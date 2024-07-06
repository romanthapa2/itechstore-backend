const mongooes = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const { Schema } = mongooes;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
  return jwt.sign({
    _id : this._id,
  },process.env.ACCSS_TOKEN_SECRET_KEY,{
    expiresIn : process.env.ACCSS_TOKEN_SECRET_EXPREY
  }
)
}

module.exports = mongooes.model("User", userSchema);
