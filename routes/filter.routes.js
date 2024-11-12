const express = require("express");
const {
  getDataByFilters,
  getDataBySearch,
} = require("../controller/filter.controller.js");

const router = express.Router();

router.route("/dataByFilter").get(getDataByFilters);
router.route("/dataBySearch").get(getDataBySearch);

module.exports = router;
