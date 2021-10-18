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
    const tickets = core.getInput('tickets')
    //const tickets = JSON.parse(rawTickets)
    const tag = core.getInput('tag')
    const CHANGELOG_FILENAME = core.getInput('changelog')
    const TAG = core.getInput('tag')
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

    //const {execSync} = require('child_process');
    //let new_tag = execSync('git describe --abbrev=0 --tags "$(git rev-list --tags --skip=1 --max-count=1)"');
 
    const today =format(new Date(),'yyyy-MM-dd');

    var path = require("path");
    var changelog_abspath = path.resolve(CHANGELOG_FILENAME);
    var packagejson = path.resolve('package.json');
    const packageFile = require(packagejson);
    var new_tag = packageFile.version;
    console.log('changelog path: ' + changelog_abspath);
    console.log('package json: ' + packagejson);
    console.log('version: ' + new_tag);

    fs.readFile(changelog_abspath, { encoding: 'utf8' }, (error, data) => {
      let newLogs = data +
                    '\n## [' + new_tag + '] - ' + today + '\n';
      Object.entries(changes).forEach(([key, value]) => {
        if (`${value}`) {
          newLogs = newLogs + '### ' + `${key}` + '\n';
          newLogs = newLogs + '- ' + `${value}` + '\n';
        }
      });

      Object.values(tickets).forEach(ticket => {
        newLogs = newLogs + '- ' + ticket + '\n';
      });
      //if (tickets.length) {
      //  newLogs = newLogs + '### tickets\n';
      //  if (tickets.isArray) {
      //    console.log('IS ARRAY');
      //    Array.from(tickets).forEach(function(ticket){
      //      newLogs = newLogs + '- ' + ticket + '\n';
      //    });
      //  } else {
      //    newLogs = newLogs + '- ' + tickets + '\n';
      //  }
    
        
        //Array.from(tickets).forEach(function(ticket){
        //  newLogs = newLogs + '- ' + ticket + '\n';
       //});
        //tickets.forEach(function(ticket) {
        //  newLogs = newLogs + '- ' + ticket + '\n';
        //});
      }
      console.log('before write!' + newLogs);
      fs.writeFile(changelog_abspath, newLogs, 'utf8', (error) => { if (error) throw error; })  
    })
    core.setOutput('changelog', changelog_abspath)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
