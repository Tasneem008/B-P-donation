const express = require("express");
const {
  getRegisterPage,
  postRegisterPage,
} = require("../controllers/register.controller.js");

const router = express.Router();

router.get("/", getRegisterPage);

router.post("/", postRegisterPage);

module.exports = router;
