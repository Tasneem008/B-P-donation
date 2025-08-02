const express = require("express");
const {
  getLoginPage,
  postLoginPage,
} = require("../controllers/login.controller");
const router = express.Router();

router.get("/", getLoginPage);

router.post("/", postLoginPage);

module.exports = router;
