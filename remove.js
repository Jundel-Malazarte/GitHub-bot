import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';

const git = simpleGit();
const path = './data.json';

const removeCommitsOnSpecificDay = async (date) => {
  try {
    console.log(`Removing commits on: ${date}`);

    // Get the commit logs for the specific date
    const log = await git.log({ '--after': date, '--before': moment(date).add(1, 'day').format('YYYY-MM-DD') });

    // Check if any commits exist for that date
    const commits = log.all.filter(commit => commit.date.includes(date));

    if (commits.length === 0) {
      console.log('No commits found on this date.');
      return;
    }

    console.log(`Found ${commits.length} commits on ${date}.`);

    // Loop through each commit and reset to the commit before it
    for (const commit of commits) {
      console.log(`Removing commit: ${commit.hash}`);
      // Use git rebase or reset as needed
      await git.rebase(['--onto', 'HEAD', commit.hash]);
      // Or if you want to reset, you can use this:
      // await git.reset(['--hard', commit.hash]);
    }

    console.log(`Commits on ${date} have been removed successfully.`);
  } catch (err) {
    console.error('Error removing commits:', err);
  }
};

// Set the specific date you want to remove commits for (example: '2024-11-29')
const date = '2024-12-10T00:00:00'; 
removeCommitsOnSpecificDay(date);
