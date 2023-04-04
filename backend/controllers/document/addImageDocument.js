import asyncHandler from "express-async-handler";
import Document from "../../models/documentModel.js";
import { INPROGRESS,APPROVED } from "../../constant/index.js";

// @desc    update images to a document
// @route   PATCH /api/v1/document/:id/images
// @access  Private
const addImageDocument = asyncHandler(async (req, res) => {
  const document = await Document.findById(req.params.id);

  if (!document) {
    res.status(404);
    throw new Error("Document not found");
  }

  // update images to document
  const { image1, image2 } = req.body;
  document.images = [image1, image2];

  // check if image is empty
  if (!image1 || !image2) {
    res.status(400);
    throw new Error("Images is empty");
  }

  if(document.status === APPROVED){
    res.status(400);
    throw new Error("Document is approved");
  }
  // change status to in progress
  document.status = INPROGRESS;
  const updatedDocument = await document.save();

  if (!updatedDocument) {
    res.status(400);
    throw new Error("Update document failed");
  }
  res.json({
    success: true,
    message: `Document for ${updatedDocument.licensePlate} has been updated!`,
  });
});

export default addImageDocument ;
