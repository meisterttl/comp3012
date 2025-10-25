import { userModel } from "../models/userModel";
import { User } from "../interfaces/index";

// const getUserByEmailIdAndPassword = (email: string, password: string) => {
//   let user = userModel.findOne(email);
//   if (user) {
//     if (isUserValid(user, password)) {
//       return user;
//     }
//   }
//   return null;
// };

const getUserByEmail = (email: string) => {
  let user = userModel.findOne(email);
  if (user) {
    return user;
  }
  return null;
};

const getUserById = (id: number) => {
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
