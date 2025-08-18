const mongoose = require("mongoose");

const bloodDonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
     locations: { type: [String], required:true },
    nid: { type: String, required: true },
    bloodgroup: { type: String, required: true },
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastDonation: { type: Date, default: Date.now },
    donationPlace: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BloodDonation",
  bloodDonationSchema,
  "blooddonations"
);
