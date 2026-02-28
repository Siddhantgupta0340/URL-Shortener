const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function checkAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie("token");
      return res.redirect("/login");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.clearCookie("token");
    return res.redirect("/login");
  }
}

module.exports = { checkAuth };