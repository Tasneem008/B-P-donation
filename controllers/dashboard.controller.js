const { default: mongoose } = require("mongoose");
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
    const donorFormDone = await BloodDonation.findOne({
      donorUserId: req.session.userId,
    });

    if (donorFormDone) {
      return res.redirect("/dashboard");
    }

    return res.render("donor-form");
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return res.status(500).send("Error in registering donation");
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

const acceptBloodRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted", acceptedByDonor: req.session.userId },
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

// Recipient Dashboard Code
const showRecipientDashboard = async (req, res) => {
  const user = await User.findById(req.session.userId);
  const hospitals = await Hospital.find({});
  return res.render("recipient-dashboard", { user, hospitals });
};

const getRecipientHistory = async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find({
      recipientId: req.session.userId,
    }).populate("location");

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
    console.error(error);
    return res.status(500).send("Error in creating requests");
  }
};

const getBloodDonationHistory = async (req, res) => {
  try {
    // Find the blood request by ID and update its status to 'Accepted'
    const donationHistory = await BloodRequest.find({
      acceptedByDonor: req.session.userId,
    })
      .populate("recipientId")
      .populate("location");

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
        location: req.session.userId,
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

    const hospital = await Hospital.findById(req.session.userId);

    const donorHospitalAppointment = await BloodRequest.find({
      location: req.session.userId,
      // $or: [{ status: "accepted" }, { status: "completed" }],
      recipientId: { $exists: false },
      acceptedByDonor: { $exists: true },
    })
      .populate("acceptedByDonor")
      .populate("acceptedByHospital");

    const totalBlood = await Hospital.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.session.userId) }, // Match the hospital by its ID
      },
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

    return res.render("hospital-panel", {
      donorPending,
      donorApproved,
      recipientPending,
      recipientAccepted,
      hospital,
      totalBlood: totalBlood[0].totalBlood,
      donorHospitalAppointment,
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

const completeDonation = async (req, res) => {
  try {
    const bloodRequest = await BloodRequest.findByIdAndUpdate(
      req.params.requestId,
      {
        status: "completed",
      },
      { new: true }
    );

    await Hospital.findByIdAndUpdate(
      req.session.userId,
      {
        $inc: {
          [`inventory.blood.${bloodRequest.bloodgroup}`]: bloodRequest.bags,
        },
      },
      { new: true }
    );

    return res.redirect("/hospital/dashboard/home");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
};

const showHospitalAppointment = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.session.userId);
    const donorRecipientAppointment = await BloodRequest.find({
      location: req.session.userId,
      acceptedByDonor: { $exists: true },
      recipientId: { $exists: true },
    })
      .populate("recipientId")
      .populate("acceptedByDonor");

    return res.render("hospital-appointment", {
      hospital,
      donorRecipientAppointment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error");
  }
};

const getHospitalRecipient = async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find({
      location: req.session.userId,
      status: "pending",
    })
      .populate("recipientId")
      .populate("location")
      .populate("acceptedByHospital");

    // Render the donor notifications page with the blood requests
    return res.render("hospital-recipient", { bloodRequests });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error fetching blood requests");
  }
};

const acceptBloodRequestByHospital = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await BloodRequest.findByIdAndUpdate(
      requestId,
      { status: "accepted", acceptedByHospital: req.session.userId },
      { new: true }
    );

    if (!request) {
      return res.status(404).send("Blood request not found");
    }

    return res.redirect("/hospital/dashboard/home");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error accepting blood request");
  }
};

const completeDonorRecipientRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const updated = await BloodRequest.findByIdAndUpdate(
      requestId,
      { status: "completed" },
      { new: true }
    );

    return res.redirect("/hospital/dashboard/appointment");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error in updating blood request");
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
  completeDonation,
  getDonorRequestsPage,
  requestBlood,
  postRequestForm,
  getRequestForm,
  showRecipientDashboard,
  getDonateForm,
  postDonateForm,
  showHospitalAppointment,
  getHospitalRecipient,
  acceptBloodRequestByHospital,
  completeDonorRecipientRequest,
};
