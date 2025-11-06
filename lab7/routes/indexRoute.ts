import express from "express";
import {
  adminAuthenticated,
  ensureAuthenticated,
} from "../middleware/checkAuth";
import { SessionData } from "express-session";

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

      // I thought this was the solution, but it turns out I was wrong
      // key constant becomes "never" type which is wrong
      // for (const data in sessions as SessionData[]) {
      //   const key = data as keyof typeof sessions;
      //   const sData: MySessionData = sessions![key];
      //   sessionIds.push({
      //     sid: key,
      //     uid: sData.passport!.user,
      //   });
      // }

      // I believe this is the actual solution
      // At first I thought key should have "string" type which made sense because 'session id' is a string but I realized this is wrong
      // key constant should be "key" of the object (so in this case, 'keyof SessionData[]')
      const allSessions = sessions as SessionData[];
      for (const data in allSessions) {
        const key = data as keyof typeof allSessions;
        const sData = allSessions[key] as MySessionData;

        sessionIds.push({
          sid: data,
          uid: sData.passport!.user,
        });
      }

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
