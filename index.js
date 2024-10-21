import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const markCommit = (x, y, callback) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format(); // Generate random date

  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    // Commit with custom date
    simpleGit()
      .add([path])
      .commit(date, { "--date": date, "--no-verify": true }, callback);
  });
};

const makeCommits = (n) => {
  if (n === 0) {
    return simpleGit().push(); // Push after all commits
  }

  const x = random.int(0, 54); // Random week within a year (54 weeks)
  const y = random.int(0, 6);  // Random day within a week (6 days)

  markCommit(x, y, () => {
    console.log(`Commit ${201 - n} made`);
    makeCommits(n - 1);
  });
};

// Start making 500 commits
makeCommits(500);
