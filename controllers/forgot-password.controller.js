const User = require("../models/User");

const getForgotPasswordPage = (req, res) => {
  res.render("forgot-password");
};

const handleForgotPassword = async (req, res) => {
  const { username, newPassword } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.send("No account found with that username.");
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  user.password = hashed;
  await user.save();

  res.send('Password reset successfully. <a href="/login">Login</a>');
};

module.exports = { getForgotPasswordPage, handleForgotPassword };
