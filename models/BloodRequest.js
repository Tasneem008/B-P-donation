const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  bloodgroup: { type: String, required: true },
  phone: { type: String },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: String,
  bags: Number,
  description: String,
  requestedDate: { type: Date, default: Date.now },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User",},
  status: {
    type: String,
    enum: ["pending", "accepted", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BloodRequest", bloodRequestSchema);
