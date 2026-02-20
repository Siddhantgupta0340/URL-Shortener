const express = require("express");
const path = require("path");
const { connectToMongodb } = require("./connect");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");

const app = express();
const PORT = 8001;

connectToMongodb("mongodb://localhost:27017/url-shortener").then(() =>
  console.log("MongoDB Connected")
);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/url", urlRoute);
app.use("/", staticRoute);
app.use((req, res) => {
  return res.redirect("/?error=notfound");
});


app.listen(PORT, () => console.log(`Server running on ${PORT}`));
