const express = require("express");
const router = express.Router();
const upload = require("../middleware/agentUpload");
const { createAgent, getAllAgents, updateAgent } = require("../controller/agentController");

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
