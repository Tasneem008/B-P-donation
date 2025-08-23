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
    const matchingDonors = await BloodDonation.find({ bloodgroup }).populate("donorUserId");

  matchingDonors.forEach(donor => {
  if (!donor.donorUserId) return; // skip if not populated

  const roomId = donor.donorUserId._id.toString(); // only the _id as string
  NotificationService.getInstance().notifyUser(
    roomId,
    "newRequest",
    {
      requestId: newbloodrequest._id,
      bloodgroup: newbloodrequest.bloodgroup,
      location: newbloodrequest.location,
      bags: newbloodrequest.bags,
      message: `New blood request for ${newbloodrequest.bloodgroup}`,
    }
  );

  console.log("Sending notification to donor room:", roomId);
});



    return res.redirect("/recipient/dashboard/history");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in creating requests");
  }
};

module.exports = { getRequestForm, postRequestForm };
