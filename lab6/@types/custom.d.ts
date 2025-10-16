import type { TTip } from "./types";

declare module "express-session" {
  interface SessionData {
    userId: string;
    loginError: string;
  }
}
