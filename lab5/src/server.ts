import express from "express";
import path from "node:path";
import morgan from "morgan";
import { addTip, dislike, getTips, like, remove } from "./data";

const app = express();
const PORT = 3000;

// Use EJS Instead of HTML
app.set("view engine", "ejs");

// Use Morgan for Logging
app.use(morgan("dev"));

// Get Access to Incoming Form Data using req.body
app.use(express.urlencoded({ extended: true }));

// Serve static content like css or site logo from public
app.use(express.static("public"));

app.get("/", (req, res) => {
  const tips = getTips();
  res.render("index", { tips });
});

// Create
app.post("/tips", (req, res) => {
  const tipText = req.body.text.trim();

  if (tipText && "" !== tipText) addTip(tipText);
  res.redirect("/");
});

// Like/Dislike/Delete
app.post("/tips/:id/like", (req, res) => {
  like(req.params.id);
  res.redirect("/");
});

app.post("/tips/:id/dislike", (req, res) => {
  dislike(req.params.id);
  res.redirect("/");
});

app.post("/tips/:id/delete", (req, res) => {
  remove(req.params.id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`
🚀 http://localhost:${PORT}`);
});
