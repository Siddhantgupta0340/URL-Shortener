const URLModel = require("../models/url");
const { nanoid } = require("nanoid");
const axios = require("axios");
const dns = require("dns").promises;

function isValidUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

async function isWebsiteReachable(url) {
  try {
    const hostname = new URL(url).hostname;

    // Check domain exists
    await dns.lookup(hostname);

    // Check site responds
    await axios.head(url, { timeout: 5000, maxRedirects: 5 });

    return true;
  } catch {
    return false;
  }
}

async function handleCreateShortUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url.trim())) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const reachable = await isWebsiteReachable(url.trim());
    if (!reachable) {
      return res.status(400).json({ error: "Website is not available" });
    }

    const shortId = nanoid(7);

    const newUrl = await URLModel.create({
      shortId,
      redirectUrl: url.trim(),
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.status(201).json({
      shortId: newUrl.shortId,
      redirectUrl: newUrl.redirectUrl,
    });
  } catch (err) {
    console.error("Create URL error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleRedirect(req, res) {
  try {
    const entry = await URLModel.findOne({ shortId: req.params.shortId });
    if (!entry) return res.status(404).send("Short URL not found");

    entry.visitHistory.push({ timestamp: Date.now() });
    await entry.save();

    return res.redirect(entry.redirectUrl);
  } catch (err) {
    return res.status(500).send("Server error");
  }
}

async function handleDeleteUrl(req, res) {
  try {
    await URLModel.deleteOne({ _id: req.params.id, createdBy: req.user._id });
    return res.json({ message: "Deleted" });
  } catch {
    return res.status(500).json({ error: "Delete failed" });
  }
}

module.exports = {
  handleCreateShortUrl,
  handleRedirect,
  handleDeleteUrl,
};