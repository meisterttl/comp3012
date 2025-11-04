import express from "express";
import {
  adminAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";
import { SessionData } from "express-session";

// Type testing
type MySession = {
  [sid: string]: SessionData;
};
type KeyString = keyof MySession & string;
type MySessionData = MySession[KeyString];

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
  if (req.sessionStore && req.sessionStore.all) {
    req.sessionStore.all!((err, sessions) => {
      if (err) return console.log(err);

      const sessionIds: {
        sid: string;
        uid: number | string;
      }[] = [];

      // I know it's late but OMG, I finally fixed this issue!!!
      for (const data in sessions as SessionData[]) {
        const key = data as keyof typeof sessions;
        const sData: MySessionData = sessions![key];

        sessionIds.push({
          sid: key,
          uid: sData.passport!.user,
        });
      }

      // Easiest method so far
      const sessionArrays = Object.entries(sessions as SessionData[]);
      sessionArrays.forEach((session) => {
        sessionIds.push({
          sid: session[0],
          uid: session[1].passport!.user,
        });
      });

      // Testing other methods
      // const keys = Object.keys(sessions as SessionData[]);
      // const sessionMap = new Map(Object.entries(sessions as SessionData[]));
      // keys.forEach((key) => {
      //   const session = sessionMap.get(key);

      //   sessionIds.push({
      //     sid: key,
      //     uid: session!.passport!.user,
      //   });
      // });

      // Testing other methods
      // Getting session data using sessions[key] seems really complicated
      // const keys = Object.keys(sessions as SessionData[]);
      // keys.forEach((key) => {
      //   const session = sessions[key];
      //   sessionIds.push({
      //     sid: key,
      //     uid: session.passport!.user,
      //   });
      // });

      res.render("admin", {
        user: req.user,
        sessionIds: sessionIds,
      });
    });
  }
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
