const core = require('@actions/core')
const { exec } = require('@actions/exec')

const run = async () => {
  const rawChangedFiles = core.getInput('changedFiles')
  const changedFiles = JSON.parse(rawChangedFiles)

  const hasChangeFile = changedFiles.some(filePath => filePath.includes(`.changes`));

  if (!hasChangeFile) {
    return core.setFailed(
      `A change file could not be found. Please ensure you have created and filled out a change file.`
    )
  }

  // try {
  //   if (!versionType) {
  //     return core.setFailed(
  //       `You must provide a valid incrementation type: [major | minor | patch | premajor | preminor | prepatch | prerelease]`
  //     )
  //   }

  //   let tagCommand;
  //   if (languageUsed === 'javascript') {
  //     exec(tagCommand).then((data) => {
  //       console.log('version update complete: ', data)
  //     })
  //     tagCommand = `npm version ${versionType}`
  //   }

  //   if (languageUsed === 'python') {
  //     return core.setFailed(
  //       `Python tagging method not currently implemented`
  //     )
  //   }

  //   if (!tagCommand) {
  //     return core.setFailed(
  //       `A tagging convention has not been setup for language: ${languageUsed}`
  //     )
  //   }

  //   exec(tagCommand).then((data) => {
  //     console.log('version update complete: ', data)
  //   })
  // }
  // catch (error) {
  //   core.setFailed(error.message)
  // }

}

run()