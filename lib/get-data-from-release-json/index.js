const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const getReleaseJson = (core) => {
  const rawAddedFiles = core.getInput('addedFiles')
  const addedFiles = JSON.parse(rawAddedFiles)
  const rawChangedFiles = core.getInput('changedFiles')
  const changedFiles = JSON.parse(rawChangedFiles)
  console.log(`changed file: ${changedFiles}`);
  console.log(`added file: ${addedFiles}`);
  var releaseFilePath = addedFiles.find(filePath => filePath.includes(`release.json`));
  if (!releaseFilePath) {
    releaseFilePath = changedFiles.find(filePath => filePath.includes(`release.json`));
  }

  if (!releaseFilePath) {
    return core.setFailed(
      `No changes in release.json.`
    )
  }
  return releaseFilePath;
}

const getReleaseJsonData = async (releaseJsonFile) => {

  const rawReleaseFileContents = fs.readFileSync(releaseJsonFile, { encoding: 'utf8'})    
  const releaseFileData = JSON.parse(rawReleaseFileContents)
  const { version, type: rawType, components, deployment } = releaseFileData
  const type = rawType.toLowerCase()
  const releasePath = path.dirname(releaseJsonFile)

  console.log(`version: ${version}`);
  console.log(`type: ${rawType}`);
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
      `Invalid type in the release.json file: project, hotfix or patch`
    )
  }

  const hasValidStatus = ['scheduled', 'cancelled', 'paused', 'deployed'].some(status => deployment.status === status)
  if (!deployment.status || !hasValidStatus) {
    return core.setFailed(
      `Invalid status in the release.json file: deploy, update or cancel`
    )
  }

}

const run = async () => {
  try {
    const releaseJsonFile = getReleaseJson(core)
    if(releaseJsonFile){
      const releaseJsonData = await getReleaseJsonData(releaseJsonFile)
      await ReleaseJsonDataValidation(releaseJsonData)

      core.setOutput('version', releaseJsonData.version)
      core.setOutput('type', releaseJsonData.type)
      core.setOutput('components', releaseJsonData.components)
      core.setOutput('deployment', releaseJsonData.deployment)
      core.setOutput('releasePath', releaseJsonData.releasePath)
      core.setOutput('releaseJsonContent', JSON.stringify(releaseJsonData.releaseFileData))
    }
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()