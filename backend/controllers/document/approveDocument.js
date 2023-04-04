import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";
import { APPROVED } from "../../constant/index.js";

// @desc    Approve a document
// @route   PATCH /api/v1/document/:id/approve
// @access  Private (Manager)


const approveDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
        res.status(404);
        throw new Error("Document not found");
    }
    
    document.status = APPROVED;
    
    const updatedDocument = await document.save();
    res.json({
        success: true,
        message: `Document for ${updatedDocument.licensePlate} has been approved!`,
    });
});

export default approveDocument;