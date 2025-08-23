const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["donor", "recipient", "hospital"],
      required: true,
    },
    // bloodGroup: {
    //   type: String,
    //   enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    //   default: "B+",
    // },
    location: String,
    lastDonationDate: Date,

    // emailVerified: { type: Boolean, default: false },
    // emailVerifyTokenHash: String,
    // emailVerifyTokenExpires: Date,

    // resetPasswordTokenHash: String,
    // resetPasswordTokenExpires: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
