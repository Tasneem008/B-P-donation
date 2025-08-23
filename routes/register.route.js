const express = require("express");
const {
  getRegisterPage,
  postRegisterPage,
  verifyEmail,        
} = require("../controllers/register.controller.js");

const router = express.Router();

router.get("/", getRegisterPage);

router.post("/", postRegisterPage);

router.get("/verify-email", verifyEmail);

module.exports = router;
