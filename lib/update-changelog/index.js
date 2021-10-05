const fs = require('fs')
const core = require('@actions/core')
const {format} = require('date-fns');

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

    const today =format(new Date(),'yyyy-MM-dd');

    fs.readFile(CHANGELOG_FILENAME, { encoding: 'utf8' }, (error, data) => {
      let newLogs = data +
                    '\n## [' + tag + '] - ' + today + '\n';
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
