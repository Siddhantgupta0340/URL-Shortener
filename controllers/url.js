const shortid = require("shortid");
const URL = require("../models/url");

// CREATE
async function handlerCreateShortUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url || !/^https?:\/\//i.test(url)) {
      return res
        .status(400)
        .json({ error: "Invalid URL (must start with http/https)" });
    }

    try {
      new URL(url);
    } catch (err) {
      return res.status(400).json({ error: "Invalid URL format" });
    }
    const shortId = shortid.generate();

    const created = await URL.create({
      shortId,
      redirectUrl: url,
      visitHistory: [],
    });

    return res.status(201).json({
      shortId: created.shortId,
      redirectUrl: created.redirectUrl,
      clicks: created.visitHistory.length,
    });
  } catch (err) {
    console.error("Create error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// REDIRECT
async function handlerGetRedirect(req, res) {
  try {
    const { shortId } = req.params;

    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true },
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    return res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).send("Internal Server Error");
  }
}

// DELETE
async function handlerDeleteUrl(req, res) {
  try {
    const { shortId } = req.params;

    const deleted = await URL.findOneAndDelete({ shortId });

    if (!deleted) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ANALYTICS
async function handlerGetAnalytics(req, res) {
  try {
    const { shortId } = req.params;

    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handlerCreateShortUrl,
  handlerGetRedirect,
  handlerDeleteUrl,
  handlerGetAnalytics,
};
