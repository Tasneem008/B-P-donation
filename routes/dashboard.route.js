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

const {acceptRequest} = require("../controllers/dashboard.controller");
const {cancelRequest} = require("../controllers/dashboard.controller");
const {completeRequest} = require("../controllers/dashboard.controller");

router.post("/cancel-request/:id", checkAuth, cancelRequest);
router.post("/complete-request/:id", checkAuth, completeRequest);

router.post(
  "/accept-request/:id", 
  checkAuth, 
  acceptRequest);


module.exports = router;
