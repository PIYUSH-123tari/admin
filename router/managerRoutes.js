const express = require("express");
const router = express.Router();
const { loginManager} = require("../controller/managerController");

// Login route
router.post("/login", loginManager);
module.exports = router;