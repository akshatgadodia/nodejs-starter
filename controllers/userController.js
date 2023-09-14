const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { sendPasswordResetEmail } = require("../utils/mail");
const {
  userRegistrationSuccessfulMessage,
  userAlreadyExistsMessage,
  userNotFoundMessage,
  incorrectPasswordMessage,
  loginSuccessfulMessage,
  invalidRefreshTokenMessage,
  accessTokenGeneratedSuccesfully,
  passwordUpdatedMessage,
  passwordResetEmailSentMessage,
  invalidTokenMessage,
  passwordResetSuccessMessage
} = require("../utils/messages.json");
const baseUrl = require("../constants/baseUrl");
const ROLES_LIST = require("../utils/rolesList")

const { generateTokens, generateAccessTokenFromRefreshToken } = require("../utils/generateTokens");

// Controller for user registration
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;  // Extract user registration data from the request body
  let user = await User.findOne({ email });  // Check if a user with the provided email already exists
  if (user) return next(new ErrorResponse(userAlreadyExistsMessage, 409));
  const passwordHash = await bcrypt.hash(password, 10);  // Hash the password and generate a verification token
  // Create a new user object
  const newUser = new User({
    name,
    email,
    password: passwordHash,
    roles: {
      USER: ROLES_LIST.USER//<YOUR_USER_ROLE_IDENTIFICATION (Can be any number or anything)>
    }
  });
  user = await newUser.save();  // Save the user to the database
  res.status(201).json({
    success: true,
    data: {
      message: userRegistrationSuccessfulMessage
    }
  });
});

// Controller for user login
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;  // Extract user login data from the request body
  try {
    const user = await User.findOne({ email });  // Check if a user with the provided email exists
    if (!user) {
      return next(new ErrorResponse(userNotFoundMessage, 404));
    }
    // Check if the provided password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new ErrorResponse(incorrectPasswordMessage, 401));
    }
    const tokens = generateTokens(user);  // Generate access and refresh tokens with customizable expiration times
    res.status(200).json({
      success: true,
      data: {
        message: loginSuccessfulMessage,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      }
    });
  } catch (err) {
    next(err);
  }
});


// Controller to generate a new access token using a refresh token
const generateAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.headers["refresh-token"];  // Extract refresh token from the request body or headers
  if (!refreshToken) {
    return next(new ErrorResponse(invalidRefreshTokenMessage, 401));
  }
  try {
    const newAccessToken = generateAccessTokenFromRefreshToken(refreshToken);
    if (!newAccessToken) {
      return next(new ErrorResponse(invalidRefreshTokenMessage, 401));
    }
    res.status(200).json({
      success: true,
      data: {
        message: accessTokenGeneratedSuccesfully,
        accessToken: newAccessToken
      }
    });
  } catch (err) {
    next(err);
  }
});

// Controller to change user password using old password
const changePassword = asyncHandler(async (req, res, next) => {
  const { userId, currentPassword, newPassword } = req.body;  // Extract user information from the request
  try {
    const user = await User.findById(userId);  // Find the user by userId
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }
    // Check if the provided current password matches the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new ErrorResponse(incorrectPasswordMessage, 401));
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);  // Hash the new password
    user.password = newPasswordHash;  // Update the user's password
    await user.save();
    res.status(200).json({
      success: true,
      data: {
        message: passwordUpdatedMessage
      }
    });
  } catch (err) {
    next(err);
  }
});

// Controller to generate a link to generate new password
const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;  // Extract user information from the request
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse(userNotFoundMessage, 404));
    }
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${baseUrl}/user/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);
    res.status(200).json({
      success: true,
      data: {
        message: passwordResetEmailSentMessage
      }
    });
  } catch (err) {
    next(err);
  }
});

// Controller to generate new password using password reset token
const resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = req.params.token;
  const { newPassword } = req.body;
  try {
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    if (!user) {
      return next(new ErrorResponse(invalidTokenMessage, 400));
    }
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      data: {
        message: passwordResetSuccessMessage
      }
    });
  } catch (err) {
    next(err);
  }
});

// Controller to soft delete a user
const softDeleteUser = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse(userNotFoundMessage, 404));
    }
    await user.softDelete(); // Call the softDelete() method
    res.status(200).json({
      success: true,
      data: {
        message: "User soft deleted successfully.",
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = { registerUser, loginUser, generateAccessToken, changePassword, forgetPassword, resetPassword, softDeleteUser }














