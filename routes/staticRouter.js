const express = require("express");
const { renderHomePage, renderLogin, renderSignup } = require("../controllers/static");
const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", checkAuth, renderHomePage);
router.get("/login", renderLogin);
router.get("/signup", renderSignup);

module.exports = router;