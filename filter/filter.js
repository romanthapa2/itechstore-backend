// const express = require("express");
// const router = express.Router();
// const admin = require("../modules/admin");

// router.get("/filtered-data", async (req, res) => {
//   try {
//     // Retrieve filtering criteria from query parameters
//     const { type } = req.query;


//     // Query the database with the filter object
//     const filteredData = await admin.find({ type: type });

//     // Return the filtered data as JSON response
//     res.json(filteredData);
//     console.log(filteredData);
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.get("/filtered-brand", async (req, res) => {
//   try {
//     // Retrieve filtering criteria from query parameters
//     const { brand } = req.query;
//     console.log(brand)


//     // Query the database with the filter object
//     const filteredData = await admin.find({ brand: brand });

//     // Return the filtered data as JSON response
//     res.json(filteredData);
//     console.log(filteredData);
//   } catch (error) {
//     // Handle errors
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;
