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

// route: 2 filter data of type http://localhost:5000/api/admin/filtered-data?type=Laptop
router.get("/filtered-data", async (req, res) => {
  try {
    // Construct the filter object based on provided criteria
    //   const filter = {};
    //   if (name) filter.name = name;
    //   if (age) filter.age = age;

    // Query the database with the filter object
    const filteredData = await admin.find({ type: req.query.type });

    // Return the filtered data as JSON response
    res.json(filteredData);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal server error" });
  }
});


// route 3. get data by id
router.get("/laptop/:id", async (req, res) => {
  try {
    const id = req.params.id
    if (!id) {
      return res.status(404).json({ message: "id parameter is missing" })
    }

    const findLaptopById = await admin.findById(id);

    if (!findLaptopById) {
      res.status(403).json({ message: "Laptop not found" })
    }

    res.json(findLaptopById);
  } catch (error) {
    res.status(500).json({ message: `Internal server error ${error}` })
  }
})


router.get("/filtered-brand", async (req, res) => {
  try {
    // Retrieve filtering criteria from query parameters


    // Query the database with the filter object
    const filteredData = await admin.find({ brand: req.query.brand });

    // Return the filtered data as JSON response
    res.json(filteredData);
    console.log("finding brand")
    console.log(filteredData);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
