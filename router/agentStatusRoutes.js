const express = require("express");
const router = express.Router();
const agentStatusController = require("../controller/agentStatusController");

router.get("/agents", agentStatusController.getAllAgents);

module.exports = router;