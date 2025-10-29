import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmail,
  getUserById,
  isUserValid,
} from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces/index";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmail(email);

    if (user) {
      if (isUserValid(user, password)) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: "Password is wrong",
        });
      }
    } else {
      return done(null, false, {
        message: `Couldn't find user with email: ${email}`,
      });
    }
  }
);

passport.serializeUser(function (
  user: Express.User,
  done: (err: any, id?: unknown) => void
) {
  done(null, user.id);
});

passport.deserializeUser(function (
  id: number | string,
  done: (err: any, user?: false | Express.User | null | undefined) => void
) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
