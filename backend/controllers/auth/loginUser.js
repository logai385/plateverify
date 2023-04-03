import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
import { systemLogs } from "../../utils/logger.js";

// @desc    login user, get token
// @route   POST /api/v1/auth/login
// @access  public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser || !(await existingUser.comparePassword(password))) {
    res.status(401);
    systemLogs.error("incorrect email or password");
    throw new Error("Incorrect email or password");
  }

  if (!existingUser.active) {
    res.status(400);
    throw new Error(
      "You have been deactivated by the admin and login is impossible. Contact us for enquiries"
    );
  }
  // if all goes good and we send the token & cookie
  const accessToken = jwt.sign(
    { id: existingUser._id, roles: existingUser.roles },
    process.env.JWT_ACCESS_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  // create cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("token", accessToken, cookieOptions);
  res.json({
    success: true,
    fullname: existingUser.fullname,
    email: existingUser.email,
    accessToken,
  });
});

export default loginUser;
