const express = require("express");
const router = express.Router();
const admin = require("../modules/admin");
const { body, validationResult } = require("express-validator");
const multer = require("multer");

// multer is used to store images in folder using destination where you want to 
// store and can choose the filename and other properties
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })
// route 1: upload to the database /api/admin/upload-data
router.post(
  "/upload-data",
  upload.single("img"),
  [
    body("name", "must be 5 character").isLength({ min: 3 }),
    body("type", "must be 5 character").isLength({ min: 3 }),
    body("brand", "must be 2 character").isLength({ min: 2 }),
    body("desc", "must be 5 character").isLength({ min: 3 }),
    body("price", "must be 2 character").isLength({ min: 2 }),
  ],
  async (req, res) => {
    // validate if the req data is according to the rules set up
    let errors = validationResult(req);
    const { name, type, brand, desc, price } = req.body;
    const img = `${req?.file?.path}`

    try{
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const formdata = new admin({
        name,
        type,
        brand,
        desc,
        price,
        img,
      })
      const savedfomdata = await formdata.save();
      res.json(savedfomdata);
      console.log(savedfomdata)
    } catch (error) {
      console.error("Error in /upload-img route:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
