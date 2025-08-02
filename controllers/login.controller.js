const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getLoginPage = (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }

  res.render("login");
};

const postLoginPage = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.send("Invalid credentials");
  }

  // Set session and redirect
  req.session.userId = user._id;
  req.session.role = user.role;

  return res.redirect("/");
};

module.exports = { getLoginPage, postLoginPage };
