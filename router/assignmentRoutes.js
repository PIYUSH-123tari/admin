const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/assignmentController");

router.post("/create", assignmentController.createAssignment);
router.get("/pickup/:pickupId", assignmentController.getAssignmentByPickup);

module.exports = router;