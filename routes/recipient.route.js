const express = require("express");
const router = express.Router();
const { checkAuth, checkRole } = require("../middleware/middleware.js");
const {
  showBloodTypes,
  showRequestForm,
  submitRequest,
} = require("../controllers/recipient.controller.js");

router.get("/blood", checkAuth, checkRole("recipient"), showBloodTypes);
router.get(
  "/request/:bloodType",
  checkAuth,
  checkRole("recipient"),
  showRequestForm
);
router.post("/request", checkAuth, checkRole("recipient"), submitRequest);

module.exports = router;
