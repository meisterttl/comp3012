declare global {
  namespace Express {
    interface User {
      id: number | string;
      name: string;
      email?: string;
      profileUrl?: string;
      password?: string;
      role: string;
    }
  }
}

export {};
