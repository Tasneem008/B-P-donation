const User = require("../models/User");
const BloodDonation = require("../models/BloodDonation");

const redirectUserToDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.role === "donor") {
    res.redirect("/donor/dashboard");
  } else if (user.role === "recipient") {
    res.redirect("/recipient/dashboard");
  } else if (user.role === "hospital") {
    res.redirect("/admin/dashboard");
  }
};

const showDonorDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Find the latest donation record for this user
    const donation = await BloodDonation.findOne({ donorId: userId });
    const user = await User.findById(req.session.userId);
    if (!donation) {
      return res.render("donor-dashboard", { user: null, bloodGroup: "Not provided yet" });
    }

    res.render("donor-dashboard", { user: user.username, bloodGroup: donation.bloodgroup });
    console.log(donation.bloodgroup)
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { redirectUserToDashboard, showDonorDashboard };
