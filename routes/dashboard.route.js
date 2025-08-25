const express = require("express");
const {
  redirectUserToDashboard,
  showDonorDashboardHome,
  showDonorDashboardEditDetails,
  postUpdateDonation,
  getRecipientHistory,
  getDonorNotifications,
  acceptBloodRequest,
  getBloodDonationHistory,
  getHospitalDashboardHome,
  requestBlood,
  getRequestForm,
  postRequestForm,
  showRecipientDashboard,
  getDonateForm,
  completeDonation,
  showHospitalAppointment,
  getHospitalRecipient,
  acceptBloodRequestByHospital,
  postDonateForm,
  completeDonorRecipientRequest,
} = require("../controllers/dashboard.controller.js");
const { checkAuth, checkRole } = require("../middleware/middleware");

const router = express.Router();

router.get("/dashboard", checkAuth, redirectUserToDashboard);

// Donor Routes
router.get(
  "/donor/dashboard/home",
  checkAuth,
  checkRole("donor"),
  showDonorDashboardHome
);

router.get("/donor/donor-form", checkAuth, checkRole("donor"), getDonateForm);

router.post("/donor/donor-form", checkAuth, checkRole("donor"), postDonateForm);

router.get(
  "/donor/dashboard/edit-details",
  checkAuth,
  checkRole("donor"),
  showDonorDashboardEditDetails
);

router.get(
  "/donor/dashboard/notifications",
  checkAuth,
  checkRole("donor"),
  getDonorNotifications
);

router.get(
  "/donor/dashboard/history",
  checkAuth,
  checkRole("donor"),
  getBloodDonationHistory
);

router.post(
  "/donor/dashboard/accept-request",
  checkAuth,
  checkRole("donor"),
  acceptBloodRequest
);

router.post(
  "/donor/edit-details",
  checkAuth,
  checkRole("donor"),
  postUpdateDonation
);

// Reciepient Routes
router.get(
  "/recipient/dashboard/history",
  checkAuth,
  checkRole("recipient"),
  getRecipientHistory,
);

router.get(
  "/recipient/dashboard/home",
  checkAuth,
  checkRole("recipient"),
  showRecipientDashboard
);

router.post(
  "/recipient/dashboard/home",
  checkAuth,
  checkRole("recipient"),
  postRequestForm
);

router.get("/recipient/dashboard", getRequestForm);
router.post("/", postRequestForm);

// Hospital Routes
router.get(
  "/hospital/dashboard/home",
  checkAuth,
  checkRole("hospital"),
  getHospitalDashboardHome
);

router.get(
  "/hospital/dashboard/appointment",
  checkAuth,
  checkRole("hospital"),
  showHospitalAppointment
);

router.post(
  "/hospital/dashboard/appointment/:requestId",
  checkAuth,
  checkRole("hospital"),
  completeDonorRecipientRequest
);

router.get(
  "/hospital/dashboard/recipient",
  checkAuth,
  checkRole("hospital"),
  getHospitalRecipient
);

router.post(
  "/hospital/dashboard/accept-request",
  checkAuth,
  checkRole("hospital"),
  acceptBloodRequestByHospital
);

router.post(
  "/hospital/dashboard/home",
  checkAuth,
  checkRole("hospital"),
  requestBlood
);

router.post(
  "/hospital/dashboard/home/completed-donation/:requestId",
  checkAuth,
  checkRole("hospital"),
  completeDonation
);

module.exports = router;
