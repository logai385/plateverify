import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";

// @desc    Get all documents
// @route   GET /api/v1/document/all
// @access  Private/Admin/Manager
const getAllDocument = asyncHandler(async (req, res) => {
  // pagination
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const keyword = req.query.keyword || "";

  // count documents with keyword
  const count = await Document.countDocuments();

  // get all documents
  const documents = await Document.find()
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .lean();

  res.json({
    success: true,
    count,
    numberOfPages: Math.ceil(count / pageSize),
    documents,
  });
});

export default getAllDocument;
