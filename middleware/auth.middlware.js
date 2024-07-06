const jwt_secret = process.env.ACCSS_TOKEN_SECRET_KEY;
const { verify } = require("jsonwebtoken");
const apiError = require("../utils/apiError.utils");

const verifyJWT = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    throw new apiError(401, "please authenticate using a valid user");
  }
  try {
    const data = verify(token, jwt_secret);
    req.user = data.user;
    next();
  } catch (error) {
    throw new apiError(401, "Invalid token");
  }
};
module.exports = verifyJWT;
