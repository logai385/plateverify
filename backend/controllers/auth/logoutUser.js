import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import jwt from "jsonwebtoken";
// @desc    logout user
// @route   GET /api/v1/auth/logout
// @access  private

const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    res.status(204);
    throw new Error("You are not logged in");
  }
  // get user id from token
  const decoded = jwt.verify(cookies.token, process.env.JWT_ACCESS_SECRET_KEY);
  const userId = decoded.id;
  //clear cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  // check if user exists
  const existingUser = await User.findOne({ _id: userId });
  if (!existingUser) {
    res.sendStatus(204);
  }
  res.status(200).json({
    success: true,
    message: `${existingUser.fullname},you have been logged out successfully`,
  });
});

export default logoutUser;
