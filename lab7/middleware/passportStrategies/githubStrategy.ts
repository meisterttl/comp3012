import { Request } from "express";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { userModel } from "../../models/userModel";

const dirPath = path.join(__dirname, "../../");
const filePath = path.join(dirPath, ".env");

dotenv.config({ path: filePath });

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    callbackURL: "http://localhost:8000/auth/github/callback",
    passReqToCallback: true,
  },
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (err?: Error | null | undefined, profile?: any) => void
  ) => {
    const userExists = userModel.findById(profile.id);
    if (!userExists) userModel.addUser(profile, "user");

    return done(null, profile);
  }
);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete GitHub profile is serialized
//   and deserialized.
passport.serializeUser(function (
  user: any,
  done: (err: any, id?: unknown) => void
) {
  done(null, user);
});

passport.deserializeUser(function (
  obj: any,
  done: (err: any, user?: false | Express.User | null | undefined) => void
) {
  done(null, obj);
});

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
