const express = require("express");
const router = express.Router();
const collectedController = require("../controller/collectedController");

router.post("/create", collectedController.createCollection);
router.get("/assignment/:assignmentId", collectedController.getCollectionByAssignment);

module.exports = router;