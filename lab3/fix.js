import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EOL } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputFilePath = path.join(__dirname, "menu.csv");
const outputFilePath = path.join(__dirname, "menu.txt");

const menuObjSorting = (obj) => {
  for (const item in obj) {
    obj[item].sort();
  }
  return obj;
};

const capitalize = (string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1).toLowerCase()}`;

const adjustPrice = (number, multiplier, digits) =>
  parseFloat(number * multiplier).toFixed(digits);

fs.readFile(inputFilePath, { encoding: "utf8" })
  .then((menu) => {
    const menuArray = menu.split(EOL);
    const menuObj = {};
    let menuData = "";

    menuArray
      .filter((item) => "" !== item) // just in case .csv file contains empty rows
      .map((item) => {
        const [mealType, ...rest] = item.split(",");

        // basic error checking to make sure each menu item follows the same structure
        if ("" !== mealType && 3 === rest.length) {
          if (!(mealType in menuObj)) menuObj[mealType] = [];
          menuObj[mealType].push(rest);
        }
      });
    menuObjSorting(menuObj);

    const arrayObj = Object.entries(menuObj);
    // simple check just to make sure object isn't empty
    if (0 !== arrayObj.length) {
      const lastKey = arrayObj[arrayObj.length - 1][0]; // needed just so there are no additional EOLs at the end

      for (const items in menuObj) {
        menuData += `* ${capitalize(items)} Items *`;

        menuObj[items].map((item) => {
          const price = Number(item.pop().slice(1)); // meal price will always have $ in the front and be the last element of the array

          if (!Number.isNaN(price))
            menuData += `${EOL}$${adjustPrice(price, 1.8, 2)} ${item.join(
              ", "
            )}`;
        });

        if (lastKey !== items) menuData += `${EOL}${EOL}`;
      }
    }

    return menuData;
  })
  .then((data) => fs.writeFile(outputFilePath, data))
  .catch((err) => console.log(err))
  .finally(() => console.log("Program is finished"));
