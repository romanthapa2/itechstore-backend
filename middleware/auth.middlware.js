const jwt_secret = process.env.ACCSS_TOKEN_SECRET_KEY;
const  jwt  = require("jsonwebtoken");
const ApiError = require("../utils/apiError.utils.js");
const User = require("../models/user.model.js");
const asyncHandler = require("../utils/asyncHandler.utils.js");

const verifyUserByJWT = asyncHandler(async(req, _ , next) => {
  try{
  const token =  req.cookies?.accessToken || req.header("auth-token")?.replace("Bearer ","");
  if (!token) {
    throw new ApiError(401, "please authenticate using a valid user");
  }
    const decodedToken = jwt.verify(token, jwt_secret);
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      throw new ApiError(404, "Invalid Acess Token");
    }
    req.user = user;
    next()
  }catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}
});


const verifyAdminByJwt = asyncHandler(async(req, _ ,next)=>{
  try{
    const token = req.cookies?.accessToken || req.header("auth-token")?.replace("Bearer ","");
    if (!token) {
      throw new ApiError(401, "Please authenticate using a valid user");
    }
    const decodedToken = jwt.verify(token, jwt_secret);
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user || user.role !== "admin") {
      throw new ApiError(403, "Unauthorized to access this route");
    }
    req.user = user;
    next()
  }catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
  }
});


module.exports = {verifyUserByJWT,verifyAdminByJwt};
