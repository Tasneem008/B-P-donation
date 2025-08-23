const BloodDonation = require("../models/BloodDonation");
const BloodRequest = require("../models/BloodRequest.js");
const Hospital = require("../models/Hospital.js");
const User = require("../models/User.js");

const redirectUserToDashboard = async (req, res) => {
  if (req.session.role === "donor") {
    res.redirect("/donor/dashboard/home");
  } else if (req.session.role === "recipient") {
    res.redirect("/recipient/dashboard/home");
  } else if (req.session.role === "hospital") {
    res.redirect("/hospital/dashboard/home");
  }
};

// Donor Controllers for dashboard
const showDonorDashboardHome = async (req, res) => {
  try {
    const userId = req.session.userId;

    // Find the latest donation record for this user
    const userDonor = await BloodDonation.findOne({
      donorUserId: userId,
    }).populate("donorUserId");

    return res.render("donor-dashboard", {
      userDonor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const showDonorDashboardEditDetails = async (req, res) => {
  try {
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

    const donor = await BloodDonation.findOne({
      donorUserId: req.session.userId,
    });

    if (!donor) {
      return res.status(404).send("Donor record not found");
    }

    donor.name = name || donor.name;
    donor.age = age || donor.age;
    donor.phone = phone || donor.phone;
    donor.address = address || donor.address;
    donor.nid = nid || donor.nid;
    donor.bloodgroup = bloodgroup || donor.bloodgroup;
    donor.lastdonation = lastdonation || donor.lastdonation;
    donor.donationPlace = donationPlace || donor.donationPlace;

    await donor.save();

    return res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error updating donor data");
  }
};

const getDonorNotifications = async (req, res) => {
  try {
    const userDonor = await BloodDonation.findOne({
      donorUserId: req.session.userId,
    });

    const bloodRequests = await BloodRequest.find({
      status: "pending",
      bloodgroup: userDonor.bloodgroup,
    })
      .populate("recipientId")
      .populate("location");

    // Render the donor notifications page with the blood requests
    return res.render("donor-notifications", { bloodRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching blood requests");
  }
};

const getDonateForm = async (req, res) => {
  try {
    const donorFormDone = await BloodDonation.find({
      donorUserId: req.session.userId,
    });

    if (donorFormDone) {
      return res.redirect("/dashboard");
    }

    return res.render("donor-form");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in registering donation");
  }
};

const postDonateForm = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      address,
      nid,
      bloodgroup,
      donorUserId,
      lastDonation,
      donationPlace,
    } = req.body;

    const newDonation = new BloodDonation({
      name,
      age,
      phone,
      address,
      nid,
      bloodgroup,
      donorUserId,
      lastDonation,
      donationPlace,
    });

    await newDonation.save();
    return res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error in registering donation");
  }
};

// Recipient Dashboard Code
const showRecipientDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  const hospitals = await Hospital.find({});
  return res.render("recipient-dashboard", { user, hospitals });
};

const getRecipientHistory = async (req, res) => {
  try {
    // Fetch all blood requests for the logged-in recipient
    const bloodRequests = await BloodRequest.find({
      recipientId: req.session.userId,
    }).populate("location");

    // Pass the data to the dashboard's history page
    return res.render("recipient-history", { bloodRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching blood requests");
  }
};

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

const acceptBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted", acceptedBy: req.session.userId },
      { new: true }
    );

    if (!request) {
      return res.status(404).send("Blood request not found");
    }

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
    })
      .populate("recipientId")
      .populate("location");

    console.log(donationHistory);

    if (!donationHistory) {
      return res.status(404).send("Blood Donation not found");
    }

    return res.render("donor-history", { donationHistory });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error accepting blood request");
  }
};

// Hospital Dashboard Code.
const getHospitalDashboardHome = async (req, res) => {
  try {
 
    const donorPending =
      (await BloodRequest.countDocuments({
        status: "accepted",
        location: req.session.userId 
      })) || 0;

    const donorApproved =
      (await BloodRequest.countDocuments({
        status: "approved",
      })) || 0;

    const recipientPending =
      (await BloodRequest.countDocuments({
        status: "pending",
      })) || 0;
    const recipientAccepted = await BloodRequest.countDocuments({
      status: "accepted",
    });

    const totalBlood = await Hospital.aggregate([
      {
        $project: {
          totalBlood: {
            $sum: [
              "$inventory.blood.A+",
              "$inventory.blood.A-",
              "$inventory.blood.B+",
              "$inventory.blood.B-",
              "$inventory.blood.AB+",
              "$inventory.blood.AB-",
              "$inventory.blood.O+",
              "$inventory.blood.O-",
            ],
          },
        },
      },
    ]);

    // Fetch all requests for the table
    const requests = await BloodRequest.find().sort({ createdAt: -1 });

    return res.render("hospital-panel", {
      donorPending,
      donorApproved,
      recipientPending,
      recipientAccepted,
      requests,
      totalBlood: totalBlood[0].totalBlood,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const requestBlood = async (req, res) => {
  try {
    const { bloodgroup, bags, requestedDate, description } = req.body;
    const newRequest = new BloodRequest({
      bloodgroup,
      bags,
      requestedDate,
      description,
      location: req.session.userId,
    });
    await newRequest.save();
    return res.redirect("/hospital/dashboard/home");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

// Approve a blood request
const approveRequest = async (req, res) => {
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
const rejectRequest = async (req, res) => {
  try {
    await BloodRequest.findByIdAndUpdate(req.params.id, { status: "Rejected" });
    res.redirect("/hospital");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const getDonorRequestsPage = async (req, res) => {
  try {
    const bloodDonorRequest = await BloodDonation.find({}).populate("donorId");
    res.render("donor-requests", { bloodDonorRequest });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  redirectUserToDashboard,
  showDonorDashboardHome,
  showDonorDashboardEditDetails,
  postUpdateDonation,
  getRecipientHistory,
  getDonorNotifications,
  acceptBloodRequest,
  getBloodDonationHistory,
  getHospitalDashboardHome,
  approveRequest,
  rejectRequest,
  getDonorRequestsPage,
  requestBlood,
  postRequestForm,
  getRequestForm,
  showRecipientDashboard,
  getDonateForm,
  postDonateForm,
};
