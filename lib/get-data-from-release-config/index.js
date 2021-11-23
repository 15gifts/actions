const path = require('path')
const fs = require('fs')
const core = require('@actions/core')

const getConfigFilePath = (core) => {
  const version = core.getInput('version')
  const deployConfigFilePath = '.github/workflows/' + version + '.config'

  return deployConfigFilePath;
}

const getConfigData = async (deployConfigFilePath) => {

  const configFileContents = fs.readFileSync(deployConfigFilePath, { encoding: 'utf8'})    
  const configFileData = JSON.parse(configFileContents)
  const { evo, core, fox, leap, leap2, vinyl } = configFileData

  console.log(`evo: ${evo}`);
  console.log(`core: ${core}`);
  console.log(`fox: ${fox}`);
  console.log(`leap: ${leap}`);
  console.log(`leap2: ${leap2}`);
  console.log(`vinyl: ${vinyl}`);

  const data = {
    evo,
    core,
    fox,
    leap,
    leap2,
    vinyl
  }

  return data;
}

const run = async () => {
  try {
    const deployConfigFilePath = getConfigFilePath(core)
    const configData = await getConfigData(deployConfigFilePath)
    
    core.setOutput('evo', configData.evo)
    core.setOutput('core', configData.core)
    core.setOutput('fox', configData.fox)
    core.setOutput('leap', configData.leap)
    core.setOutput('leap2', configData.leap2)
    core.setOutput('vinyl', configData.vinyl)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()