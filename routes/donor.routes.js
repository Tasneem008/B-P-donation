const express = require("express");
const { getDonateForm, postDonateForm } = require("../controllers/donor.controller.js");

const router = express.Router();

router.get("/donor-form", getDonateForm);
router.post("/donor-form", postDonateForm);

module.exports = router;
