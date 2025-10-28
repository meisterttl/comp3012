import express from "express";
import {
  adminAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";
import { SessionData } from "express-session";

interface SSession {
  [sid: string]: SessionData;
}

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
  req.sessionStore.all!((err, sessions) => {
    if (err) return console.log(err);

    const sessionIds: {
      sid: string;
      uid: number | string;
    }[] = [];

    for (const data in sessions) {
      const key = data as keyof SSession;
      sessionIds.push({
        sid: data,
        // @ts-ignore
        uid: sessions[key].passport.user, // I don't know how to deal with this typescript error, would love some feedback on this
      });
    }

    res.render("admin", {
      user: req.user,
      sessionIds: sessionIds,
    });
  });
});

router.get("/admin/sessions/:id/revoke", adminAuthenticated, (req, res) => {
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
