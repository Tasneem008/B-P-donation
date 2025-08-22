const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = require("../config/mailer.js"); // uses SMTP_* from .env

const hashToken = (raw) => crypto.createHash("sha256").update(raw).digest("hex");

const getRegisterPage = (req, res) => {
  if (req.session.userId) return res.redirect("/");
  return res.render("register", { error: null, values: {} });
};

const postRegisterPage = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Basic input checks – keep simple, expand as needed
    if (!username || !email || !password || !role) {
      return res.status(400).render("register", {
        error: "All fields are required.",
        values: { username, email, role },
      });
    }
    // (Optional) simple email regex
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).render("register", {
        error: "Please enter a valid email address.",
        values: { username, email, role },
      });
    }
    if (password.length < 8) {
      return res.status(400).render("register", {
        error: "Password must be at least 8 characters.",
        values: { username, email, role },
      });
    }
    if (!["donor", "recipient", "hospital"].includes(role)) {
      return res.status(400).render("register", {
        error: "Invalid role.",
        values: { username, email, role },
      });
    }

    // Uniqueness checks (username or email)
    const existingUser = await User.findOne({
      $or: [{ username }, { email: email.toLowerCase().trim() }],
    });
    if (existingUser) {
      return res.status(400).render("register", {
        error: existingUser.username === username
          ? "Username already taken."
          : "Email already in use.",
        values: { username, email, role },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create email verification token (raw for email, hash in DB)
    const rawVerifyToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawVerifyToken);
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    // Create user (not verified yet)
    const user = await User.create({
      username,
      email: email.toLowerCase().trim(),
      password: passwordHash,
      role,
      emailVerified: false,
      emailVerifyTokenHash: tokenHash,
      emailVerifyTokenExpires: expires,
    });

    // Build verification link
    const appUrl = process.env.APP_URL || "http://localhost:8080";
    const verifyLink = `${appUrl}/verify-email?token=${rawVerifyToken}&email=${encodeURIComponent(user.email)}`;

    // Send verification email
    await transporter.sendMail({
      from: `"DonateLife" <no-reply@donatelife.local>`,
      to: user.email,
      subject: "Verify your email",
      html: `
        <p>Hello ${user.username || ""},</p>
        <p>Thanks for registering at DonateLife. Please verify your email to activate your account:</p>
        <p>
          <a href="${verifyLink}"
             style="background:#dc2626;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">
             Verify Email
          </a>
        </p>
        <p>This link will expire in 60 minutes.</p>
      `,
    });

    // Do NOT log in yet – make them verify first
    // Show a "check your email" page
    return res.render("auth/check-email");
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).render("register", {
      error: "Something went wrong. Please try again.",
      values: { username: req.body.username, email: req.body.email, role: req.body.role },
    });
  }
};

// New: handle GET /verify-email
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    if (!token || !email) return res.status(400).send("Invalid link.");

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.emailVerifyTokenHash || !user.emailVerifyTokenExpires) {
      return res.status(400).send("Invalid link.");
    }

    const valid =
      user.emailVerifyTokenHash === hashToken(token) &&
      user.emailVerifyTokenExpires > new Date();

    if (!valid) return res.status(400).send("Verification link invalid or expired.");

    user.emailVerified = true;
    user.emailVerifyTokenHash = undefined;
    user.emailVerifyTokenExpires = undefined;
    await user.save();

    // Option A: redirect to login with a flag
    return res.redirect("/login?verified=1");

    // Option B: auto-login after verify (uncomment if you prefer)
    // req.session.userId = user._id;
    // req.session.role = user.role;
    // return res.redirect("/");
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).send("Server error.");
  }
};

module.exports = { getRegisterPage, postRegisterPage, verifyEmail };
