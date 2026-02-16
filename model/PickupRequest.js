 const mongoose = require("mongoose");
 const { v4: uuidv4 } = require("uuid");

const pickupRequestSchema = new mongoose.Schema({

pickupRequest_id:{
type: String,
unique: true,
required: true,
 default: () => uuidv4() 
}
,
userId: {
type: String,
required: true
},

region_Id:{
type:String,
required:true
},

phone: {
    type: String,
    required: true
  },

waste_type: String,
estimated_weight: Number,
pickup_address: String,
preferred_date: Date,

image: {
type: String   // e.g. "waste_123.png" or "/uploads/waste_123.jpg"
},

status: {
type: String,
enum: ["pending", "assigned", "collected", "recycled"],
default: "pending"
}
}, { timestamps: true });

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);  