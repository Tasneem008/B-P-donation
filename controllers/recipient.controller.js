const User = require("../models/User.js");

exports.showRecipientDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("recipient-dashboard", { user });
};

exports.showRecipientHistory = (req, res) => {
  res.render("recipient-history");
};

// exports.submitRequest = async (req, res) => {
//   const { bloodType, hospital, location, description, requestedDate } = req.body;

//   await BloodRequest.create({
//     bloodType,
//     recipientId: req.session.userId,
//     hospital,
//     location,
//     description,
//     requestedDate
//   });

//   res.send('Request submitted successfully!');
// };
