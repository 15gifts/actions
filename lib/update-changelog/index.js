const fs = require('fs')
const core = require('@actions/core')

const CHANGELOG_FILENAME = 'CHANGELOG.md'

const run = () => {
  try {
    const rawChanges = core.getInput('changes')
    const changes = JSON.parse(rawChanges)
    const rawTickets = core.getInput('tickets')
    const tickets = JSON.parse(rawTickets)

//const changes = 'change1'
//const tickets = 'ticket1'

var timeInMss = Date.now()

    fs.readFile(CHANGELOG_FILENAME, { encoding: 'utf8' }, (err, data) => {
    	const newLogs = data + '\n' + changes + '\n' + tickets + '\n';  
    	fs.writeFile(CHANGELOG_FILENAME, newLogs, 'utf8', err => {
  		if (err) {
    			console.error(err)
    			return
  		}
    	});
    })
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
