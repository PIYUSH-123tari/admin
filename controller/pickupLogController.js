// controllers/pickupLogController.js

const PickupLog = require("../model/PickupLog");

// GET /api/admin/notifications/:adminId
const getAdminLogs = async (req, res) => {
  try {
    const { adminId } = req.params;

    // admin field is a String (e.g. "admin-north-goa"), not ObjectId
    const logs = await PickupLog.find({ admin: adminId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs); // always returns array
  } catch (err) {
    console.error("getAdminLogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/admin/notifications/unread-count/:adminId
const getUnreadCount = async (req, res) => {
  try {
    const count = await PickupLog.countDocuments({
      admin: req.params.adminId,
      read: false
    });
    res.json({ count });
  } catch (err) {
    console.error("getUnreadCount error:", err);
    res.status(500).json({ count: 0 });
  }
};

// PATCH /api/admin/notifications/mark-read/:adminId
const markAllRead = async (req, res) => {
  try {
    await PickupLog.updateMany(
      { admin: req.params.adminId, read: false },
      { read: true }
    );
    res.json({ message: "Marked all as read" });
  } catch (err) {
    console.error("markAllRead error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/notifications/clear/:adminId
const clearAllLogs = async (req, res) => {
  try {
    await PickupLog.deleteMany({ admin: req.params.adminId });
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error("clearAllLogs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/notifications/:logId
const deleteOneLog = async (req, res) => {
  try {
    await PickupLog.findByIdAndDelete(req.params.logId);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("deleteOneLog error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAdminLogs, getUnreadCount, markAllRead, clearAllLogs, deleteOneLog };