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
    const {
      bloodgroup,
      phone,
      location,
      bags,
      description,
      requestedDate
    } = req.body;

    // 1. Save new request
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

    // 2. Find & notify matching donors
    const matchingDonors = await BloodDonation
      .find({ bloodgroup })
      .populate("donorUserId");

    matchingDonors.forEach(donor => {
      if (!donor.donorUserId) return;
      const roomId = donor.donorUserId._id.toString();
      NotificationService
        .getInstance()
        .notifyUser(
          roomId,
          "newRequest",
          {
            requestId: newbloodrequest._id,
            bloodgroup: newbloodrequest.bloodgroup,
            location: newbloodrequest.location,
            bags: newbloodrequest.bags,
            message: `New blood request for ${newbloodrequest.bloodgroup}`
          }
        );
      console.log("Sending notification to donor room:", roomId);
    });

    // 3. Redirect with match count as query-param
    const matchCount = matchingDonors.length;
    return res.redirect(
      //`../views/recipient-history?matches=${matchCount}`
      `/recipient/dashboard/history?matches=${matchCount}`
    );

  } catch (error) {
    console.error(error);
    return res.status(500).send("Error in creating requests");
  }
};

module.exports = { getRequestForm, postRequestForm };
