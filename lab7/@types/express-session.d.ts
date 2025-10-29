declare module "express-session" {
  interface SessionData {
    messages?: string[] | undefined;
    passport?: {
      user: number | string;
    };
  }
}

export {};
