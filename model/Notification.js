// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },

  triggeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  type: {
    type: String,
    enum: ["update", "delete"],
    required: true
  },

  message: {
    type: String,
    required: true
  },

  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PickupRequest",
    default: null
  },

  read: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);