import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EOL } from "os";
import { calculateDistance } from "./mathHelpers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirPath = path.join(__dirname, "dataPoints");
const filePath = path.join(dirPath, "points.txt");

const closeFd = (fd) => {
  fs.close(fd, (err) => {
    if (err) throw err;
  });
};

const processInput = (inputs) => {
  const coordinates = inputs.slice(2); // [0] and [1] can be ignored
  const invalidCoordinates = coordinates.filter(
    (coordinate) => isNaN(parseFloat(coordinate)) // using parseFloat() just in cases inputs are decimal numbers
  );

  // check to make sure all inputs are numbers
  if (0 === invalidCoordinates.length) {
    const x1 = parseFloat(coordinates[0]);
    const x2 = parseFloat(coordinates[1]);
    const y1 = parseFloat(coordinates[2]);
    const y2 = parseFloat(coordinates[3]);
    const result = calculateDistance(x1, x2, y1, y2);

    const endMessage = `The distance between your two points: (${x1},${x2}), (${y1},${y2}) is ${result}`;
    console.log(endMessage);

    // check if the folder exists first
    fs.open(dirPath, (err) => {
      if (err && "ENOENT" === err.code) {
        // if the directory does not exist, create a folder using mkdir()
        fs.mkdir(dirPath, (err) => {
          if (err) return console.log(err);
          console.log(`New directory created`);
        });
      }

      // check if the file exists next
      fs.open(filePath, "wx", (err, fd) => {
        if (err) {
          if ("EEXIST" === err.code) {
            // file already exists
            try {
              fs.appendFile(filePath, `${endMessage}${EOL}`, (err) => {
                if (err) return console.log(err);
                console.log("Content saved");
              });
            } catch (err) {
              throw err;
            }
            return;
          }
          // output any other errors that may exist
          return console.log(err);
        } else {
          // file does not exist
          try {
            fs.writeFile(filePath, `${endMessage}${EOL}`, (err) => {
              if (err) return console.log(err);
              console.log("Content saved");
            });
          } finally {
            closeFd(fd);
          }
        }
      });
    });
  } else {
    const invalidMessage =
      1 === invalidCoordinates.length
        ? "The following input is invalid:"
        : "The following inputs are invalid:";
    console.log(`${invalidMessage} ${invalidCoordinates.join(", ")}`);
  }
};

processInput(process.argv);
