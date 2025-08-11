const { default: mongoose } = require("mongoose");
const BloodRequest = require("../models/BloodRequest.js");
const getRequestForm = (req, res) => {
    res.render("/views/donor-dashboard.ejs");
}

const postRequestForm = async (req, res) => {
    try{
   const {bloodgroup, phone, location, bags, description,requestedDate} = req.body;
    const newbloodrequest = new BloodRequest({
      bloodgroup,
      phone,
      location,
      bags,
      description,
      requestedDate
    });
    await newbloodrequest.save()
    res.send("Blood request submitted successfully!");
    }
    catch(error){
    console.log(error)
    res.status(500).send("error in creating requests");
    }
};

module.exports = {getRequestForm, postRequestForm};