const express = require("express");
const { getBloodGroup } = require("../controllers/donordata.con.js");
const router = express.Router();

router.get("/bloodgroup", getBloodGroup);

module.exports = router;
