const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const getReleaseJsonData = async (releaseJsonFile) => {

  const rawReleaseFileContents = fs.readFileSync(releaseJsonFile, { encoding: 'utf8'})    
  const releaseFileData = JSON.parse(rawReleaseFileContents)
  const { version, type: rawType, components, deployment } = releaseFileData
  const type = rawType ? rawType.toLowerCase() : undefined
  const releasePath = path.dirname(releaseJsonFile)

  console.log(`version: ${version}`);
  console.log(`type: ${type}`);
  console.log(`component: ${components}`);
  console.log(`deployment: ${deployment}`);
  console.log(`release path: ${releasePath}`);

  const data = {
    version,
    type,
    components,
    deployment,
    releasePath,
    releaseFileData
  }

  return data;
}

const run = async () => {
  try {
    const releaseJsonFile = core.getInput('releaseJson')
    if (releaseJsonFile) {
      const releaseJsonData = await getReleaseJsonData(releaseJsonFile)
      if (releaseJsonData) {
        core.setOutput('version', releaseJsonData.version)
        core.setOutput('type', releaseJsonData.type)
        core.setOutput('components', releaseJsonData.components)
        core.setOutput('deployment', releaseJsonData.deployment)
        core.setOutput('releasePath', releaseJsonData.releasePath)
        core.setOutput('releaseJsonContent', JSON.stringify(releaseJsonData.releaseFileData))
        core.setOutput('status', JSON.stringify(releaseJsonData.deployment.status))
      }
    }
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()