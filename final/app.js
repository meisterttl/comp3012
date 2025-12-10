import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { EOL } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const playersFilePath = path.join(__dirname, "players.csv");
const gamesFilePath = path.join(__dirname, "games.csv");
const Q1FilePath = path.join(__dirname, "q1.txt");
const Q2FilePath = path.join(__dirname, "q2.txt");

// By default, weight will be converted to kg
// Initial weight data are either "XXkg" or "XXlbs"
const convertWeight = (data, unit = "kg") => {
  const correctWeightUnit = data.endsWith(unit);
  const otherUnitLength = "kg" === unit ? -3 : -2;
  // If the unit is kg, then it will convert lbs which has 3 characters,
  // so unitLength for slice (when the unit is kg) should be -3

  const newWeight = correctWeightUnit
    ? Number(data.slice(0, -unit.length))
    : (() => {
        const weight = Number(data.slice(0, otherUnitLength));

        return "kg" === unit ? weight * 0.453 : weight * 2.205;
      })();

  return Math.round(newWeight);
};

// Initial height data follow "XfeetXinches"
// For now, it will all convert to cm
const convertHeight = (data) => {
  const feet = Number(data.charAt(0));
  const inches = Number(data.charAt(5));

  const heightInCm = feet * 12 * 2.54 + (inches & 2.54);

  return Math.round(heightInCm);
};

const convertStatString = (string) => string.slice(0, -1).split(",");

const getHeaviest = (data, n, gender) => {
  const newData =
    "" === gender
      ? data
      : data.filter(
          (each) => gender.toLowerCase() === each.gender.toLowerCase()
        );

  return newData.sort((a, b) => b.weight - a.weight).slice(0, n);
};

const getTallest = (data, n, country, gender) => {
  const newData = data.filter(
    (each) =>
      country.toLowerCase() === each.country.toLowerCase() &&
      gender.toLowerCase() === each.gender.toLowerCase()
  );

  return newData.sort((a, b) => b.height - a.height).slice(0, n);
};

const getHighestScorePlayer = (data, n, country, gender) => {
  const newData = data.filter(
    (each) =>
      country.toLowerCase() === each.country.toLowerCase() &&
      gender.toLowerCase() === each.gender.toLowerCase()
  );

  return newData.sort((a, b) => b.points - a.points).slice(0, n);
};

const heaviestOutput = (players, n, gender) => {
  const data = getHeaviest(players, n, gender);

  let output = "";

  data.map((each, index) => {
    const weightText =
      0 === index ? "(Heaviest Player)" : "(Next Heaviest Player)";

    output += `${each.first_name} ${each.last_name} - ${each.country} - ${each.weight}kg ${weightText}${EOL}`;
  });

  return output;
};

const tallestOutput = (players, n, country, gender) => {
  const data = getTallest(players, n, country, gender);

  const genderText = "m" === gender ? "male" : "female";
  const countryText = country.charAt(0).toUpperCase() + country.slice(1);
  let output = "";

  data.map((each, index) => {
    const textOutput = 0 === index ? "tallest" : "next tallest";

    output += `The ${textOutput} ${genderText} basketball player from ${countryText} is ${each.first_name} ${each.last_name}, ${each.height}cm tall.${EOL}`;
  });

  return output;
};

const processPlayerFile = async (filePath) => {
  const players = await fs.readFile(filePath, "utf8");
  const playersObj = players
    .split(EOL)
    .filter((row) => "" !== row)
    .filter((_, index) => 0 !== index) // header row from CSV, remove it
    .map((player) => {
      const [id, first_name, last_name, country, gender, age, weight, height] =
        player.split(",");

      return {
        id: Number(id),
        first_name,
        last_name,
        country,
        gender,
        age: Number(age),
        weight: convertWeight(weight),
        height: convertHeight(height),
      };
    });

  return playersObj;
};

const question1 = async (n = 1, gender = "") => {
  try {
    const playersObj = await processPlayerFile(playersFilePath);

    return heaviestOutput(playersObj, n, gender);
  } catch (error) {
    console.log(error);
  }
};

const question2 = async (n = 1, country, gender) => {
  try {
    const playersObj = await processPlayerFile(playersFilePath);

    return tallestOutput(playersObj, n, country, gender);
  } catch (error) {
    console.log(error);
  }
};

const question3 = async (n = 1, country, gender) => {
  try {
    const [players, gameStats] = await Promise.all([
      fs.readFile(playersFilePath, "utf8"),
      fs.readFile(gamesFilePath, "utf8"),
    ]);

    const playersObj = players
      .split(EOL)
      .filter((row) => "" !== row)
      .filter((_, index) => 0 !== index)
      .map((player) => {
        const [
          id,
          first_name,
          last_name,
          country,
          gender,
          age,
          weight,
          height,
        ] = player.split(",");

        return {
          id: Number(id),
          first_name,
          last_name,
          country,
          gender,
          age: Number(age),
          weight: convertWeight(weight),
          height: convertHeight(height),
          points: 0,
        };
      });

    const statsObj = gameStats
      .split(EOL)
      .filter((row) => "" !== row)
      .filter((_, index) => 0 !== index)
      .map((each) => {
        const [country, playerIDs, playerScores] = each.split(",[");

        const ids = convertStatString(playerIDs);
        const scores = convertStatString(playerScores);

        const playerStat = ids.map((playerId, index) => {
          const scoredPoints = scores[index] ? Number(scores[index]) : 0;

          return {
            id: Number(playerId),
            points: scoredPoints,
          };
        });

        return {
          name: country,
          score: playerStat,
        };
      });

    statsObj.forEach((country) => {
      country.score.forEach((pointScored) => {
        const matchingPlayer = playersObj.find(
          (player) => pointScored.id === player.id
        );
        matchingPlayer.points = matchingPlayer.points + pointScored.points;
      });
    });

    const findPlayer = getHighestScorePlayer(playersObj, n, country, gender);
    console.log(findPlayer);
  } catch (error) {
    console.log(error);
  }
};

question1(5, "m").then((data) => fs.writeFile(Q1FilePath, data));
question2(1, "china", "f").then((data) => fs.writeFile(Q2FilePath, data));
question3(1, "canada", "m");
