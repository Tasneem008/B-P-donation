const { default: mongoose } = require("mongoose");
const BloodDonation = require("../models/BloodDonation.js");

const getDonateForm = (req, res) => {
    res.render("donor-dashboard");
}

const postDonateForm = async (req, res) => {
    try {
        const { name, age, phone, address, nid, bloodgroup, lastDonation } = req.body;

        const newDonation = new BloodDonation({
            name,
            age,
            phone,
            address,
            nid,
            bloodgroup,
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
