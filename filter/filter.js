const express = require("express");
const router = express.Router();
const admin = require("../modules/admin");

// route: 1 filter data of type http://localhost:5000/api/admin/filtered-data?type=Laptop
router.get("/filter", async (req, res) => {
    try {
  
      // Query the database with the filter object
      const filteredData = await admin.find({ type: req.query.type });
  
      // Return the filtered data as JSON response
      res.json(filteredData);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: "Internal server error" });
    }
  });



  // route: 3
router.get("/brand", async (req, res) => {
    try {
      // Retrieve filtering criteria from query parameters
  
  
      // Query the database with the filter object
      const filteredData = await admin.find({ brand: req.query.brand });
  
      // Return the filtered data as JSON response
      res.json(filteredData);
    } catch (error) {
      // Handle errors
      res.status(500).json({ error: "Internal server error" });
    }
  });


  // route 4. get data by id
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
  
  

module.exports = router;
