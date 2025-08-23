const express = require("express");
const {
 getRequestForm,
 postRequestForm,
} = require("../controllers/request.con.js");

const router = express.Router();
router.get("/",getRequestForm);
router.post("/",postRequestForm);

module.exports = router;