const apiError = require("../utils/apiError.utils.js");
const apiResponse = require("../utils/apiResponse.utils.js");
const asyncHandler = require("../utils/asyncHandler.utils");
const User = require("../modules/user.module.js");

const registerUser = asyncHandler(async (req, res) => {
  // use middleware for validating if User has given all information for signup
  // take the values from the body
  // check if the User has already singed up before
  // if not create a new User
  // check if the User is created or not
  // if created respond

  const { name, email, password } = req.body;

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    throw new apiError(400, "User already exits please login");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(User._id).select("-password -email");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the User");
  }

  const accessToken = await generateAccessToken(User._id);

  return res
    .status(201)
    .json(new apiResponse(200,
         { User: createdUser, accessToken },
          "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // use middleware for validating if User has given all information for login
  // take the values from the body
  // check if the User exists in the database
  // if exists compare the password
  // if matched send the jwt token to the User
  // if not throw an error

  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new apiError(400, "User does not exits please signup");
  }

  const comparePassword = await User.isPasswordCorrect(password);

  if (!comparePassword) {
    throw new apiError(400, "password is incorrect");
  }

  const loggedInUser = await User.findById(User._id).select("-password -email");

  const accessToken = await User.generateAccessToken(User._id);

  return res.json(new apiResponse(200,
     { User: loggedInUser, accessToken },
      "User logged in successfully"));
});

module.exports = { registerUser, loginUser };
