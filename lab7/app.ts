import express from "express";
import expressLayouts from "express-ejs-layouts";
import session from "express-session";
import MemoryStore from "memorystore";
import path from "path";
import passportMiddleware from "./middleware/passportMiddleware";

const Store = MemoryStore(session);

const port = process.env.port || 8000;

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    store: new Store({
      checkPeriod: 24 * 60 * 60 * 1000,
    }),
    secret: "stick of truth",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

import authRoute from "./routes/authRoute";
import indexRoute from "./routes/indexRoute";

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
passportMiddleware(app);

app.use((req, res, next) => {
  // console.log(`User details are: `);
  // console.log(req.user);

  // console.log("Entire session object:");
  // console.log(req.session);

  // console.log(`Session details are: `);
  // console.log((req.session as any).passport);

  // console.log(`Session ID is: `);
  // console.log(req.sessionID);
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`🚀 Server has started on port ${port}`);
});
