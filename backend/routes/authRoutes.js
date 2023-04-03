import express from "express";
import {loginLimiter} from "../middleware/apiLimiter.js"
import registerUser  from "../controllers/auth/registerUser.js";
import loginUser from "../controllers/auth/loginUser.js";
import logoutUser from "../controllers/auth/logoutUser.js";
import {resetPasswordRequest, resetPassword} from "../controllers/auth/passwordReset.js";

// create express router
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginLimiter, loginUser);
router.get("/logout", logoutUser);
router.post("/forgotpassword", resetPasswordRequest);
router.post("/resetpassword", resetPassword);



export default router;