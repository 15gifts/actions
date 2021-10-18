const path = require('path')
const fs = require('fs')
const core = require('@actions/core')
const {format} = require('date-fns');
const { exec } = require('child_process');

const run = () => {
  try {
    const rawChanges = core.getInput('changes')
    const changes = JSON.parse(rawChanges)
    const tickets = core.getInput('tickets')
    //const tickets = JSON.parse(rawTickets)
    const tag = core.getInput('tag')
    const CHANGELOG_FILENAME = core.getInput('changelog')
    //const CHANGELOG_FILENAME = 'CHANGELOG.md'
    //const rawChanges = {"added":[],
    //                    "changed":["Update README.md @ 04/10 14:19"],
    //                    "deprecated":[],
    //                   "removed":[],
    //                    "fixed":[],
    //                    "security":[]}
    //const changes = JSON.parse(JSON.stringify(rawChanges))
    //const tickets = ["https://15gifts.atlassian.net/browse/SCALE-397"]
    //const tag = '3.0.1'

    const {execSync} = require('child_process');
    let new_tag = execSync('git describe --abbrev=0 --tags "$(git rev-list --tags --skip=1 --max-count=1)"');
    //let new_tag = execSync('git tag | sort -V | tail -1');

    //const { pkg } = JSON.parse(fs.readFileSync('./package.json'))
    //const { version } = require("./package.json");
    //let new_tag = version;
    console.log('new_tag:' + new_tag);

    const today =format(new Date(),'yyyy-MM-dd');

    const changeFilePath = find(filePath => filePath.includes(CHANGELOG_FILENAME));
    console.log('change file path: ' + changeFilePath);
    fs.readFile(CHANGELOG_FILENAME, { encoding: 'utf8' }, (error, data) => {
      let newLogs = data +
                    '\n## [' + new_tag + '] - ' + today + '\n';
      console.log('read file!' + newLogs);
      Object.entries(changes).forEach(([key, value]) => {
        if (`${value}`) {
          newLogs = newLogs + '### ' + `${key}` + '\n';
          newLogs = newLogs + '- ' + `${value}` + '\n';
        }
      });
      if (tickets.length) {
        newLogs = newLogs + '### tickets\n';
        Array.from(tickets).forEach(function(ticket){
          newLogs = newLogs + '- ' + ticket + '\n';
       });
        //tickets.forEach(function(ticket) {
        //  newLogs = newLogs + '- ' + ticket + '\n';
        //});
      }
      fs.writeFile(CHANGELOG_FILENAME, newLogs, 'utf8', (error) => { if (error) throw error; })  
    })
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
