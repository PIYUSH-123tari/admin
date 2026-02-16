const express = require("express");
const router = express.Router();
const upload = require("../middleware/agentUpload");
const { createAgent } = require("../controller/agentController");

router.post(
  "/create",
  upload.fields([
    { name: "passport_photo", maxCount: 1 },
    { name: "adhar_photo", maxCount: 1 }
  ]),
  createAgent
);

module.exports = router;
