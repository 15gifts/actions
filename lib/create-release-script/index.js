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
  //const repo = core.getInput('repo')
  const deployFilePath = '.github/workflows/deploy_preproduction_' + version + '.yml'
  console.log(`release file: ${releaseFilePath}`);
  const deployConfigFilePath = '.github/workflows/' + version + '.config'
  console.log(`config file: ${releaseConfigFilePath}`);
  const deployTemplateFilePath = '.github/workflows/deploy_preproduction_template.yml'
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
    deployConfigFilePath,
    deployTemplateFilePath
  }

  return data;
}

const createReleaseScript = async ({ components, deployment, releaseFilePath, releaseConfigFilePath, deployTemplateFilePath }) => {
    
    const deployHeader = generateHeader(deployment)
    const deployHeaderLines = [...deployHeader].join("\n")
    const componentDeployments = generateDeployment(components)
    const componentDeploymentLines = [...componentDeployments].join("\n")
    const deployTemplateLines = readDeployPreproduction(deployTemplateFilePath)

    fs.writeFile(releaseConfigFilePath, componentDeploymentLines, 'utf8', (error) => { 
      if (error) {
        console.log(error);
        return core.setFailed(
          `Could not create config file.`
        )  
      }
    });

    fs.writeFile(releaseFilePath, deployHeaderLines, 'utf8', (error) => { 
      if (error) {
        console.log(error);
        return core.setFailed(
          `Could not create release script.`
        )  
      }
    }); 

    fs.appendFile(releaseFilePath, deployTemplateLines, (error) => {
      if (error) {
        console.log(error);
        return core.setFailed(
          `Could not append release script.`
        )  
      }
    });

}

const generateDeployment = (components) => {
  var deploymentLines = [];
  //deploymentLines.push('### deployment');
  Object.entries(components).forEach(([component, tag]) => {
    if (`${tag}`) {
      deploymentLines.push(`${component}:${tag}`);
    }
  });
  return deploymentLines;
}

const generateHeader = (deployment) => {
  var headerLines = [];
  const cronDateTime = generateCronDateTime(deployment.date, deployment.time);
  headerLines.push("name: Deploy_preproduction\n");
  headerLines.push("on");
  headerLines.push("\tschedule:");
  headerLines.push(`\t\t- cron: "${cronDateTime}"`);
  headerLines.push("\tworkflow_dispatch:");
  return headerLines;
}

const generateCronDateTime = (date, time) => {
  const dates = date.split("/",3)
  const times = time.split(":",2)
  const cronDateTime = [ times[1], times[0], dates[2], dates[1], "*" ].join(" ")
  console.log(`cron date time ${cronDateTime}`);
  return cronDateTime;
}

const readDeployPreproduction = (fileDeployPreproduction) => {
  var content;
  fs.readFile(fileDeployPreproduction, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      return core.setFailed(
      `Failed to read deploy_preproduction.yml template file.`
      )  
    }
    content = data;
    return content;
    //console.log(content);
  });
}

const run = async () => {
  try {
    const releaseData = generateReleaseData(core)

    await createReleaseScript(releaseData)

    core.setOutput('releaseScript', releaseData.releaseFilePath)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
