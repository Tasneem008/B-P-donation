const express = require("express");
const { getDonateForm, postDonateForm } = require("../controllers/donor.controller.js");

const router = express.Router();

router.get("/", getDonateForm);
router.post("/", postDonateForm);

module.exports = router;
