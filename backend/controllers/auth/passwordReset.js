import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
const domainURL = process.env.DOMAIN;

// @desc    send password reset link
// @route   POST /api/v1/auth/forgotpassword
// @access  public

const resetPasswordRequest = asyncHandler(async (req, res) => {
  // get user email
  const { email } = req.body;
  // check if email exists
  if (!email) {
    res.status(400);
    throw new Error("Please provide your email");
  }
  // check if user exists
  const existingUser = await User.findOne({ email }).select("+passwordConfirm");

  if (!existingUser) {
    res.status(404);
    throw new Error("User with this email does not exist");
  }

  // create reset token
  const resetToken = await existingUser.getForgotPasswordToken();
 // save user fields in DB
 await existingUser.save({ validateBeforeSave: false });
  // send email
  const emailLink = `${domainURL}/auth/resetpassword?resetToken=${resetToken}`;
  const payload = {
    email: existingUser.email,
    link: emailLink,
  };

  await sendEmail(
    existingUser.email,
    "Password Reset Request",
    payload,
    "./emails/template/requestResetPassword.handlebars"
  );

  res.status(200).json({
    success: true,
    message: `Hey ${existingUser.fullname}, an email has been sent to your account with the password reset link`,
  });
});

// @desc    reset user password
// @route   POST /api/v1/auth/resetpassword/:resetToken
// @access  public

const resetPassword = asyncHandler(async (req, res) => {
  // get password, passwordConfirm, resetToken
  const { password, passwordConfirm, resetToken } = req.body;
  // check if password and passwordConfirm are provided
  if (!password || !passwordConfirm) {
    res.status(400);
    throw new Error("Please provide password and passwordConfirm");
  }
  // check if password and passwordConfirm match
  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("Password and passwordConfirm do not match");
  }


  // hash the token as db also stores the hashed version
  const encryToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // find user based on hased on token and time in future
  const user = await User.findOne({
    forgotPasswordToken: encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  }).select("-passwordConfirm");

  if (!user) {
    res.status(400);
    throw new Error(
      "Token is invalid or expired"
    );    
  }

  // update password field in DB
  user.password = password;

  // reset token fields
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  // save the user
  await user.save();

  const payload = {
    name: user.fullname,
  };

  await sendEmail(
    user.email,
    "Password Reset Success",
    payload,
    "./emails/template/resetPassword.handlebars"
  );

  res.json({
    success: true,
    message: `Hey ${user.fullname},Your password reset was successful. An email has been sent to confirm the same`,
  });
});

export { resetPasswordRequest, resetPassword };