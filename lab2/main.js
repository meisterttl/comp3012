/* 
Do the following: node main.js 10 5 2 3
1. Your program will be run like you see in the box above. The format is: x1 y1 x2 y2
2. Have a file called **mathHelpers.js** which contains a squareRoot function, a square function, and a distance function which uses internally your squareRoot and square function to calculate distance. 
Export your distance function from this file. 
3. Have a file called main.js which uses process.argv to get the arguments passed in from the command prompt (terminal). 
Import your mathHelpers.js distance function into this file.
4. Inside your main.js, you should have a function called **processInput**, passing to it what the user typed in (5 4 3 2). 
**processInput** should take the userInput and *write it to a file* called points.txt. 
points.txt should be saved in a folder named dataPoints. 
The dataPoints folder does not exist so you will need to create it using the fs.mkdir function in Node. 
After having written to the file, show a message in the console stating: "Content saved" through console. 
5. After showing the "Content saved" message, you should use fs.appendFile to add the distance calculation to the end of your file. 
You must add the following message to the end of the file:
The distance between your two points: (10,5), (2,3) is <distance here>
*/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { EOL } from "os";
import process from "process";
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
          if (err) {
            return console.log(err);
          }

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
                if (err) {
                  return console.log(err);
                }

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

/*
Output: 

The distance between your two points: (10,10), (2,3) is 1
New directory created
Content saved

The distance between your two points: (10,5), (2,3) is 5.0990195135927845
Content saved
*/
