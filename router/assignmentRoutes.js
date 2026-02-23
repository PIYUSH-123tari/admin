const express = require("express");
const router = express.Router();
const assignmentController = require("../controller/assignmentController");

router.post("/create", assignmentController.createAssignment);
router.get("/pickup/:pickupId", assignmentController.getAssignmentByPickup);


// NEW: delete assignment by assignment _id (called from admin viewAssignment page)
router.delete("/delete/:assignmentId", assignmentController.deleteAssignment);

// NEW: delete assignment by pickup _id (called from Ecoloop when user deletes pickup)
router.delete("/delete-by-pickup/:pickupId", assignmentController.deleteAssignmentByPickup);

module.exports = router;