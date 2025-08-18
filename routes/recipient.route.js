const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require("../middleware/middleware.js");
const {
showRecipientDashboard,
showRecipientHistory} = require("../controllers/recipient.controller.js");

router.get("/dashboard", checkAuth, checkRole("recipient"), showRecipientDashboard);

router.get('/recipient-history', checkAuth, checkRole('recipient'), showRecipientHistory)



// router.get(
//   "/request/:bloodType",
//   checkAuth,
//   checkRole("recipient"),
//   showRequestForm
// );
// router.post("/request", checkAuth, checkRole("recipient"), submitRequest);

module.exports = router;
