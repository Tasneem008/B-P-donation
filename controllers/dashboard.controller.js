const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const BloodDonation = require("../models/BloodDonation");
const BloodRequest = require("../models/BloodRequest.js");
const History = require("../models/history");

const redirectUserToDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.role === "donor") {
    res.redirect("/donor/dashboard");
  } else if (user.role === "recipient") {
    res.redirect("/donor/dashboard");
  } else if (user.role === "hospital") {
    res.redirect("/admin/dashboard");
  }
};

const showDonorDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Find the latest donation record for this user
    const donation = await BloodDonation.findOne({ donorId: userId });
    const user = await User.findById(userId);

    if (!donation) {
      return res.render("donor-dashboard", { 
        user: user ? user.username : null, 
        bloodGroup: "Not provided yet", 
        daysSinceDonation: "No donations yet" ,
        matchingRequests: "No requests to show",
        userRequests: "you havent requested for blood or plasma yet"
      });
    }

    // Calculate difference between current date and last donation date
    const currentDate = new Date();
    const lastDonationDate = new Date(donation.lastDonation);

    // Difference in milliseconds
    const diffMs = currentDate - lastDonationDate;

    // Convert to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const matchingRequests = await BloodRequest.find({
      bloodgroup: donation.bloodgroup,
      location: { $in: donation.locations}
    }).populate("reqId", "username email");

    const userRequests = await BloodRequest.find({reqId: userId});
    res.render("donor-dashboard", { 
      user: user.username, 
      bloodGroup: donation.bloodgroup, 
      daysSinceDonation: diffDays,
      matchingRequests,
      userRequests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


const updateRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const sessionUserId = req.session.userId;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).send("Invalid request ID");
    }

    if (!sessionUserId) {
      return res.status(401).send("User not logged in");
    }

    const request = await BloodRequest.findOne({
      _id: requestId,
      reqId: sessionUserId
    });

    if (!request) {
      return res.status(403).send("Unauthorized or request not found");
    }

    // Only update fields that are present in req.body
    const updatableFields = ["phone", "requestedDate", "bags", "description", "location", "bloodgroup"];
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        request[field] = req.body[field];
      }
    });

    await request.save();
    res.redirect("/donor/dashboard");
  } catch (err) {
    console.error("Error updating blood request:", err);
    res.status(500).send("Server error");
  }
};

const acceptRequest = async (req, res) => {
  try {
    const donorId = req.session.userId;
    const requestId = req.params.id;

    const request = await BloodRequest.findById(requestId).populate("reqId");

    if (!request || request.status !== "pending") {
      return res.status(400).send("Invalid or already accepted request");
    }

    // Update request status
    request.status = "accepted";
    await request.save();

    // Create history record
    const historyEntry = new History({
      hisId: donorId, // optional if used
      donorId,
      reqId: request.reqId._id,
      status: "accepted"
    });

    await historyEntry.save();

    res.json({ success: true, message: "Request accepted and history saved" });
  } catch (err) {
    console.error("Error accepting request:", err);
    res.status(500).send("Server error");
  }
};

const cancelRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      reqId: req.session.userId
    });

    if (!request || request.status !== "pending") {
      return res.status(400).send("Cannot cancel this request");
    }

    request.status = "declined";
    await request.save();

    res.json({ success: true, message: "Request cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const completeRequest = async (req, res) => {
  try {
    const request = await BloodRequest.findOne({
      _id: req.params.id,
      reqId: req.session.userId
    });

    if (!request || request.status !== "accepted") {
      return res.status(400).send("Cannot complete this request");
    }

    request.status = "completed";
    await request.save();

    res.json({ success: true, message: "Request marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { redirectUserToDashboard, showDonorDashboard, updateRequest, acceptRequest, cancelRequest, completeRequest};
