import type { TTip } from "./types";
import { randomUUID } from "crypto";

let tips: TTip[] = [
  {
    id: randomUUID(),
    text: "Prefer const over let when you can.",
    likes: 2,
    createdAt: Date.now() - 10000,
  },
  {
    id: randomUUID(),
    text: "Name things clearly, future you will thank you.",
    likes: 5,
    createdAt: Date.now() - 5000,
  },
];

export function getTips() {
  return tips;
}

export function addTip(text: string) {
  const tip: { id: string; text: string; likes: number; createdAt: number } = {
    id: randomUUID(),
    text: text,
    likes: 0,
    createdAt: Date.now(),
  };
  tips.push(tip);

  return tip;
}

export function like(id: string) {
  const foundTip = tips.find((tip) => id === tip.id);

  if (foundTip) foundTip.likes++;

  return foundTip;
}

export function dislike(id: string) {
  const foundTip = tips.find((tip) => id === tip.id);

  if (foundTip) foundTip.likes--;

  return foundTip;
}

export function remove(id: string) {
  const newTips = tips.filter((tip) => id !== tip.id);

  if (newTips.length !== tips.length) {
    tips = newTips;

    return true;
  }

  return false;
}
