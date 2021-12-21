const core = require('@actions/core')
const editJsonFile = require('edit-json-file')

const changeFile = core.getInput('changeFile')
const filesModified = core.getInput('filesModified')
const filesAdded = core.getInput('filesAdded')

try {
  const file = editJsonFile(changeFile)
  const filesChanged = [filesModified, filesAdded].join(",")
  console.log(`changed files: ${filesChanged}`);
  file.set("files", filesChanged)
  file.save()
}
catch (error) {
  core.setFailed(error.message)
}
