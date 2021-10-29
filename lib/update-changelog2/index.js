const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const {format} = require('date-fns');

//var packagejson = path.resolve('package.json');
//const packageFile = require(packagejson);
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
    // const changelogContents = await fs.readFileSync(changelogFilePath, { encoding: 'utf8' });

}

const generateChanges = (changes) => {
  var changeLines = [];
  Object.entries(changes).forEach(([changeType, changeString]) => {
    if (`${changeString}`) {
      changeLines.push(`### ${changeType}\n- ${changeString}`);
    }
  });
  return changeLines;
}

const generateTickets = (tickets) => {
  var ticketLines = [];
  ticketLines.push('### tickets\n');
  Object.values(tickets).forEach(ticket => {
    changeLines.push(`- ${ticket}\n`);
  });
}

const run = async () => {
  try {
    const changelogData = generateChangelogData(core)

    //console.table(changelogData)

    await updateChangelog(changelogData)

    // fs.readFile(changelogFilePath, { encoding: 'utf8' }, (error, data) => {
    //   let newLogs = data +
    //                 '\n## [' + newTag + '] (' + gitTagURL + ') - ' + today + '\n';
    //   Object.entries(changes).forEach(([key, value]) => {
    //     if (`${value}`) {
    //       newLogs = newLogs + '### ' + `${key}` + '\n';
    //       newLogs = newLogs + '- ' + `${value}` + '\n';
    //     }
    //   });
    //   newLogs = newLogs + '### tickets\n';
    //   Object.values(tickets).forEach(ticket => {
    //     newLogs = newLogs + '- ' + ticket + '\n';
    //   });

    //   fs.writeFile(changelogFilePath, newLogs, 'utf8', (error) => { if (error) throw error; })  
    //   //fs.readFile(changelog_abspath, { encoding: 'utf8' }, (error, data) => {
    //   //  console.log('read change log after write: ' + data);
    //   //})
    // })
    core.setOutput('changelog', changelogData.changelogFilePath)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
