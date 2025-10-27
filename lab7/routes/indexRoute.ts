import express from "express";
import {
  adminAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.user,
  });
});

router.get("/admin", adminAuthenticated, (req, res) => {
  req.sessionStore.all!((err, session) => {
    if (err) console.log(err);

    const sessions: {
      sid: string;
      uid: number | string;
    }[] = [];

    for (const data in session) {
      const key: string = data;
      sessions.push({
        sid: data,
        uid: session[key].passport.user, // I don't know how to deal with this error
      });
    }

    res.render("admin", {
      user: req.user,
      sessions: sessions,
    });
  });
});

router.get("/sessions/:id/revoke", adminAuthenticated, (req, res) => {
  const userSId = req.params.id;

  const revokeSession = (sid: string) => {
    req.sessionStore.destroy(sid, (err) => {
      if (err) return console.log(err);

      res.redirect("/admin");
    });
  };

  req.sessionStore.get(userSId, (err, session) => {
    if (err) return console.log(err);

    if (session) revokeSession(userSId);
  });
});

export default router;
