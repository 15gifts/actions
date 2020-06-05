const core = require('@actions/core')
const editJsonFile = require('edit-json-file')

const filename = core.getInput('filename')
const keys = core.getInput('keys')
const values = core.getInput('values')

try {
  const file = editJsonFile(filename)
  const keysArray = keys.replace(' ', '').split(',')
  const valuesArray = values.replace(' ', '').split(',')
  
  keysArray.forEach((key, i) => file.set(key, valuesArray[i]))

  file.save()
}
catch (error) {
  core.setFailed(error.message)
}
