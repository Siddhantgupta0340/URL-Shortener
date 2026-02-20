const express = require("express");
const {
  handlerCreateShortUrl,
  handlerGetRedirect,
  handlerDeleteUrl,
  handlerGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", handlerCreateShortUrl);
router.get("/analytics/:shortId", handlerGetAnalytics);
router.get("/:shortId", handlerGetRedirect);
router.delete("/:shortId", handlerDeleteUrl);

module.exports = router;
