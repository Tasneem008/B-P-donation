const BloodDonation = require("../models/BloodDonation.js");
const BloodRequest = require("../models/BloodRequest.js");

exports.getDashboard = async (req, res) => {
  try {
    const totalUnits = 120; // Placeholder, can be calculated if you have stock collection
    const donorPending =
      (await BloodDonation.countDocuments({
        status: "pending",
      })) || 0;

    const donorApproved =
      (await BloodDonation.countDocuments({
        status: "approved",
      })) || 0;

    const recipientPending =
      (await BloodRequest.countDocuments({
        status: "pending",
      })) || 0;
    const recipientAccepted = await BloodRequest.countDocuments({
      status: "accepted",
    });

    // Fetch all requests for the table
    const requests = await BloodRequest.find().sort({ createdAt: -1 });

    res.render("hospital-panel", {
      availableUnits: totalUnits,
      donorPending,
      donorApproved,
      recipientPending,
      recipientAccepted,
      requests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.requestBlood = async (req, res) => {
  try {
    const { bloodgroup, bags, requestedDate, description } = req.body;
    const newRequest = new BloodRequest({
      bloodgroup,
      bags,
      requestedDate,
      description,
      recipientId: req.session.userId,
    });
    console.log(newRequest);
    await newRequest.save();
    res.redirect("/hospital/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Approve a blood request
exports.approveRequest = async (req, res) => {
  try {
    await BloodRequest.findByIdAndUpdate(req.params.id, {
      status: "Fulfilled",
    });
    res.redirect("/hospital");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Reject a blood request
exports.rejectRequest = async (req, res) => {
  try {
    await BloodRequest.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    res.redirect("/hospital");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getDonorRequestsPage = async (req, res) => {
  try {
    const bloodDonorRequest = await BloodDonation.find({}).populate("donorId");
    console.log(bloodDonorRequest);
    res.render("donor-requests", { bloodDonorRequest });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
