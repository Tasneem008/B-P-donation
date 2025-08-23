const BloodDonation = require("../models/BloodDonation.js");

const getDonateForm = async (req, res) => {
  try {
    const donorFormDone = await BloodDonation.findOne({
      donorUserId: req.session.userId,
    });

    if (donorFormDone) {
      return res.redirect("/dashboard");
    }

    return res.render("donor-form");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in registering donation");
  }
};

const postDonateForm = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      address,
      nid,
      bloodgroup,
      donorUserId,
      lastDonation,
      donationPlace,
    } = req.body;

    const newDonation = new BloodDonation({
      name,
      age,
      phone,
      address,
      nid,
      bloodgroup,
      donorUserId,
      lastDonation,
      donationPlace,
    });

    await newDonation.save();
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in registering donation");
  }
};




module.exports = { getDonateForm, postDonateForm };
