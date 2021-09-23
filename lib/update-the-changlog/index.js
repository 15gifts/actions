const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const run = () => {
  try {
    const rawChanges = core.getInput('changes')
    const changes = JSON.parse(rawChanges)

    console.log(changes)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()