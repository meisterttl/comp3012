import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";
import { userModel } from "../models/userModel";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const errorMessages = req.session.messages ? req.session.messages[0] : null;
  if (errorMessages) delete req.session.messages;

  res.render("login", { error: errorMessages });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/login" }),
  function (req, res) {
    const userExists = userModel.findById(req.user!.id);
    if (!userExists) userModel.addUser(req.user, "user");

    res.redirect("/dashboard");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
