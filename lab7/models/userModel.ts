import { User } from "../interfaces/index";

const database: User[] = [
  {
    id: 1,
    name: "Jimmy Smith",
    email: "jimmy123@gmail.com",
    password: "jimmy123!",
    role: "user",
  },
  {
    id: 2,
    name: "Johnny Doe",
    email: "johnny123@gmail.com",
    password: "johnny123!",
    role: "user",
  },
  {
    id: 3,
    name: "Jonathan Chen",
    email: "jonathan123@gmail.com",
    password: "jonathan123!",
    role: "user",
  },
  {
    id: 4,
    name: "OSTOmatopoeia",
    email: "osto@gmail.com",
    password: "osto",
    role: "admin",
  },
  {
    id: 5,
    name: "Boo Urns",
    email: "boo@gmail.com",
    password: "boo",
    role: "user",
  },
];

const userModel = {
  findOne: (email: string) => {
    const user = database.find((user) => user.email === email);
    if (user) {
      return user;
    }
    return null;
    // throw new Error(`Couldn't find user with email: ${email}`);
  },
  findById: (id: number | string) => {
    const user = database.find((user) => user.id === id);
    if (user) {
      return user;
    }
    return null;
    // throw new Error(`Couldn't find user with id: ${id}`);
  },
  addUser: (user: any, role: string) => {
    const newUser: User = {
      id: user.id,
      name: user.displayName,
      profileUrl: user.profileUrl,
      role: role,
    };
    console.log(newUser);
    database.push(newUser);
  },
};

export { database, userModel };
