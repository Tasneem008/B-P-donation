const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    contactNo: { type: String, required: true },
    inventory: {
      blood: { type: Number, default: 0 }, // Amount of blood in inventory (in units or bags)
      plasma: { type: Number, default: 0 }, // Amount of plasma in inventory (in liters or bags)
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Hospital", hospitalSchema);
