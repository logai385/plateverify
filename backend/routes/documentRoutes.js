import express from "express";
import checkAuth from "../middleware/checkAuthMiddleware.js";
import role from "../middleware/roleMiddleware.js";
import createDocument from "../controllers/document/createDocument.js";
import getAllDocument from "../controllers/document/getAllDocument.js";
import getAllUserDocument from "../controllers/document/getAllUserDocument.js";
import approveDocument from "../controllers/document/approveDocument.js";
import rejectDocument from "../controllers/document/rejectDocument.js";
import addImageDocument from "../controllers/document/addImageDocument.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, getAllUserDocument)
  .post(checkAuth, role.checkRole(role.ROLES.Manager), createDocument);
//:id/images
router
  .route("/all")
  .get(checkAuth, role.checkRole(role.ROLES.Manager), getAllDocument);

router
  .route("/:id/approve")
  .get(checkAuth, role.checkRole(role.ROLES.Manager), approveDocument);

router
  .route("/:id/reject")
  .get(checkAuth, role.checkRole(role.ROLES.Manager), rejectDocument);

router
  .route("/:id/images")
  .patch(checkAuth, addImageDocument);

export default router;
