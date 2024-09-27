const express = require("express");
const {
  getDataByFilters,
  getDataById,
  getDataBySearch,
} = require("../controller/filter.controller.js");

const router = express.Router();

router.route("/dataByFilter").get(getDataByFilters);
router.route("/dataById/:id").get(getDataById);
router.route("/dataBySearch").get(getDataBySearch);

module.exports = router;
