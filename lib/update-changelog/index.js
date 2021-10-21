const path = require('path')
const fs = require('fs')
//const packageFile = require('./package.json');
const core = require('@actions/core')
const {format} = require('date-fns');
const { exec } = require('child_process');

const run = () => {
  try {
    const rawChanges = core.getInput('changes')
    const changes = JSON.parse(rawChanges)
    const rawTickets = core.getInput('tickets')
    const tickets = JSON.parse(rawTickets)
    const new_tag = core.getInput('tag')
    const repo = core.getInput('repo')
    const CHANGELOG_FILENAME = core.getInput('changelog')

    const today =format(new Date(),'yyyy-MM-dd');
    //var git_link = 'https://github.com/15gifts/' + repo + '/releases/tag/' + new_tag
    var git_link = 'https://github.com/' + repo + '/releases/tag/' + new_tag

    var path = require("path");
    var changelog_abspath = path.resolve(CHANGELOG_FILENAME);
    console.log('changelog path: ' + changelog_abspath);
    console.log('version: ' + new_tag);
    console.log('repo: ' + repo);
    console.log('tag link: ' + git_link);

    fs.readFile(changelog_abspath, { encoding: 'utf8' }, (error, data) => {
      let newLogs = data +
                    '\n## [' + new_tag + '] (' + git_link + ') - ' + today + '\n';
      Object.entries(changes).forEach(([key, value]) => {
        if (`${value}`) {
          newLogs = newLogs + '### ' + `${key}` + '\n';
          newLogs = newLogs + '- ' + `${value}` + '\n';
        }
      });
      newLogs = newLogs + '### tickets\n';
      Object.values(tickets).forEach(ticket => {
        newLogs = newLogs + '- ' + ticket + '\n';
      });

      fs.writeFile(changelog_abspath, newLogs, 'utf8', (error) => { if (error) throw error; })  
      //fs.readFile(changelog_abspath, { encoding: 'utf8' }, (error, data) => {
      //  console.log('read change log after write: ' + data);
      //})
    })
    core.setOutput('changelog', changelog_abspath)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
