import express from "express";
import upload from "../helpers/multer.js";

const router = express.Router();
const domain = process.env.DOMAIN;
router.route("/").post(
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files.image1 || !req.files.image2) {
      return res.status(400).json({ error: "Please upload both images." });
    }
    const image1Url = `${domain}/uploads/${req.files.image1[0].filename}`;
    const image2Url = `${domain}/uploads/${req.files.image2[0].filename}`;
    res.json({ image1Url, image2Url });
  }
);

export default router;
