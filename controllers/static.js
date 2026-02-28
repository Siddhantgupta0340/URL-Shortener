const URL = require("../models/url");

async function renderHomePage(req, res) {
  const urls = await URL.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.render("index", { urls, user: req.user });
}

function renderLogin(req, res) {
  res.render("login");
}

function renderSignup(req, res) {
  res.render("signup");
}

module.exports = { renderHomePage, renderLogin, renderSignup };