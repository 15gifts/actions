const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const {format} = require('date-fns');

//const packageFile = require(path.resolve('package.json'));

const generateReleaseData = (core) => {
  const version = core.getInput('version')
  const type = core.getInput('type')
  const rawComponents = core.getInput('components')
  const components = JSON.parse(rawComponents)
  const rawdeployment = core.getInput('deployment')
  const deployment = JSON.parse(rawdeployment)
  const releasePath = core.getInput('releasePath')

  const releaseJsonPath = [releasePath,'release.json'].join('/')
  //const deployFilePath = '.github/workflows/deploy_production.yml'
  const deployFilePath = [releasePath,'deploy_production.yml'].join('/')
  console.log(`deploy file: ${deployFilePath}`);
  const deployTemplateFilePath = '.github/workflows/deploy_production.template'
  console.log(`template file: ${deployTemplateFilePath}`);

  const data = {
    version,
    type,
    components,
    deployment,
    deployFilePath,
    deployTemplateFilePath,
    releaseJsonPath,
    releasePath
  }

  return data;
}

const createReleaseScript = async ({ version, components, deployment, deployFilePath, deployTemplateFilePath, releaseJsonPath, releasePath }) => {
    
    const deployHeader = generateHeader(version, components, deployment, releaseJsonPath, releasePath)
    const deployHeaderLines = [...deployHeader].join("\n")
    const deployTemplateLines = fs.readFileSync(deployTemplateFilePath,{encoding:'utf8'});

    fs.writeFileSync(deployFilePath, deployHeaderLines, 'utf8')

    fs.appendFileSync(deployFilePath, deployTemplateLines)

}

const generateHeader = (version, components, deployment, releaseJsonPath, releasePath) => {
  var headerLines = [];
  const dateTimeStamp = format(new Date(),'yyyy-MM-dd:HH:mm:SS')
  const cronDateTime = generateCronDateTime(deployment.date, deployment.time);
  headerLines.push(`name: Deploy_production\n`);
  headerLines.push(`#created ${dateTimeStamp}`);
  headerLines.push(`on:`);
  headerLines.push(`  schedule:`);
  headerLines.push(`    - cron: "${cronDateTime}"`);
  headerLines.push(`  workflow_dispatch:`);
  headerLines.push(`env:`);
  headerLines.push(`  RELEASE_VERSION: '${version}'`);
  headerLines.push(`  EVO: '${components.evo}'`);
  headerLines.push(`  CORE: '${components.core}'`);
  headerLines.push(`  FOX: '${components.fox}'`);
  headerLines.push(`  LEAP: '${components.leap}'`);
  headerLines.push(`  LEAP2: '${components.leap2}'`);
  headerLines.push(`  VINYL: '${components.vinyl}'`);
  headerLines.push(`  RELEASE_PATH: '${releasePath}'`);
  headerLines.push(`  RELEASE_JSON: '${releaseJsonPath}'\n`);
  return headerLines;
}

const generateCronDateTime = (date, time) => {
  const dates = date.split("/",3)
  const times = time.split(":",2)
  const cronDateTime = [ times[1], times[0], dates[2], dates[1], "*" ].join(" ")
  console.log(`cron date time ${cronDateTime}`);
  return cronDateTime;
}

const run = async () => {
  try {
    const releaseData = generateReleaseData(core)
    if(releaseData.deployment.status == 'scheduled' ) {
      await createReleaseScript(releaseData)
    }
    core.setOutput('deployFile', releaseData.deployFilePath)
    core.setOutput('evo', releaseData.components.evo)
    core.setOutput('core', releaseData.components.core)
    core.setOutput('fox', releaseData.components.fox)
    core.setOutput('leap', releaseData.components.leap)
    core.setOutput('leap2', releaseData.components.leap2)
    core.setOutput('vinyl', releaseData.components.vinyl)
    core.setOutput('status', releaseData.deployment.status)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
