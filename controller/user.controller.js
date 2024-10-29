const ApiError = require("../utils/apiError.utils.js");
const ApiResponse = require("../utils/apiResponse.utils.js");
const asyncHandler = require("../utils/asyncHandler.utils");
const User = require("../models/user.model.js");
const apiError = require("../utils/apiError.utils.js");

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
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: createdUser, accessToken },
        "User registered Successfully"
      )
    );
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
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        "User logged in Successfully"
      )
    );
});

const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("accessToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json(new ApiResponse(200, "Logged Out"));
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError(404, "User not found"));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n 
  If you have not requested this email then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, error.message));
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ApiError(400, "Reset Password Token is invalid or has been expired")
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ApiError(400, "Password does not match"));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({ validateBeforeSave: false });

  const accessToken = await user.generateAccessToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken },
        "User logged in Successfully after resetting password"
      )
    );
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ApiError("Old password is Incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ApiError("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Updated Password Successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  resetPassword,
  forgotPassword,
  updatePassword
};
