import asyncHandler from 'express-async-handler';
import User from '../../models/userModel.js';

const {randomBytes} = await import('crypto');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
    const {email, password, passwordConfirm, fullname, taxCode} = req.body;
    // check all fields are filled
    if (!email || !password || !passwordConfirm || !fullname || !taxCode) {
        res.status(400);
        throw new Error('Please fill all the fields');
    }
    // check user already exists
    const userExists = await User.findOne({email});
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    // create new user
    const user = new User({
        email, password, passwordConfirm, fullname, taxCode
    })

    // save user to database
    const createdUser = await user.save();
    // check if user was created
    if (!createdUser) {
        res.status(400);
        throw new Error('User could not be created');
    }else{        
        res.json({
            success: true,
            message: `A new user ${createdUser.fullname} has been registered!. please login to continue`
          })
    }
});
export default registerUser;