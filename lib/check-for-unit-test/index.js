const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)
    const rawAddedFiles = core.getInput('addedFiles')
    const addedFiles = JSON.parse(rawAddedFiles)

    console.log(`change file: ${changedFiles}`);
    console.log(`add file: ${addedFiles}`);

    const hasAddedTestFile = addedFiles.some(filePath => filePath.match(/test\/\w+\.test\.js/));
    const hasAddedChangedFile = changedFiles.some(filePath => filePath.match(/test\/\w+\.test\.js/));
    const hasTestFile = hasAddedTestFile || hasAddedChangedFile;
    console.log(`has added: ${hasAddedTestFile} has changed: ${hasAddedChangedFile} hasTestFile: ${hasTestFile}`);
    return core.setFailed(`stopped`)
    //const hasChangeFile = changedFiles.some(filePath => filePath.includes(`.changes`));

    //if (!hasChangeFile) {
    //  return core.setFailed(
    //    `A unit test could not be found. Please ensure you have created unit test for this change.`
    //  )
    //}
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()