const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminController = require("../controller/adminPickupController");

router.use(auth); // Protect all admin pickup routes

// GET pickup requests for specific admin region
router.get("/pickup-requests/:adminId", adminController.getRegionPickupRequests);

module.exports = router;