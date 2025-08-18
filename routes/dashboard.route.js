const express = require("express");
const {
  redirectUserToDashboard,
  showDonorDashboard,
  updateRequest
} = require("../controllers/dashboard.controller");
const { checkAuth, checkRole } = require("../middleware/middleware");

const router = express.Router();

router.get("/dashboard", checkAuth, redirectUserToDashboard);

router.get(
  "/donor/dashboard",
  checkAuth,
  checkRole("donor"),
  showDonorDashboard,
);
router.post(
  "/edit-request/:id",
  checkAuth,
  updateRequest
);
module.exports = router;
