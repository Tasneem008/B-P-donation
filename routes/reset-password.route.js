// routes/reset-password.route.js
const express = require("express");
const {
  getResetPasswordPage,
  postResetPassword,
} = require("../controllers/reset-password.controller");

const router = express.Router();

// /reset-password?token=..&email=..
router.get("/", getResetPasswordPage);
router.post("/", postResetPassword);

module.exports = router;
