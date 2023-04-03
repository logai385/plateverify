import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";

// @desc    Delete user account
// @route   DELETE /api/v1/user/:id 
// @access  Private/Admin

const deleteUserAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        const deletedUser = await user.remove();
        res.json({
            success: true,
            message:`User ${deletedUser.fullname} has been deleted`,
        }r);
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }
});

export default deleteUserAccount;