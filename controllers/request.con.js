const { default: mongoose } = require("mongoose");
const BloodRequest = require("../models/BloodRequest.js");
const User = require("../models/User.js");

const getRequestForm = (req, res) => {
  res.render("/views/donor-dashboard.ejs");
};

const postRequestForm = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { bloodgroup, phone, location, bags, description, requestedDate } =
      req.body;
    const newbloodrequest = new BloodRequest({
      bloodgroup,
      phone,
      location,
      bags,
      description,
      requestedDate,
      recipientId: userId,
    });
    await newbloodrequest.save();
    return res.redirect("/recipient/dashboard/history");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in creating requests");
  }
};

module.exports = { getRequestForm, postRequestForm };
