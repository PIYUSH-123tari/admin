const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agent_Id: {
    type: String,
    required: true,
    unique: true
  },

  agent_name: 
  {  type:String,
     required:true
  },
  agent_address:
  {  type:String,
     required:true
  },
  agent_phoneNo:
  {  type:String,
     required:true,
      unique:true
  },
  agent_email: {
    type: String,
    unique: true,
    required: true
  },

  password:
  {  type:String,
     required:true,
  },

  passport_photo:
  {  type:String,
     required:true
  },
  adhar_photo:
  {  type:String,
     required:true
  },

  status: {
    type: String,
    enum: ["available", "unavailable"],
    default: "available"
  },

  region_Id: {
    type: String,
    required: true
  },

  assigned_pending_order: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Agent", agentSchema);
