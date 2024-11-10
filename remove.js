import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const git = simpleGit();
const path = './data.json';

// Function to remove commits after a specific date, considering any time on that date
const removeCommits = async (date) => {
  try {
    console.log(`Searching for commits after: ${date}`);

    // Convert the input date to the start of the day (00:00:00) in UTC
    const targetDateStart = moment(date).startOf('day').utc().format('YYYY-MM-DDTHH:mm:ss');

    // Get the commit logs for the date range (after the given date)
    const log = await git.log({ '--after': targetDateStart });

    // Log the commit history to see what is returned
    console.log('Commit history:', log.all);

    // Check if any commits exist after the given date
    if (log.all.length === 0) {
      console.log('No commits found after this date.');
      return;
    }

    // Find the last commit that is on or before the target date
    const commitToRemove = log.all[log.all.length - 1];  // The most recent commit after the date
    console.log(`Commit found to remove: ${commitToRemove.hash} on ${commitToRemove.date}`);

    // Rebase or reset to remove all commits after the identified commit
    console.log(`Removing commits after: ${commitToRemove.hash}`);

    // Perform the rebase to remove commits after the selected commit
    await git.rebase(['--onto', commitToRemove.hash, 'HEAD']);

    console.log(`Commits after ${commitToRemove.hash} have been removed successfully.`);
  } catch (err) {
    console.error('Error removing commits:', err);
  }
};

// Set the specific date for tracking commits (e.g., 2024-11-29)
const date = '2024-11-02'; // Set the specific date here (no need for specific time)


// Call the function to remove commits after the specific date
removeCommits(date);
