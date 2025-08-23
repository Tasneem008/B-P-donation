const Hospital = require("../models/Hospital.js");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

const getLoginPage = (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }

  return res.render("login");
};

const postLoginPage = async (req, res) => {
  const { email, password } = req.body;

  // Check if the email exists in the User model
  const user = await User.findOne({ email });

  // Check if the email exists in the Hospital model
  const hospital = await Hospital.findOne({ email });

  // If neither user nor hospital is found, return an error
  if (!user && !hospital) {
    return res.send("Invalid email or password");
  }

  let isMatch;

  // Compare password for User or Hospital depending on what was found
  if (user) {
    // Compare password for User
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Invalid credentials");
    }

    // Set session for user
    req.session.userId = user._id;
    req.session.role = user.role;
  } else if (hospital) {
    // Compare password for Hospital
    isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.send("Invalid credentials");
    }

    // Set session for hospital
    req.session.userId = hospital._id;
    req.session.role = "hospital"; // Hospital role for session
  }

  

  // Redirect to dashboard or home page after login
  return res.redirect("/");
};

module.exports = { getLoginPage, postLoginPage };
