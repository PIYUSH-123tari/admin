const express = require("express");
const router = express.Router();
const {getAllAgentsByRegionId, createAgent, updateAgent, deleteAgent, getAgentDetails, getAllAgents} = require("../controller/agentController");
const upload = require("../middleware/agentUpload");
const auth = require("../middleware/authMiddleware");

router.use(auth); // Protect all agent routes

router.get("/all", getAllAgents);

router.post(
  "/create",
  upload.fields([
    { name: "passport_photo", maxCount: 1 },
    { name: "adhar_photo", maxCount: 1 }
  ]),
  createAgent
);
router.put(
  "/update/:id",
  upload.fields([
    { name: "passport_photo", maxCount: 1 },
    { name: "adhar_photo", maxCount: 1 }
  ]),
  updateAgent
);
module.exports = router;
