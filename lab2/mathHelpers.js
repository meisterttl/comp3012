const squareRoot = (value) => Math.sqrt(value);

const square = (value) => value * value;

export const calculateDistance = (x1, x2, y1, y2) => {
  const distance = squareRoot(square(x2 - x1) + square(y2 - y1));

  return distance;
};
