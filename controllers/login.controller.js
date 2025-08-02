const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getLoginPage = (req, res) => {
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
  if (user.role === "donor") {
    res.redirect("/donor/dashboard");
  } else if (user.role === "recipient") {
    res.redirect("/recipient/dashboard");
  } else if (user.role === "hospital") {
    res.redirect("/admin/dashboard");
  }
};

module.exports = { getLoginPage, postLoginPage };
