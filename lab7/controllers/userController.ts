import { userModel } from "../models/userModel";
import { User } from "../interfaces/index";

const getUserByEmail = (email: string) => {
  let user = userModel.findOne(email);
  if (user) {
    return user;
  }
  return null;
};

const getUserById = (id: number | string) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user: User, password: string) {
  return user.password === password;
}

export { getUserByEmail, getUserById, isUserValid };
