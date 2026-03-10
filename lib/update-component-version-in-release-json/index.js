const fs = require('fs')
const core = require('@actions/core')

const run = async () => {
  try {
    const releaseJsonFilePath = core.getInput('release-json')
    const component = core.getInput('component')
    const version = core.getInput('version')
    console.log(`release json file: ${releaseJsonFilePath}`)
    if (component && version) {
      const releaseJsonFileData = JSON.parse(fs.readFileSync(releaseJsonFilePath, { encoding: 'utf8'}))
      const components = releaseJsonFileData.components
      components[component] = version
      releaseJsonFileData.components = components
      console.log(`updated release json: ${releaseJsonFileData}`)
      fs.writeFileSync(releaseJsonFilePath, JSON.stringify(releaseJsonFileData));
    }
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()