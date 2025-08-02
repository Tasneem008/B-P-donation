const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getRegisterPage = (req, res) => {
  if (req.session.userId) {
    return res.redirect("/");
  }
  
  res.render("register");
};

const postRegisterPage = async (req, res) => {
  const { username, email, password, role } = req.body;

  const exists = await User.findOne({ username });
  if (exists) {
    return res.send("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({ username, email, password: hashedPassword, role });
  await user.save();

  req.session.userId = user._id;
  res.redirect("/");
};

module.exports = { getRegisterPage, postRegisterPage };
