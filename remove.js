import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const git = simpleGit();
const path = './data.json';

// Function to remove a specific commit by index on a given date
const removeCommits = async (commitIndex, date) => {
  try {
    console.log(`Searching for commits after: ${date}`);

    // Convert date to UTC format
    const targetDate = moment(date).utc().format('YYYY-MM-DDTHH:mm:ss');

    // Get the commit logs for the date range (after the given date)
    const log = await git.log({ '--after': targetDate });

    // Log the commit history to see what is returned
    console.log('Commit history:', log.all);

    // Check if any commits exist after the given date
    if (log.all.length === 0) {
      console.log('No commits found after this date.');
      return;
    }

    // Validate the commit index
    if (commitIndex > log.all.length || commitIndex <= 0) {
      console.log(`Invalid commit index. Please select an index between 1 and ${log.all.length}.`);
      return;
    }

    // Get the commit at the specified index (1-based index, so subtract 1 for 0-based array)
    const commitToRemove = log.all[commitIndex - 1];

    console.log(`Found commit: ${commitToRemove.hash} on ${commitToRemove.date}`);

    // Rebase or reset to remove this commit
    console.log(`Removing commit: ${commitToRemove.hash}`);
    
    // Perform the rebase to remove the commit
    await git.rebase(['--onto', 'HEAD', commitToRemove.hash]);

    console.log(`Commit ${commitToRemove.hash} has been removed successfully.`);
  } catch (err) {
    console.error('Error removing commit:', err);
  }
};

// Set the specific date and commit index (e.g., 1 commit on 2024-11-29)
const date = '2024-11-29T00:00:00'; // Set the specific date here
const commitIndex = 5; // The specific commit index you want to remove

// Call the function to remove the commit
removeCommits(commitIndex, date);
