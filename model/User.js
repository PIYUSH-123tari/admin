const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  region_Id:{type:String,required:true},
  reward_points: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
