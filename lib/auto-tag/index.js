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

    const { data, error } = await exec(tagCommand);
    if(!data) return core.setFailed(`Failed npm version: ${error}`)
    console.log(`Version update complete: ${data}`)

    //exec(tagCommand).then((data) => {
    //  console.log('version update complete: ', data)
    //})

    //const data = await exec(tagCommand);
    //if (!data) return core.setFailed(`Failed npm version.`)
    
    //    var packagejson = path.resolve('package.json');
    //    const packageFile = require(packagejson);
    //    var new_tag = packageFile.version;
    //    core.setOutput('tag', new_tag)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()