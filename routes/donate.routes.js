const express = require("express");
const { getDonateForm, postDonateForm } = require("../controllers/donate.con.js");

const router = express.Router();

router.get("/", getDonateForm);
router.post("/", postDonateForm);

module.exports = router;
