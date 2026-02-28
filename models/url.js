const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortId: String,
  redirectUrl: String,
  visitHistory: [],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("URL", urlSchema);