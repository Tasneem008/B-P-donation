const BloodDonation = require("../models/BloodDonation.js");
const BloodRequest = require("../models/BloodRequest.js");
const User = require("../models/User.js");

const getDonateForm = (req, res) => {
  res.render("donor-dashboard");
};



const postDonateForm = async (req, res) => {
  try {
    const { name, age, phone, address, nid, bloodgroup, donorId, lastDonation, donationPlace } =
      req.body;


    const newDonation = new BloodDonation({
      name,
      age,
      phone,
      address,
      nid,
      bloodgroup,
      donorId,
      lastDonation,
      donationPlace
    });

    await newDonation.save();
    res.send("Blood donation registered successfully!");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error in registering donation");
  }
};

module.exports = { getDonateForm, postDonateForm};
