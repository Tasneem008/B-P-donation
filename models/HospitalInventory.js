// models/HospitalInventory.js
const mongoose = require("mongoose");

const HospitalInventory = new mongoose.Schema(
  {
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    kind: { type: String, enum: ["blood", "plasma"], required: true },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    units: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HospitalInventory", HospitalInventory);
