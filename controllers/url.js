const URLModel = require("../models/url");
const { nanoid } = require("nanoid");

function isValidUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function handleCreateShortUrl(req, res) {
  try {
    const { url } = req.body;

    if (!url || !isValidUrl(url.trim())) {
      return res.status(400).json({ error: "Please enter a valid URL (http:// or https://)" });
    }

    const shortId = nanoid(7);

    const newUrl = await URLModel.create({
      shortId,
      redirectUrl: url.trim(),
      visitHistory: [],
      createdBy: req.user._id,
    });

    return res.status(201).json(newUrl);
  } catch (err) {
    console.error("Create URL error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleRedirect(req, res) {
  try {
    const { shortId } = req.params;

    const entry = await URLModel.findOne({ shortId });
    if (!entry) return res.status(404).send("Page not available");

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