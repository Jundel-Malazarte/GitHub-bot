import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const markCommit = (x, y) => {
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();

  const data = {
    date: date,
  };

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (n) => {
  if (n === 0) {
    return simpleGit().push(); // Push after all commits are done
  }

  const x = random.int(0, 54);  // Random week within a year (54 weeks)
  const y = random.int(0, 6);   // Random day within a week (6 days)
  const date = moment()
    .subtract(1, "y")
    .add(x, "w")
    .add(y, "d")
    .format();  // Generate random date

  const data = {
    date: date,
  };
  
  console.log(`Commit ${201 - n}: ${date}`);

  jsonfile.writeFile(path, data, () => {
    // Commit with a random date and recursively call to make more commits
    simpleGit().add([path]).commit(date, { "--date": date }, () => {
      makeCommits(n - 1);
    });
  });
};

// Start making 200 commits
makeCommits(500);
