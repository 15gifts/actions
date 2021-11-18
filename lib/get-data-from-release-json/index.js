const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const run = () => {
  try {
    const rawChangedFiles = core.getInput('changedFiles')
    const changedFiles = JSON.parse(rawChangedFiles)
    const releaseFilePath = changedFiles.find(filePath => filePath.includes(`release.json`));
    
    if (!releaseFilePath) {
      return core.setFailed(
        `No changes in release.json.`
      )
    }

    const rawReleaseFileContents = fs.readFileSync(releaseFilePath, { encoding: 'utf8'})
    
    const releaseFileData = JSON.parse(rawReleaseFileContents)

    //console.log({releaseFileData})

    const { version, type: rawType, components, deployment } = releaseFileData
    console.log(`version: ${version}`);
    console.log(`type: ${rawType}`);
    console.log(`component: ${components}`);
    console.log(`deployment: ${deployment}`);
//validation - need to check if version already exist, version for components are valid, date/time is > now
    if (!version) {
      return core.setFailed(
        `Version is not defined.`
      )
    }

    const type = rawType.toLowerCase()
    const hasValidType = ['project', 'hotfix', 'patch'].some(releaseType => type === releaseType)
    if (!type || !hasValidType) {
      return core.setFailed(
        `Could not find a valid type in the release.json file.`
      )
    }
    
    core.setOutput('version', version)
    core.setOutput('type', type)
    core.setOutput('components', components)
    core.setOutput('deployment', deployment)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()