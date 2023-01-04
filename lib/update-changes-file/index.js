const core = require('@actions/core')
const editJsonFile = require('edit-json-file')

const changeFile = core.getInput('changeFile')
const rawChangedFiles = core.getInput('filesModified')
const changedFiles = JSON.parse(rawChangedFiles)
const rawAddedFiles = core.getInput('filesAdded')
const addedFiles = JSON.parse(rawAddedFiles)

const generateChangedFiles = (changedFiles, addedFiles) => {
  var changedFileLines = []
  Object.values(changedFiles).forEach(changedFile => {
    changedFileLines.push(`${changedFile}`)
  })
  Object.values(addedFiles).forEach(addedFile => {
    changedFileLines.push(`${addedFile}`)
  })
  return changedFileLines
}

try {
  const file = editJsonFile(changeFile)
  const changedFileLines = generateChangedFiles(changedFiles, addedFiles)

  const filesChanged = [...changedFileLines].join(', ')
  console.log(`changed files: ${filesChanged}`)
  file.set('files', filesChanged)
  file.save()
}
catch (error) {
  core.setFailed(error.message)
}
