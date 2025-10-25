import express from "express";
const router = express.Router();
import { ensureAuthenticated } from "../middleware/checkAuth";

router.get("/", (req, res) => {
  res.send("Welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const sessionstore = "admin" === req.user?.role ? req.sessionStore : null;

  res.render("dashboard", {
    user: req.user,
    sessionstore: sessionstore,
  });
});

export default router;
