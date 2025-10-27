import { Strategy } from "passport";

export interface User {
  id: number | string;
  name: string;
  email?: string;
  profileUrl?: string;
  password?: string;
  role: string;
}

export interface PassportStrategy {
  name: string;
  strategy: Strategy;
}
