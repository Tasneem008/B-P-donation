// controllers/forgot-password.controller.js
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const transporter = require("../config/mailer.js");

const hashToken = (raw) =>
  crypto.createHash("sha256").update(raw).digest("hex");

// GET /forgot-password -> show email-only form
const getForgotPasswordPage = (req, res) => {
  return res.render("forgot-password", { sent: false, error: null });
};

// POST /forgot-password -> create token, email reset link
const handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase().trim() });

    // Always render "sent" to avoid user enumeration
    if (!user)
      return res.render("forgot-password", { sent: true, error: null });

    const raw = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = hashToken(raw);
    user.resetPasswordTokenExpires = new Date(Date.now() + 20 * 60 * 1000); // 20 mins
    await user.save();

    const appUrl = process.env.APP_URL || "http://localhost:8080";
    const link = `${appUrl}/reset-password?token=${raw}&email=${encodeURIComponent(
      user.email
    )}`;

    let info = await transporter.sendMail({
      // from: `info@mailtrap.club`,
      from: '"DonateLife" <no-reply@mailtrap.io>',
      to: "sirgeant10@gmail.com",
      subject: "Reset your DonateLife password",
      text: "hello ji",
      // html: `
      //   <p>Hello ${user.username || ""},</p>
      //   <p>Click the button below to reset your password (expires in 20 minutes):</p>
      //   <p><a href="${link}" style="background:#dc2626;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
      //   <p>If you didn’t request this, you can ignore this email.</p>
      // `,
    });
    return res.render("forgot-password", { sent: true, error: null });
  } catch (error) {
    console.log(error);
    return res.render("forgot-password", {
      sent: false,
      error: "Something went wrong. Try again.",
    });
  }
};

// GET /forgot-password/reset -> verify token and show new password form
const getResetPasswordPage = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) return res.status(400).send("Invalid link");

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(400).send("Invalid link");

  const valid =
    user.resetPasswordTokenHash === hashToken(token) &&
    user.resetPasswordTokenExpires &&
    user.resetPasswordTokenExpires > new Date();

  if (!valid) return res.status(400).send("Reset link is invalid or expired.");

  return res.render("reset-password", { email, token, error: null });
};

// POST /forgot-password/reset -> set new password
const handleResetPassword = async (req, res) => {
  const { token, email, password, confirm } = req.body;

  try {
    if (!password || password.length < 8) {
      return res.render("reset-password", {
        email,
        token,
        error: "Password must be at least 8 characters.",
      });
    }
    if (password !== confirm) {
      return res.render("reset-password", {
        email,
        token,
        error: "Passwords do not match.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(400).send("Invalid link");

    const valid =
      user.resetPasswordTokenHash === hashToken(token) &&
      user.resetPasswordTokenExpires &&
      user.resetPasswordTokenExpires > new Date();

    if (!valid)
      return res.status(400).send("Reset link is invalid or expired.");

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    // Optional: invalidate other sessions here if you keep a session store
    return res.redirect("/login?reset=1");
  } catch (e) {
    console.error(e);
    return res.render("reset-password", {
      email,
      token,
      error: "Something went wrong. Try again.",
    });
  }
};

module.exports = {
  getForgotPasswordPage,
  handleForgotPassword,
  getResetPasswordPage,
  handleResetPassword,
};
