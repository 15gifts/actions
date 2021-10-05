const core = require('@actions/core')
const { exec } = require('@actions/exec')

const run = async () => {
  const versionType = core.getInput('incrementation')
  const languageUsed = core.getInput('language');

  try {
    if (!versionType) {
      return core.setFailed(
        `You must provide a valid incrementation type: [major | minor | patch | premajor | preminor | prepatch | prerelease]`
      )
    }

    let tagCommand;
    if (languageUsed === 'javascript') {
      tagCommand = `npm version ${versionType}`
    }

    if (languageUsed === 'python') {
      return core.setFailed(
        `Python tagging method not currently implemented`
      )
    }

    if (!tagCommand) {
      return core.setFailed(
        `A tagging convention has not been setup for language: ${languageUsed}`
      )
    }

    //exec(tagCommand).then((data) => {
    //  console.log('version update complete: ', data)
    //})

    const { tag, error } = await exec(tagCommand);
    console.log(`tag: ${tag}`);

    core.setOutput('tag', tag)
  }

  catch (error) {
    core.setFailed(error.message)
  }

}

run()