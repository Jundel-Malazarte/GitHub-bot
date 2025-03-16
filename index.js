import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const git = simpleGit();
const path = "./data.json";

// markCommit now accepts year, month, and day
const markCommit = async (year, month, day) => {
  // Adjust the date logic to use the specified year, month, and day
  const date = moment()
  .year(year)
  .month(month - 1)
  .date(day)
  .set({
    hour: random.int(0, 23),
    minute: random.int(0, 59),
    second: random.int(0, 59)
  })
  .format("YYYY-MM-DD HH:mm:ss"); // Correct date format | Format as ISO 8601

  const data = {
    date: date,
  };

  await jsonfile.writeFile(path, data); // Write date to data.json

  // Make the commit with custom date
  await git.add([path]);
  // Commit with the specified date
  await git.commit(`Commit for date ${date}`, { "--date": `"${date}"` });
  await git.push(); // Push the commit to the remote repository
};

// makeCommits accepts n (number of commits) and year, month, day for manual input
const makeCommits = async (n, year, month, day) => {
  if (n === 0) {
    console.log("All commits made.");
    return;
  }

  // Call markCommit with manually set year, month, and day
  await markCommit(year, month, day);
  // Set the specific commits
  console.log(`Commit ${11-n} made with date ${year}-${month}-${day}`); // Show commit number and date

  return makeCommits(n - 1, year, month, day); // Continue making commits with the same date
};

// Start making commits -- set your commit year, month, and day
makeCommits(10, 2025, 3, 16); // Example: making commits with the date Jan 1, 2024
// Commits, year, month, and day can be adjusted as needed.