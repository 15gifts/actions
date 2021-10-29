const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const {format} = require('date-fns');

const packageFile = require(path.resolve('package.json'));

const generateChangelogData = (core) => {
  const { version: newTag } = packageFile;

  const rawChanges = core.getInput('changes')
  const changes = JSON.parse(rawChanges)
  const rawTickets = core.getInput('tickets')
  const tickets = JSON.parse(rawTickets)
  const repo = core.getInput('repo')
  const rawChangelogFilePath = core.getInput('changelog')

  const changelogFilePath = path.resolve(rawChangelogFilePath);
  const dateStamp = format(new Date(),'yyyy-MM-dd');
  const gitTagURL = `https://github.com/${repo}/releases/tag/v${newTag}`;

  const data = {
    changes,
    tickets,
    repo,
    newTag,
    changelogFilePath,
    dateStamp,
    gitTagURL
  }

  //return JSON.parse(data)
  return data;
}

const updateChangelog = async ({ dateStamp, changelogFilePath, changes, newTag, gitTagURL, tickets }) => {
    
    const changelogHeader = `\n## [${newTag}] (${gitTagURL}) - ${dateStamp}`;
    const changelogChanges = generateChanges(changes)
    const changelogTickets = generateTickets(tickets)
    const newEntryMarkdown = [changelogHeader, ...changelogChanges, ...changelogTickets].join("\n")
    
    console.log(newEntryMarkdown);
    
    fs.appendFile(changelogFilePath, newEntryMarkdown, (error) => {
      if (error) {console.log(error);}
    });

}

const generateChanges = (changes) => {
  var changeLines = [];
  Object.entries(changes).forEach(([changeType, changeString]) => {
    if (`${changeString}`) {
      changeLines.push(`### ${changeType}`);
      Object.values(changeString).forEach(changeItem => {
        changeLines.push(`- ${changeItem}`);
      });
    }
  });
  return changeLines;
}

const generateTickets = (tickets) => {
  var ticketLines = [];
  ticketLines.push('### tickets');
  Object.values(tickets).forEach(ticket => {
    ticketLines.push(`- ${ticket}`);
  });
  return ticketLines;
}

const run = async () => {
  try {
    const changelogData = generateChangelogData(core)

    await updateChangelog(changelogData)

    core.setOutput('changelog', changelogData.changelogFilePath)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
