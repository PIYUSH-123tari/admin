const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminPickupController");

// GET pickup requests for specific admin region
router.get("/pickup-requests/:adminId", adminController.getRegionPickupRequests);

module.exports = router;