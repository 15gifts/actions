const core = require('@actions/core')
const { exec } = require('@actions/exec')

const run = async () => {
  const changedFiles = core.getInput('changedFiles')

  console.log({ changedFiles })

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