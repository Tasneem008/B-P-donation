const { default: mongoose } = require("mongoose");
const BloodRequest = require("../models/BloodRequest.js");
const BloodDonation = require("../models/BloodDonation.js");
const User = require("../models/User.js");
const NotificationService = require('../services/notificationService');
const getRequestForm = (req, res) => {
  res.render("/views/donor-dashboard.ejs");
};

const postRequestForm = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { bloodgroup, phone, location, bags, description, requestedDate } = req.body;

    const newbloodrequest = new BloodRequest({
      bloodgroup,
      phone,
      location,
      bags,
      description,
      requestedDate,
      recipientId: userId,
      status: "pending",
    });

    await newbloodrequest.save();

    // 🔎 Find matching donors by blood group



    return res.redirect("/recipient/dashboard/history");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in creating requests");
  }
};

module.exports = { getRequestForm, postRequestForm };
