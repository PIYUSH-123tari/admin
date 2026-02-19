const express = require("express");
const router = express.Router();
const agentStatusController = require("../controller/agentStatusController");

router.get("/agents", agentStatusController.getAllAgents);
router.put("/agents/:id/status", agentStatusController.updateAgentStatus);

module.exports = router;
