require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/User.js");
const app = express();
const {checkAuth,checkRole} = require("./middleware/middleware.js");
const { request } = require("http");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// we mght need this later
// function checkAuth(req, res, next) {
//   if (req.session.userId) {
//     next();
//   } else {
//     res.redirect("/login");
//   }
// }

// Views setup - simple HTML files from public folder
app.get("/", (req, res) => {
//   if (req.session.userId) {
//     res.sendFile(path.join(__dirname, "public", "home.html"));
//   } else {
//     res.redirect("/login");
//   }
res.render("home",{session:req.session.userId})
});


// Show Login Form
app.get("/login", (req, res) => {
 res.render("login")
});

// Handle Login POST
app.post("/login", async (req, res) => {
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
  if (user.role === 'donor') {
    res.redirect('/donor/dashboard');
  } else if (user.role === 'recipient') {
    res.redirect('/recipient/dashboard');
  } else if (user.role === 'hospital') {
    res.redirect('/admin/dashboard');
  }
});

// Show Register Form
app.get("/register", (req, res) => {
res.render("register")
});

// Handle Register POST
app.post("/register", async (req, res) => {
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
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Show forgot password form
app.get("/forgot-password", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "forgot-password.html"));
});

// Handle reset password (manual username check)
app.post("/forgot-password", async (req, res) => {
  const { username, newPassword } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.send("No account found with that username.");
  }

  const hashed = await bcrypt.hash(newPassword, 12);
  user.password = hashed;
  await user.save();

  res.send('Password reset successfully. <a href="/login">Login</a>');
});

//laghbe ki nah jani nah
app.get("/dashboard", checkAuth, async (req, res) => {
  const user = await User.findById(req.session.userId);
  if (user.role === 'donor') {
    res.redirect('/donor/dashboard');
  } else if (user.role === 'recipient') {
    res.redirect('/recipient/dashboard');
  } else if (user.role === 'hospital') {
    res.redirect('/admin/dashboard');
  }
 
});

// might be needed
app.get('/donor/dashboard', checkAuth, checkRole('donor'),async (req, res) => {
     const user = await User.findById(req.session.userId);
  res.render('donor-dashboard',{user});

});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
