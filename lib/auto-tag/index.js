const path = require('path')
const core = require('@actions/core')
//const { exec } = require('@actions/exec')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

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
    
    const { stdout, stderr } = await exec(tagCommand);
    if(stderr) return core.setFailed(`Failed npm version: ${error}`)
    console.log(`Version update complete: ${stdout}`)
    core.setOutput('tag', stdout)

  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()