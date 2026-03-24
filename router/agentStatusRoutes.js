const express = require("express");
const router = express.Router();
const agentStatusController = require("../controller/agentStatusController");
const auth = require("../middleware/authMiddleware");

router.use(auth); // Protect route


router.get("/agents", agentStatusController.getAllAgents);

module.exports = router;