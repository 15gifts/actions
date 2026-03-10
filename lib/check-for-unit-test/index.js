const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)
    const rawAddedFiles = core.getInput('addedFiles')
    const addedFiles = JSON.parse(rawAddedFiles)

    console.log(`change file: ${changedFiles}`);
    console.log(`add file: ${addedFiles}`);

    const hasJSTestFile = addedFiles.some(filePath => filePath.match(/\w+\.test\.js$/)) ||
                          changedFiles.some(filePath => filePath.match(/\w+\.test\.js$/));
    const hasPerlTestFile = addedFiles.some(filePath => filePath.match(/\w+\.t$/)) ||
                            changedFiles.some(filePath => filePath.match(/\w+\.t$/));
    const hasPythonTestFile = addedFiles.some(filePath => filePath.match(/\w+\/test\w+\.py$/)) ||
                              changedFiles.some(filePath => filePath.match(/\w+\/test\w+\.py$/));

    const hasTestFile = hasJSTestFile || hasPerlTestFile || hasPythonTestFile;
    console.log(`has JS: ${hasJSTestFile} has Perl: ${hasPerlTestFile} has Python: ${hasPythonTestFile} hasTestFile: ${hasTestFile}`);

    if (!hasTestFile) {
      return core.setFailed(
        `A unit test could not be found. Please ensure you have created unit test for this change.`
      )
    }
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()