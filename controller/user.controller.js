const ApiError = require("../utils/apiError.utils.js");
const ApiResponse = require("../utils/apiResponse.utils.js");
const asyncHandler = require("../utils/asyncHandler.utils");
const User = require("../models/user.model.js");


const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body["name"])
  // console.log(req.body.name)
  // {first name:"xyz"} 
  const { email, password } = req.body;

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    throw new ApiError(400, "User already exits please login");
  }

  const user = await User.create({
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select("-password -email");


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
