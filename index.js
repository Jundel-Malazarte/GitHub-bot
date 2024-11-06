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
    .year(year) // Set specific year
    .month(month - 1) // Months are 0-indexed, so subtract 1 for correct month
    .date(day) // Set specific day of the month
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

// makeCommits accepts n (number of commits) and year, month, day for manual input
const makeCommits = async (n, year, month, day) => {
  if (n === 0) {
    console.log("All commits made, pushing to repository...");
    return git.push(); // Push after all commits
  }

  // Call markCommit with manually set year, month, and day
  await markCommit(year, month, day);
  console.log(`Commit ${40 - n} made with date ${year}-${month}-${day}`); // Show commit number and date

  return makeCommits(n - 1, year, month, day); // Continue making commits with the same date
};

// Start making commits -- set your commit year, month, and day
makeCommits(40, 2024, 11, 8); // Example: making 250 commits with the date Jan 1, 2024
// Commits, year, month, and day can be adjusted as needed.