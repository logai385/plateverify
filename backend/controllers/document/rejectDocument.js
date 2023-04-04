import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";
import { REJECTED } from "../../constant/index.js";
// @desc    Reject a document
// @route   PATCH /api/v1/document/:id/reject
// @access  Private (Manager)

const rejectDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  document.status = REJECTED;

  const updatedDocument = await document.save();
  res.json({
    success: true,
    message: `Document for ${updatedDocument.licensePlate} has been rejected!`,
  });
  //TODO: Send email to user
});


export default rejectDocument;