const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/user");
const urlRoutes = require("./routes/url");
const { checkAuth } = require("./middlewares/auth");
const URLModel = require("./models/url");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use("/user", userRoutes);
app.use("/url", urlRoutes);

// Default route → Login page
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Pages
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Dashboard (Protected)
app.get("/dashboard", checkAuth, async (req, res) => {
  const urls = await URLModel.find({ createdBy: req.user._id });
  res.render("index", { user: req.user, urls });
});

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/url-shortener")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});