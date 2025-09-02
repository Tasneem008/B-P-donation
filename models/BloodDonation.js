const mongoose = require("mongoose");

const bloodDonationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    nid: { type: String, required: true },
    bloodgroup: { type: String, required: true },
    donorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lastdonation: { type: Date, default: Date.now },
    donationPlace: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "BloodDonation",
  bloodDonationSchema,
);
