import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmail,
  getUserById,
  isUserValid,
} from "../../controllers/userController";
import { User, PassportStrategy } from "../../interfaces/index";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = getUserByEmail(email);

    if (user) {
      if (isUserValid(user, password)) {
        done(null, user);
      } else {
        done(null, false, {
          message: "Password is wrong",
        });
      }
    } else {
      done(null, false, {
        message: `Couldn't find user with email: ${email}`,
      });
    }
  }
);

/*
DOUBLE CHECK FIX ME (types) 😭
*/
passport.serializeUser(function (user: User, done) {
  done(null, user.id);
});

/*
DOUBLE CHECK FIX ME (types) 😭
*/
passport.deserializeUser(function (id: number, done) {
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
