const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)
    const rawAddedFiles = core.getInput('addedFiles')
    const addedFiles = JSON.parse(rawAddedFiles)

    console.log(`change file: ${changedFiles}`);
    console.log(`add file: ${addedFiles}`);

    //const hasAddedTestFile = addedFiles.some(filePath => filePath.match(/test\/\w+\.test\.js/));
    //const hasAddedChangedFile = changedFiles.some(filePath => filePath.match(/test\/\w+\.test\.js/));
    //const hasAddedTestFile = addedFiles.some(filePath => 
    //  ( filePath.match(/\w+\.test\.js$/) ||
    //    filePath.match(/\w+\.t$/) ||
    //    filePath.match(/\w+\/test\w+\.py$/) ));
    
    //const hasChangedTestFile = changedFiles.some(filePath => 
    //      ( filePath.match(/\w+\.test\.js$/) ||
    //        filePath.match(/\w+\.t$/) ||
    //        filePath.match(/\w+\/test\w+\.py$/) ));

    const hasJSTestFile = addedFiles.some(filePath => filePath.match(/\w+\.test\.js$/)) ||
                          changedFiles.some(filePath => filePath.match(/\w+\.test\.js$/));
    const hasPerlTestFile = addedFiles.some(filePath => filePath.match(/\w+\.t$/)) ||
                            changedFiles.some(filePath => filePath.match(/\w+\.t$/));
    const hasPythonTestFile = addedFiles.some(filePath => filePath.match(/\w+\/test\w+\.py$/)) ||
                              changedFiles.some(filePath => filePath.match(/\w+\/test\w+\.py$/));

    //const hasAddedJSTestFile = addedFiles.some(filePath => filePath.match(/\w+\.test\.js$/));
    //const hasChangedJSTestFile = changedFiles.some(filePath => filePath.match(/\w+\.test\.js$/));
    //const hasAddedPerlTestFile = addedFiles.some(filePath => filePath.match(/\w+\.t$/));
    //const hasChangedPerlTestFile = changedFiles.some(filePath => filePath.match(/\w+\.t$/));
    //const hasAddedPythonTestFile = addedFiles.some(filePath => filePath.match(/\w+\/test\w+\.py$/));
    //const hasChangedPythonTestFile = changedFiles.some(filePath => filePath.match(/\w+\/test\w+\.py$/));
    //const hasTestFile = hasAddedJSTestFile || hasChangedJSTestFile || hasAddedPerlTestFile || hasChangedPerlTestFile ||
    //hasAddedPythonTestFile || hasChangedPythonTestFile;
    const hasTestFile = hasJSTestFile || hasPerlTestFile || hasPythonTestFile;
    //console.log(`has added: ${hasAddedTestFile} has changed: ${hasChangedTestFile} hasTestFile: ${hasTestFile}`);
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