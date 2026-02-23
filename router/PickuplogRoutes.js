// routes/pickupLogRoutes.js

const express = require("express");
const router  = express.Router();
const {
  getAdminLogs,
  getUnreadCount,
  markAllRead,
  clearAllLogs,
  deleteOneLog,
} = require("../controller/pickupLogController");

router.get("/unread-count/:adminId", getUnreadCount);  // ← must be BEFORE /:adminId
router.get("/:adminId",              getAdminLogs);
router.patch("/mark-read/:adminId",  markAllRead);
router.delete("/clear/:adminId",     clearAllLogs);
router.delete("/:logId",             deleteOneLog);

module.exports = router;