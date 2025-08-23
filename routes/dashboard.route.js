const express = require("express");
const {
  redirectUserToDashboard,
  showDonorDashboardHome,
  // updateRequest,
  showDonorDashboardEditDetails,
  postUpdateDonation,
  getRecipientHistory,
  getDonorNotifications,
  acceptBloodRequest,
  getBloodDonationHistory,
} = require("../controllers/dashboard.controller");
const { checkAuth, checkRole } = require("../middleware/middleware");

const router = express.Router();

router.get("/dashboard", checkAuth, redirectUserToDashboard);

router.get(
  "/donor/dashboard/home",
  checkAuth,
  checkRole("donor"),
  showDonorDashboardHome
);

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

router.get(
  "/recipient/dashboard/history",
  checkAuth,
  checkRole("recipient"),
  getRecipientHistory
);

// router.post("/edit-request/:id", checkAuth, updateRequest);

// const { acceptRequest } = require("../controllers/dashboard.controller.js");

// router.post("/accept-request/:id", checkAuth, acceptRequest);

module.exports = router;
