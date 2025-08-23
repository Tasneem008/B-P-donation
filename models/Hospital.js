const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: [
        "Popular Hospital Bangladesh",
        "Labaid Specialized Hospital Bangladesh",
        "National Heart Foundation Bangladesh",
      ],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    role: { type: String, default: "hospital" },
    inventory: {
      blood: {
        "A+": { type: Number, default: 0 },
        "A-": { type: Number, default: 0 },
        "B+": { type: Number, default: 0 },
        "B-": { type: Number, default: 0 },
        "AB+": { type: Number, default: 0 },
        "AB-": { type: Number, default: 0 },
        "O+": { type: Number, default: 0 },
        "O-": { type: Number, default: 0 },
      }, // Amount of blood in inventory (in units or bags)
      plasma: { type: Number, default: 0 }, // Amount of plasma in inventory (in liters or bags)
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Hospital", hospitalSchema);
