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

  //const deployFilePath = '.github/workflows/deploy_production.yml'
  const deployFilePath = [releasePath,'deploy_production.yml'].join('/')
  console.log(`deploy file: ${deployFilePath}`);
  //const deployConfigFilePath = '.github/workflows/' + version + '.config'
  //console.log(`config file: ${deployConfigFilePath}`);
  const deployTemplateFilePath = '.github/workflows/deploy_production.template'
  console.log(`template file: ${deployTemplateFilePath}`);
  //const changelogFilePath = path.resolve(rawChangelogFilePath);
  //const dateStamp = format(new Date(),'yyyy-MM-dd');
  //const gitTagURL = `https://github.com/${repo}/releases/tag/v${newTag}`;

  const data = {
    version,
    type,
    components,
    deployment,
    deployFilePath,
    deployTemplateFilePath
  }

  return data;
}

const createReleaseScript = async ({ version, components, deployment, deployFilePath, deployConfigFilePath, deployTemplateFilePath }) => {
    
    const deployHeader = generateHeader(version, components, deployment)
    const deployHeaderLines = [...deployHeader].join("\n")
    //const componentDeployments = generateDeployment(components)
    //const componentDeploymentLines = [...componentDeployments].join("\n")
    //const componentDeploymentLines = JSON.stringify(components)
    //const deployTemplateLines = readDeployPreproduction(deployTemplateFilePath)
    const deployTemplateLines = fs.readFileSync(deployTemplateFilePath,{encoding:'utf8'});

    //fs.writeFile(deployConfigFilePath, componentDeploymentLines, 'utf8', (error) => { 
    //  if (error) {
    //    console.log(error);
    //    return core.setFailed(
    //      `Could not create config file.`
    //    )  
    //  }
    //});

    fs.writeFile(deployFilePath, deployHeaderLines, 'utf8', (error) => { 
      if (error) {
        console.log(error);
        return core.setFailed(
          `Could not create release script.`
        )  
      }
    }); 

    fs.appendFile(deployFilePath, deployTemplateLines, (error) => {
      if (error) {
        console.log(error);
        return core.setFailed(
          `Could not append release script.`
        )  
      }
    });

}

//const generateDeployment = (components) => {
//  var deploymentLines = [];
  //deploymentLines.push('### deployment');
//  Object.entries(components).forEach(([component, tag]) => {
//    if (`${tag}`) {
//      deploymentLines.push(`${component}:${tag}`);
//    }
//  });
//  return deploymentLines;
//}

const generateHeader = (version, components, deployment) => {
  var headerLines = [];
  const cronDateTime = generateCronDateTime(deployment.date, deployment.time);
  headerLines.push("name: Deploy_production\n");
  headerLines.push("on:");
  headerLines.push("  schedule:");
  headerLines.push(`    - cron: "${cronDateTime}"`);
  headerLines.push("  workflow_dispatch:");
  headerLines.push("env:");
  headerLines.push(`  RELEASE_VERSION: '${version}'`');
  headerLines.push(`  EVO: '${components.evo}'`);
  headerLines.push(`  CORE: '${components.core}'`);
  headerLines.push(`  FOX: '${components.fox}'`);
  headerLines.push(`  LEAP: '${components.leap}'`);
  headerLines.push(`  LEAP2: '${components.leap2}'`);
  headerLines.push(`  VINYL: '${components.vinyl}'\n`);
  return headerLines;
}

const generateCronDateTime = (date, time) => {
  const dates = date.split("/",3)
  const times = time.split(":",2)
  const cronDateTime = [ times[1], times[0], dates[2], dates[1], "*" ].join(" ")
  console.log(`cron date time ${cronDateTime}`);
  return cronDateTime;
}

//const readDeployPreproduction = (fileDeployPreproduction) => {
//  fs.readFile(fileDeployPreproduction, 'utf8', function (err, data) {
//    if (err) {
//      console.log(err);
//      return core.setFailed(
//      `Failed to read deploy_production.yml template file.`
//      )  
//    }
//    return data;
    //console.log(content);
//  });
//}

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
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
