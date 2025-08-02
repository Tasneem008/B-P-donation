const express = require("express");
const {
  redirectUserToDashboard,
  showDonorDashboard,
} = require("../controllers/dashboard.controller");
const { checkAuth, checkRole } = require("../middleware/middleware");

const router = express.Router();

router.get("/", checkAuth, redirectUserToDashboard);

router.get(
  "/donor/dashboard",
  checkAuth,
  checkRole("donor"),
  showDonorDashboard
);

module.exports = router;
