const express = require("express");
const {
  getRegisterPage,
  postRegisterPage,
  getHospitalRegisterPage,
  registerHospital,
  // verifyEmail,
} = require("../controllers/register.controller.js");

const router = express.Router();

router.get("/", getRegisterPage);

router.get('/hospital', getHospitalRegisterPage)

router.post("/", postRegisterPage);

router.post('/hospital', registerHospital)

// router.get("/verify-email", verifyEmail);

module.exports = router;
