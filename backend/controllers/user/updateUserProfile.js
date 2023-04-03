import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private

const updateUserProfile = asyncHandler(async (req, res) => {
  // get fields from request body
  const { email, password, passwordConfirm, isActive } = req.body;
  // get user id from request
  const userId = req.user._id;

  if (password || passwordConfirm || isActive || email) {
    res.status(400);
    throw new Error("You can not update this fields in this route");
  }

  //   check if user exists
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  //   fields to update
  const fieldsToUpdate = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...fieldsToUpdate },
    {
      new: true,
      runValidators: true,
    }
  ).select("-forgotPasswordToken -forgotPasswordExpiry -_id -roles");

  res.status(200).json({
    success: true,
    message: `User ${updatedUser.fullname} updated successfully`,
    updatedUser,
  });
});

export default updateUserProfile;
