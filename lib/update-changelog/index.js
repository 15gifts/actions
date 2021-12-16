const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const {format} = require('date-fns');

//const packageFile = require(path.resolve('package.json'));

const generateChangelogData = (core) => {
  const newTag = core.getInput('tag')
  const rawChanges = core.getInput('changes')
  const changes = JSON.parse(rawChanges)
  const rawTickets = core.getInput('tickets')
  const tickets = JSON.parse(rawTickets)
  const repo = core.getInput('repo')
  const rawChangelogFilePath = core.getInput('changelog')
  const rawChangedFiles = core.getInput('changedFiles')
  const changedFiles = JSON.parse(rawChangedFiles)
  const rawAddedFiles = core.getInput('addedFiles')
  const addedFiles = JSON.parse(rawAddedFiles)

  const changelogFilePath = path.resolve(rawChangelogFilePath);
  const dateStamp = format(new Date(),'yyyy-MM-dd');
  //const dateStamp = "2021-12-16 23:05"
  const gitTagURL = `https://github.com/${repo}/releases/tag/v${newTag}`;

  const data = {
    changes,
    tickets,
    repo,
    newTag,
    changelogFilePath,
    dateStamp,
    gitTagURL,
    changedFiles,
    addedFiles
  }
  //return JSON.parse(data)
  return data;
}

const updateChangelog = async ({ dateStamp, changelogFilePath, changes, newTag, gitTagURL, tickets, changedFiles, addedFiles }) => {
    
    const changelogHeader = `\n## [[${newTag}](${gitTagURL})] - ${dateStamp}`;
    const changelogChanges = generateChanges(changes)
    const changelogTickets = generateTickets(tickets)
    const changelogChangedFiles = generateChangedFiles(changedFiles, addedFiles)
    const newEntryMarkdown = [changelogHeader, ...changelogChanges, ...changelogTickets, ...changelogChangedFiles].join("\n")
    
    console.log(newEntryMarkdown);
    if(!newEntryMarkdown){
      return core.setFailed(
      `No change log info to be added.`
      )
    }
    fs.appendFileSync(changelogFilePath, newEntryMarkdown)
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

const generateChangedFiles = (changedFiles, addedFiles) => {
  var changedFileLines = [];
  changedFileLines.push('### Files changed');
  Object.values(changedFiles).forEach(changedFile => {
    changedFileLines.push(`- ${changedFile}`);
  });
  Object.values(addedFiles).forEach(addedFile => {
    changedFileLines.push(`- ${addedFile}`);
  });
  return changedFileLines;
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
