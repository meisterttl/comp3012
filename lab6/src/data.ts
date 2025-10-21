import type { TTip } from "./types";
import { randomUUID } from "crypto";

type TUser = { id: string; username: string; password: string; tips: TTip[] };

let database: TUser[] = [
  {
    id: "A0328Xhf8",
    username: "jimmy123",
    password: "jimmy123!",
    tips: [
      {
        id: "1",
        text: "Prefer const over let when you can.",
        likes: 2,
        createdAt: Date.now() - 10000,
      },
    ],
  },
  {
    id: "BFGZ8328X",
    username: "sandra123",
    password: "sandra123!",
    tips: [
      {
        id: "2",
        text: "Name things clearly, future you will thank you.",
        likes: 5,
        createdAt: Date.now() - 5000,
      },
    ],
  },
];

export function connectToDatabase() {
  return database;
}

export function getTips(id: string) {
  const user = database.find((data) => id === data.id);

  if (user) {
    const foundTips = user.tips;

    return foundTips;
  }

  return false;
}

export function addTip(uid: string, text: string) {
  const user = database.find((data) => uid === data.id);

  if (user) {
    const tip: TTip = {
      id: randomUUID(),
      text: text,
      likes: 0,
      createdAt: Date.now(),
    };

    user.tips.push(tip);
    return tip;
  }

  return false;
}

export function like(uid: string, id: string) {
  const user = database.find((data) => uid === data.id);

  if (user) {
    const foundTip = user.tips.find((tip) => tip.id === id);

    if (foundTip) foundTip.likes++;
    return foundTip;
  }

  return false;
}

export function dislike(uid: string, id: string) {
  const user = database.find((data) => uid === data.id);

  if (user) {
    const foundTip = user.tips.find((tip) => tip.id === id);

    if (foundTip) foundTip.likes--;
    return foundTip;
  }

  return false;
}

export function remove(uid: string, id: string) {
  const user = database.find((data) => uid === data.id);

  if (user) {
    const tipToDelete = user.tips.findIndex((tip) => tip.id === id);

    if (tipToDelete != undefined && tipToDelete != -1) {
      user.tips.splice(tipToDelete, 1);
    }
  }
}
