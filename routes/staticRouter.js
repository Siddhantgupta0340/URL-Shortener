const express = require("express");
const URL = require("../models/url");

const router = express.Router();

router.get("/", async (req, res) => {
  const urls = await URL.find({});
  res.render("index", { urls });
});

module.exports = router;
