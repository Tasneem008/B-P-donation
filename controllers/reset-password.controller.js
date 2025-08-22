// controllers/reset-password.controller.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const hashToken = (raw) => crypto.createHash("sha256").update(raw).digest("hex");

// GET /reset-password?token=...&email=...
exports.getResetPasswordPage = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) return res.status(400).send("Invalid link.");

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(400).send("Invalid link.");

  const valid =
    user.resetPasswordTokenHash === hashToken(token) &&
    user.resetPasswordTokenExpires &&
    user.resetPasswordTokenExpires > new Date();

  if (!valid) return res.status(400).send("Reset link is invalid or expired.");

  // show form
  res.render("reset-password", { error: null, email, token });
};

// POST /reset-password
exports.postResetPassword = async (req, res) => {
  try {
    const { email, token, password, confirm } = req.body;

    if (!password || password.length < 8) {
      return res.render("reset-password", {
        error: "Password must be at least 8 characters.",
        email, token,
      });
    }
    if (password !== confirm) {
      return res.render("reset-password", {
        error: "Passwords do not match.",
        email, token,
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).send("Invalid link.");

    const valid =
      user.resetPasswordTokenHash === hashToken(token) &&
      user.resetPasswordTokenExpires &&
      user.resetPasswordTokenExpires > new Date();

    if (!valid) return res.status(400).send("Reset link is invalid or expired.");

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    return res.redirect("/login?reset=1");
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).render("reset-password", {
      error: "Something went wrong. Try again.",
      email: req.body.email,
      token: req.body.token,
    });
  }
};
