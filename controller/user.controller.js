const ApiError = require("../utils/apiError.utils.js");
const ApiResponse = require("../utils/apiResponse.utils.js");
const asyncHandler = require("../utils/asyncHandler.utils");
const User = require("../modules/user.module.js");
const {validationResult} = require("express-validator")

// const generateAccessTokens = async(userId) =>{
//   try {
//       const user = await User.findById(userId)
//       const accessToken = user.generateAccessToken()
//       return accessToken
//   } catch (error) {
//       throw new ApiError(500, "Something went wrong while generating access token")
//   }
// }

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body["name"])
  console.log(req.body.name)
  // {first name:"xyz"} 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    throw new ApiError(400, "User already exits please login");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
console.log(user._id)
  const createdUser = await User.findById(user._id).select("-password -email");
  console.log(createdUser)

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the User");
  }

  const accessToken = await createdUser.generateAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
}

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200,
         { user: createdUser, accessToken  },
          "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(400, "User does not exits please signup");
  }

  const comparePassword = await user.isPasswordCorrect(password);

  if (!comparePassword) {
    throw new ApiError(400, "password is incorrect");
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  const accessToken = await user.generateAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200)
    .cookie("accessToken", accessToken , options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in Successfully"
      )
    )

});

module.exports = { registerUser, loginUser };
