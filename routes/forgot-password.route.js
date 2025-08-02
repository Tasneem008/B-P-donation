const express = require("express");
const {
  getForgotPasswordPage,
  handleForgotPassword,
} = require("../controllers/forgot-password.controller");

const router = express.Router();

router.get("/", getForgotPasswordPage);

router.post("/", handleForgotPassword);

module.exports = router;
