import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

const markCommit = async (x, y) => {
  // Adjust the date logic to focus on the year 2021
  const date = moment()
    .year(2022) // Set year to 2021
    .startOf('year') // Start from January 1st, 2021
    .add(x, "w") // Add random weeks
    .add(y, "d") // Add random days
    .set({
      hour: random.int(0, 23),
      minute: random.int(0, 59),
      second: random.int(0, 59)
    }) // Add random time of day
    .format("YYYY-MM-DDTHH:mm:ss"); // Format as ISO 8601

  const data = {
    date: date,
  };

  await jsonfile.writeFile(path, data); // Write date to data.json

  // Make the commit with custom date
  await git.add([path]);
  await git.commit(`Commit for date ${date}`, { "--date": date, "--no-verify": true });
};

const makeCommits = async (n) => {
  if (n === 0) {
    console.log("All commits made, pushing to repository...");
    return git.push(); // Push after all commits
  }

  const x = random.int(0, 52); // Random week within 52 weeks (adjusted for 2021)
  const y = random.int(0, 6);  // Random day within the week

  await markCommit(x, y);
  console.log(`Commit ${101 - n} made with random date`);

  return makeCommits(n - 1); // Continue making commits
};

// Start making 100 commits
makeCommits(50);
