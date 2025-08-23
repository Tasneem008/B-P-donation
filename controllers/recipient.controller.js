const User = require("../models/User.js");

exports.showRecipientDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  res.render("recipient-dashboard", { user });
};

exports.showRecipientHistory = (req, res) => {
  res.render("recipient-history");
};
