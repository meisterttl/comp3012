import express from "express";
import session from "express-session";
import path from "node:path";
import morgan from "morgan";
import {
  connectToDatabase,
  addTip,
  dislike,
  getTips,
  like,
  remove,
} from "./data";

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  session({
    secret: "nyan cat",
    cookie: { maxAge: 300000 },
  })
);

app.get("/", (req, res) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    const userId = req.session.userId;
    const tips = getTips(userId);

    res.render("index", { tips });
  }
});

app.get("/login", (req, res) => {
  let message = req.session.loginError ? req.session.loginError : "";
  if (req.session.loginError) delete req.session.loginError;

  res.render("login", { message });
});

app.post("/login", (req, res) => {
  const database = connectToDatabase();
  const { username, password } = req.body;
  let userExists = false;

  const foundUser = database.find((data) => {
    if (data.username === username && data.password === password) {
      return data;
    } else {
      // If the user exists but the password is wrong
      if (data.username === username && data.password !== password)
        userExists = true;

      return false;
    }
  });

  if (foundUser) {
    req.session.userId = foundUser.id;

    res.redirect("/");
  } else {
    req.session.loginError = userExists
      ? "The password is invalid."
      : "The user does not exist.";

    res.redirect("/login");
  }
});

app.post("/tips", (req, res) => {
  if (req.session.userId) {
    const uid = req.session.userId;
    const { text } = req.body;

    if (text) addTip(uid, text);

    res.redirect("/");
  }
});

app.post("/tips/:id/like", (req, res) => {
  if (req.session.userId) {
    const uid = req.session.userId;
    const id = req.params.id;

    like(uid, id);
  }

  res.redirect("/");
});

app.post("/tips/:id/dislike", (req, res) => {
  if (req.session.userId) {
    const uid = req.session.userId;
    const id = req.params.id;

    dislike(uid, id);
  }

  res.redirect("/");
});

app.post("/tips/:id/delete", (req, res) => {
  if (req.session.userId) {
    const uid = req.session.userId;
    const id = req.params.id;

    remove(uid, id);
  }

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`
🚀 http://localhost:${PORT}`);
});
