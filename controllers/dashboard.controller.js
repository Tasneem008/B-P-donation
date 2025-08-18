const User = require("../models/User");

const redirectUserToDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.role === "donor") {
    res.redirect("/donor/dashboard");
  } else if (user.role === "recipient") {
    res.redirect("/recipient/dashboard");
  } else if (user.role === "hospital") {
    res.redirect("/hospital/dashboard");
  }
};

const showDonorDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  const hospitals = await User.find({ role: "hospital" });
  res.render("donor-dashboard", { user, hospitals });
};

module.exports = { redirectUserToDashboard, showDonorDashboard };
