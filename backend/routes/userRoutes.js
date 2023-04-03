import express from "express";
import role from "../middleware/roleMiddleware.js";
import getUserProfile from "../controllers/user/getUserProfile.js";
import checkAuth from "../middleware/checkAuthMiddleware.js";
import updateUserProfile from "../controllers/user/updateUserProfile.js";
import getAllUserAccount from "../controllers/user/getAllUserAccount.js";
import deactivateUser from "../controllers/user/deactivateUser.js";
import deleteUserAccount from "../controllers/user/deleteUserAccount.js";

const router = express.Router();

router
  .route("/profile")
  .get(checkAuth, getUserProfile)
  .patch(checkAuth, updateUserProfile);

router
  .route("/all")
  .get(checkAuth, role.checkRole(role.ROLES.Admin), getAllUserAccount);

router
  .route("/:id/deactivate")
  .patch(checkAuth, role.checkRole(role.ROLES.Admin), deactivateUser);

router
  .route("/:id")
  .delete(checkAuth, role.checkRole(role.ROLES.Admin), deleteUserAccount);

export default router;
