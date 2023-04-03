import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Get all users
// @route   GET /api/user/all
// @access  Private/Admin

const getAllUserAccount = asyncHandler(async (req, res) => {
  // pagination
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const keyword = req.query.keyword || "";
  // count documents with keyword
  const count = await User.countDocuments({
    fullname: { $regex: keyword, $options: "i" },
  });
  // get all users
  const users = await User.find({
    fullname: { $regex: keyword, $options: "i" },
  })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .select("-forgotPasswordToken -forgotPasswordExpiry")
    .lean();

    // return users
    res.json({
        success: true,
        count,
        numberOfPages: Math.ceil(count / pageSize),
        users,
    });
});

export default getAllUserAccount;
