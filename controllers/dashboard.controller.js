const { default: mongoose } = require("mongoose");
const User = require("../models/User");
const BloodDonation = require("../models/BloodDonation");
const BloodRequest = require("../models/BloodRequest.js");
const History = require("../models/history");

const redirectUserToDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.role === "donor") {
    res.redirect("/donor/dashboard/home");
  } else if (user.role === "recipient") {
    res.redirect("/recipient/dashboard/home");
  } else if (user.role === "hospital") {
    res.redirect("/hospital/dashboard/home");
  }
};

const showDonorDashboardHome = async (req, res) => {
  try {
    // const hospitals = await User.find({ role: "hospital" });
    const userId = req.session.userId;

    // Find the latest donation record for this user
    const userDonor = await BloodDonation.findOne({
      donorUserId: userId,
    }).populate("donorUserId");
    // const user = await User.findById(userId);

    // if (!donation) {
    //   return res.render("donor-dashboard", {
    //     user: user,
    //     bloodGroup: "Not provided yet",
    //     daysSinceDonation: "No donations yet" ,
    //     matchingRequests: [],
    //     userRequests: [],
    //     hospitals,

    //   });
    // }

    // Calculate difference between current date and last donation date
    // const currentDate = new Date();
    // const lastDonationDate = new Date(donation.lastDonation);

    // Difference in milliseconds
    // const diffMs = currentDate - lastDonationDate;

    // Convert to days
    // const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    // const matchingRequests = await BloodRequest.find({
    //   bloodgroup: donation.bloodgroup,
    //   location: { $in: donation.locations}
    // }).populate("reqId", "username email");

    // const userRequests = await BloodRequest.find({reqId: userId});

    return res.render("donor-dashboard", {
      // user: user,
      // bloodGroup: donation.bloodgroup,
      // daysSinceDonation: diffDays,
      // matchingRequests,
      // userRequests,
      // hospitals
      userDonor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const showDonorDashboardEditDetails = async (req, res) => {
  try {
    // const hospitals = await User.find({ role: "hospital" });
    const userId = req.session.userId;

    // Find the latest donation record for this user
    const userDonor = await BloodDonation.findOne({
      donorUserId: userId,
    }).populate("donorUserId");

    return res.render("edit-donor-details", {
      userDonor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const postUpdateDonation = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      address,
      nid,
      bloodgroup,
      lastdonation,
      donationPlace,
    } = req.body;

    // Find the existing blood donation record using the donor's user ID
    const donor = await BloodDonation.findOne({
      donorUserId: req.session.userId, // Assuming the donor's session has a user ID
    });

    if (!donor) {
      return res.status(404).send("Donor record not found");
    }

    // Update the donor's information
    donor.name = name || donor.name;
    donor.age = age || donor.age;
    donor.phone = phone || donor.phone;
    donor.address = address || donor.address;
    donor.nid = nid || donor.nid;
    donor.bloodgroup = bloodgroup || donor.bloodgroup;
    donor.lastdonation = lastdonation || donor.lastdonation;
    donor.donationPlace = donationPlace || donor.donationPlace;

    // Save the updated donor information to the database
    await donor.save();

    // Redirect the user to the dashboard after successful update
    return res.redirect("/dashboard"); // Or any other page you'd like to redirect to
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error updating donor data");
  }
};

const getRecipientHistory = async (req, res) => {
  try {
    // Fetch all blood requests for the logged-in recipient
    const bloodRequests = await BloodRequest.find({
      recipientId: req.session.userId,
    });

    // Pass the data to the dashboard's history page
    return res.render("recipient-history", { bloodRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching blood requests");
  }
};

// const updateRequest = async (req, res) => {
//   try {
//     const requestId = req.params.id;
//     const sessionUserId = req.session.userId;

//     if (!mongoose.Types.ObjectId.isValid(requestId)) {
//       return res.status(400).send("Invalid request ID");
//     }

//     if (!sessionUserId) {
//       return res.status(401).send("User not logged in");
//     }

//     const request = await BloodRequest.findOne({
//       _id: requestId,
//       reqId: sessionUserId,
//     });

//     if (!request) {
//       return res.status(403).send("Unauthorized or request not found");
//     }

//     // Only update fields that are present in req.body
//     const updatableFields = [
//       "phone",
//       "requestedDate",
//       "bags",
//       "description",
//       "location",
//       "bloodgroup",
//     ];
//     updatableFields.forEach((field) => {
//       if (req.body[field] !== undefined && req.body[field] !== "") {
//         request[field] = req.body[field];
//       }
//     });

//     await request.save();
//     res.redirect("/donor/dashboard");
//   } catch (err) {
//     console.error("Error updating blood request:", err);
//     res.status(500).send("Server error");
//   }
// };

const getDonorNotifications = async (req, res) => {
  try {
    const userDonor = await BloodDonation.findOne({
      donorUserId: req.session.userId,
    });
    // Fetch blood requests where donor is either 'requested' or waiting for acceptance
    const bloodRequests = await BloodRequest.find({
      status: "pending", // Only show pending requests
      bloodgroup: userDonor.bloodgroup,
    }).populate("recipientId"); // Assuming the recipient's phone number is in the 'recipientId'

    // Render the donor notifications page with the blood requests
    return res.render("donor-notifications", { bloodRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching blood requests");
  }
};

const acceptBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    // Find the blood request by ID and update its status to 'Accepted'
    const request = await BloodRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted", acceptedBy: req.session.userId }, // Update the status to "Fulfilled" (or "Accepted")
      { new: true }
    );

    if (!request) {
      return res.status(404).send("Blood request not found");
    }

    // You can add additional logic here to notify the hospital and recipient

    // Redirect the donor to the dashboard or another page
    return res.redirect("/donor/dashboard/notifications");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error accepting blood request");
  }
};

const getBloodDonationHistory = async (req, res) => {
  try {
    // Find the blood request by ID and update its status to 'Accepted'
    const donationHistory = await BloodRequest.find({
      acceptedBy: req.session.userId,
    }).populate('recipientId')

    console.log(donationHistory);

    if (!donationHistory) {
      return res.status(404).send("Blood Donation not found");
    }

    // You can add additional logic here to notify the hospital and recipient

    // Redirect the donor to the dashboard or another page
    return res.render("donor-history", { donationHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error accepting blood request");
  }
};

// const acceptRequest = async (req, res) => {
//   try {
//     const donorId = req.session.userId;
//     const requestId = req.params.id;

//     const request = await BloodRequest.findById(requestId).populate("reqId");

//     if (!request || request.status !== "pending") {
//       return res.status(400).send("Invalid or already accepted request");
//     }

//     // Update request status
//     request.status = "accepted";
//     await request.save();

//     // Create history record
//     const historyEntry = new History({
//       hisId: donorId, // optional if used
//       donorId,
//       reqId: request.reqId._id,
//       status: "accepted",
//     });

//     await historyEntry.save();

//     res.json({ success: true, message: "Request accepted and history saved" });
//   } catch (err) {
//     console.error("Error accepting request:", err);
//     res.status(500).send("Server error");
//   }
// };

module.exports = {
  redirectUserToDashboard,
  showDonorDashboardHome,
  showDonorDashboardEditDetails,
  // updateRequest,
  // acceptRequest,
  postUpdateDonation,
  getRecipientHistory,
  getDonorNotifications,
  acceptBloodRequest,
  getBloodDonationHistory,
};
