declare module "express-session" {
  interface SessionData {
    messages?: string[];
  }
}

export {};
