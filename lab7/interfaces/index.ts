import { Strategy } from "passport";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface PassportStrategy {
  name: string;
  strategy: Strategy;
}
