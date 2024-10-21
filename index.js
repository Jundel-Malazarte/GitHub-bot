import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

const markCommit = async (x, y) => {
  const date = moment()
    .subtract(1, "y")
    .add(x, "w")
    .add(y, "d")
    .format("YYYY-MM-DDTHH:mm:ss"); // Generate ISO 8601 format date

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

  const x = random.int(0, 54); // Random week within a year (54 weeks)
  const y = random.int(0, 6);  // Random day within a week (6 days)

  await markCommit(x, y);
  console.log(`Commit ${201 - n} made with random date`);

  return makeCommits(n - 1); // Continue making commits
};

// Start making 200 commits
makeCommits(200);
