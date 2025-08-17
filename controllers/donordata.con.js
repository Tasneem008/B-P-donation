const { default: mongoose } = require("mongoose");
const BloodDonation = require("../models/BloodDonation.js");
const user = await User.findById(req.session.userId);

if (!user) {
  return res.status(404).send("User not found");
}

// Access session user's name & phone
const { name, phone } = user;
console.log("Session user:", name, phone);

// Now find blood donation info for that user
const donation = await BloodDonation.findOne({ name, phone });

if (!donation) {
  return res.status(404).send("Donation not found");
}

res.render("donor-dashboard", { bloodgroup: donation.bloodgroup });
module.exports = { getBloodGroup };
