const express = require("express");
const {
  handleCreateShortUrl,
  handleRedirect,
  handleDeleteUrl,
} = require("../controllers/url");

const { checkAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", checkAuth, handleCreateShortUrl);
router.get("/:shortId", handleRedirect);
router.delete("/:id", checkAuth, handleDeleteUrl);

module.exports = router;