const express = require("express");
const {
  getDataByBrand,
  getDataByType,
  getDataById,
} = require("../controller/filter.controller.js");

const router = express.Router();

router.route("/dataByBrand").get(getDataByBrand);
router.route("/dataByType").get(getDataByType);
router.route("/dataById/:id").get(getDataById);

module.exports = router;
