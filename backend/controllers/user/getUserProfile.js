import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js'

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private


const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // get user profile by lean
    const userProfile = await User.findById(userId,{
        roles: 0,
        _id: 0,
        forgotPasswordExpiry: 0,
        forgotPasswordToken: 0,
    }).lean();

    // check if user profile exists
    if (!userProfile) {
        res.status(204);
        throw new Error('User not found');
    }

    res.status(200).json({
        success: true,
        userProfile,
    });
});

export default getUserProfile