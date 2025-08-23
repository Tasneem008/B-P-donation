// routes/aboutUs.routes.js
const express = require("express");
const router = express.Router();
const aboutUsController = require("../controllers/aboutUs.controller.js");

// GET /about
router.get("/", aboutUsController.getAboutUsPage);

module.exports = router;