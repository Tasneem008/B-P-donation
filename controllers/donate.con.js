const { default: mongoose } = require("mongoose");
const BloodDonation = require("../models/BloodDonation.js");
const User = require("../models/User");

const getDonateForm = (req, res) => {
    res.render("donor-dashboard");
}

const postDonateForm = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name, age, phone, address, nid, bloodgroup, locations, lastDonation } = req.body;

        const newDonation = new BloodDonation({
            donorId: userId,
            name,
            age,
            phone,
            address,
            nid,
            bloodgroup,
            locations,
            lastDonation
        });
        await newDonation.save();
        res.send("Blood donation registered successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in registering donation");
    }
};

module.exports = { getDonateForm, postDonateForm };
