const express = require("express");
const {
  getForgotPasswordPage,
  handleForgotPassword,
  getResetPasswordPage,
  handleResetPassword,
} = require("../controllers/forgot-password.controller");

const router = express.Router();

router.get("/", getForgotPasswordPage);        // /forgot-password
router.post("/", handleForgotPassword);        // /forgot-password
router.get("/reset", getResetPasswordPage);    // /forgot-password/reset?token=..&email=..
router.post("/reset", handleResetPassword);    // /forgot-password/reset

module.exports = router;

