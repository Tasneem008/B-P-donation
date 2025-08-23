const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require("../middleware/middleware.js");
const {
showRecipientDashboard,
showRecipientHistory} = require("../controllers/recipient.controller.js");

router.get("/dashboard/home", checkAuth, checkRole("recipient"), showRecipientDashboard);

router.get('/recipient-history', checkAuth, checkRole('recipient'), showRecipientHistory);
// inside recipient.router.js
router.get(
  "/dashboard/history",
  checkAuth,
  checkRole("recipient"),
  showRecipientHistory
);


module.exports = router;
