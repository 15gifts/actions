const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const getReleaseJson = (core) => {
  const rawChangedFiles = core.getInput('changedFiles')
  const changedFiles = JSON.parse(rawChangedFiles)
  const releaseFilePath = changedFiles.find(filePath => filePath.includes(`release.json`));
    
  if (!releaseFilePath) {
    return core.setFailed(
      `No changes in release.json.`
    )
  }

  return releaseFilePath;
}

const getReleaseJsonData = async ({ releaseJsonFile }) => {
    
  const rawReleaseFileContents = fs.readFileSync(releaseJsonFile, { encoding: 'utf8'})    
  const releaseFileData = JSON.parse(rawReleaseFileContents)
  const { version, type: rawType, components, deployment } = releaseFileData
  const type = rawType.toLowerCase()

  console.log(`version: ${version}`);
  console.log(`type: ${rawType}`);
  console.log(`component: ${components}`);
  console.log(`deployment: ${deployment}`);

  const data = {
    version,
    type,
    components,
    deployment
  }

  return data;
}

const ReleaseJsonDataValidation = async ({ version, type, components, deployment }) => {
    
//validation - need to check if version already exist, version for components are valid, date/time is > now
  if (!version) {
    return core.setFailed(
      `Version is not defined.`
    )
  }
    
  const hasValidType = ['project', 'hotfix', 'patch'].some(releaseType => type === releaseType)
  if (!type || !hasValidType) {
    return core.setFailed(
      `Could not find a valid type in the release.json file.`
    )
  }

}

const run = async () => {
  try {
    const releaseJsonFile = getReleaseJson(core)

    const releaseJsonData = await getReleaseJsonData(releaseJsonFile)
    await ReleaseJsonDataValidation(releaseJsonData)

    //core.setOutput('changelog', changelogData.changelogFilePath)
    core.setOutput('version', releaseJsonData.version)
    core.setOutput('type', releaseJsonData.type)
    core.setOutput('components', releaseJsonData.components)
    core.setOutput('deployment', releaseJsonData.deployment)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()