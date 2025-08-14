// Required Packages
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
// Middlewares
const { setUserData } = require("./middleware/middleware.js");
// Database Connection
const connectDB = require("./config/db.js");
// Routes
const loginRoutes = require("./routes/login.route.js");
const registerRoutes = require("./routes/register.route.js");
const forgotPasswordRoutes = require("./routes/forgot-password.route.js");
const dashboardRoutes = require("./routes/dashboard.route.js");
const recipientRoutes = require("./routes/recipient.route.js");
const requestRoutes = require("./routes/request.js");
const donateRoutes = require("./routes/donate.js");


dotenv.config();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.use(setUserData);

// Serve static files (if needed)
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get("/", (req, res) => {
  res.render("home");
});

// Login Route
app.use("/login", loginRoutes);

// register Route
app.use("/register", registerRoutes);

// Show forgot password form
app.use("/forgot-password", forgotPasswordRoutes);

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Dashboard of different roles users.
app.use("/", dashboardRoutes);

app.use("/recipient", recipientRoutes);
app.use("/request", requestRoutes);
app.use("/donate", donateRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
