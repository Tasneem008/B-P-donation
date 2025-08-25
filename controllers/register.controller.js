const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const transporter = require("../config/mailer.js"); // uses SMTP_* from .env
const Hospital = require("../models/Hospital.js");

const hashToken = (raw) =>
  crypto.createHash("sha256").update(raw).digest("hex");

const getRegisterPage = (req, res) => {
  if (req.session.userId) return res.redirect("/");
  return res.render("register", { error: null, values: {} });
};

const postRegisterPage = async (req, res) => {
  try {
    const { username, email, password, role, confirmPassword } = req.body;

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

    if (password !== confirmPassword) {
      return res.status(400).render("register", {
        error: "Passwords do not match",
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
        error:
          existingUser.username === username
            ? "Username already taken."
            : "Email already in use.",
        values: { username, email, role },
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create email verification token (raw for email, hash in DB)
    // const rawVerifyToken = crypto.randomBytes(32).toString("hex");
    // const tokenHash = hashToken(rawVerifyToken);
    // const expires = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

    // Create user (not verified yet)
    const newUser = await User.create({
      username,
      email: email.toLowerCase().trim(),
      password: passwordHash,
      role,
      // emailVerified: false,
      // emailVerifyTokenHash: tokenHash,
      // emailVerifyTokenExpires: expires,
    });

    await newUser.save();

    // Build verification link
    // const appUrl = process.env.APP_URL || "http://localhost:8080";
    // const verifyLink = `${appUrl}/verify-email?token=${rawVerifyToken}&email=${encodeURIComponent(
    //   user.email
    // )}`;

    // Send verification email
    // await transporter.sendMail({
    //   from: `"DonateLife" <no-reply@donatelife.local>`,
    //   to: user.email,
    //   subject: "Verify your email",
    //   html: `
    //     <p>Hello ${user.username || ""},</p>
    //     <p>Thanks for registering at DonateLife. Please verify your email to activate your account:</p>
    //     <p>
    //       <a href="${verifyLink}"
    //          style="background:#dc2626;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">
    //          Verify Email
    //       </a>
    //     </p>
    //     <p>This link will expire in 60 minutes.</p>
    //   `,
    // });

    // Do NOT log in yet – make them verify first
    // Show a "check your email" page

    // Set session and redirect
    req.session.userId = newUser._id;
    req.session.role = newUser.role;

    return res.redirect("/");
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).render("register", {
      error: "Something went wrong. Please try again.",
      values: {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
      },
    });
  }
};

// // New: handle GET /verify-email
// const verifyEmail = async (req, res) => {
//   try {
//     const { token, email } = req.query;
//     if (!token || !email) return res.status(400).send("Invalid link.");

//     const user = await User.findOne({ email: email.toLowerCase().trim() });
//     if (!user || !user.emailVerifyTokenHash || !user.emailVerifyTokenExpires) {
//       return res.status(400).send("Invalid link.");
//     }

//     const valid =
//       user.emailVerifyTokenHash === hashToken(token) &&
//       user.emailVerifyTokenExpires > new Date();

//     if (!valid)
//       return res.status(400).send("Verification link invalid or expired.");

//     user.emailVerified = true;
//     user.emailVerifyTokenHash = undefined;
//     user.emailVerifyTokenExpires = undefined;
//     await user.save();

//     // Option A: redirect to login with a flag
//     return res.redirect("/login?verified=1");

//     // Option B: auto-login after verify (uncomment if you prefer)
//     // req.session.userId = user._id;
//     // req.session.role = user.role;
//     // return res.redirect("/");
//   } catch (err) {
//     console.error("Verify email error:", err);
//     return res.status(500).send("Server error.");
//   }
// };

// Hopital Code
const getHospitalRegisterPage = (req, res) => {
  // Dummy Values For Hospitals
  const hospitalsArray = [
    {
      title: "Popular Hospital Bangladesh",
      areas: [
        "Dhanmondi",
        "English Road",
        "Shantinagar Unit-1",
        "Shantinagar Unit-2",
        "Narayanganj",
        "Savar",
        "Uttara Unit-1",
        "Uttara Unit-2",
        "Shyamoli",
        "Mirpur Unit-1",
        "Mirpur Unit-2",
        "Badda",
        "Gazipur",
        "Noakhali",
        "Chattogram",
        "Rajshahi",
        "Rangpur Unit-1",
        "Rangpur Unit-2",
        "Dinajpur",
        "Mymensingh",
        "Bogra Unit-1",
        "Bogra Unit-2",
        "Bogra Unit-3",
        "Khulna",
        "Kushtia",
        "Barishal",
      ],
    },
    {
      title: "Labaid Specialized Hospital Bangladesh",
      areas: [
        "Dhanmondi",
        "Uttara Unit-1",
        "Uttara Unit-2",
        "Kalabagan",
        "Mirpur",
        "Gulshan",
        "Malibagh",
        "Badda",
        "Savar",
        "Narayanganj",
        "Faridpur",
        "Sylhet",
        "Chattogram",
        "Noakhali",
        "Cumilla",
        "Khulna",
        "Barishal Unit-1",
        "Barishal Unit-2",
        "Bogura",
        "Naogaon",
        "Pabna",
        "Rajshahi",
        "Rangpur",
        "Dinajpur",
        "Doyaganj",
        "Feni",
        "Magura",
        "Bhola",
        "Jessore",
        "Chandpur",
        "Tangail",
        "Narsingdi",
      ],
    },
    {
      title: "National Heart Foundation Bangladesh",
      areas: ["Mirpur", "Sylhet"],
    },
  ];

  if (req.session.userId) return res.redirect("/");
  return res.render("register-hospital", { hospitalsArray, error: null });
};

const registerHospital = async (req, res) => {
  try {
    // Step 1: Extract data from request body
    const { name, email, password, confirmPassword, location } = req.body;

    // Basic input checks – keep simple, expand as needed
    if (!name || !email || !password || !confirmPassword || !location) {
      return res.status(400).render("register-hospital", {
        error: "All fields are required.",
        values: { name, email, password, confirmPassword, location },
      });
    }

    // (Optional) simple email regex
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return res.status(400).render("register-hospital", {
        error: "Please enter a valid email address.",
        values: { name, email },
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("register-hospital", {
        error: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      return res.status(400).render("register-hospital", {
        error: "Password must be at least 8 characters.",
        values: { name, email, role },
      });
    }

    // Step 3: Check if the hospital already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res
        .status(400)
        .json({ msg: "Hospital already registered with this email" });
    }

    // Step 4: Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Create new hospital instance
    const newHospital = new Hospital({
      name,
      email,
      password: hashedPassword,
      location,
    });

    // Step 6: Save the hospital to the database
    await newHospital.save();

    // Set session and redirect
    req.session.userId = newHospital._id;
    req.session.role = newHospital.role;

    // Step 7: Respond with success
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  getRegisterPage,
  postRegisterPage,
  getHospitalRegisterPage,
  registerHospital
  // verifyEmail
};
