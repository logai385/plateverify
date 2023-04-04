import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";

// @desc    Create new document
// @route   POST /api/document
// @access  Private/Manager/Admin

const createDocument = asyncHandler(async (req, res) => {
  // get fields from request body
  const {
    licensePlate,
    serial,
    receiptNumber,
    issueDate,
    expỉreDate,
    taxCode,
    receiveDate,
    returnDate,
  } = req.body;
  // Create new document
  const document = new Document({
    licensePlate,
    serial,
    receiptNumber,
    issueDate,
    expỉreDate,
    taxCode,
    receiveDate,
    returnDate,
    createdBy: req.user._id,
  });
  const createdDocument = await document.save();
  if (!createDocument) {
    res.status(400);
    throw new Error("Create document failed");
  }
  res.json({
    success: true,
    message: `A new document ${createdDocument.licensePlate} has been created!`,
  });
  //TODO: Send email to user
});

export default createDocument;
