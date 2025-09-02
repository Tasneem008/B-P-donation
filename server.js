// Required Packages
const dotenv = require("dotenv");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const server = http.createServer(app);
const NotificationService = require('./services/notificationService.js');
app.use(cors());
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
NotificationService.initialize(io);
app.use(cors("*"));
app.use(express.json());
//we might need to update here
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("joinRoom", (userId) => {
    socket.join(userId); // room name = donor _id
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});
// Middlewares
const { setUserData } = require("./middleware/middleware.js");
// Db Connection
const connectDB = require("./config/db.js");
// Routes
const loginRoutes = require("./routes/login.route.js");
const registerRoutes = require("./routes/register.route.js");
const forgotPasswordRoutes = require("./routes/forgot-password.route.js");
const dashboardRoutes = require("./routes/dashboard.route.js");
const aboutUsRoutes = require("./routes/aboutUs.route.js");

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

app.use("/aboutUs", aboutUsRoutes);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
