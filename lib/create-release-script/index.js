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
  const repo = core.getInput('repo')
  //const releaseFilePath = '.github/workflows/deploytry.yml'
  var releaseFilePath = ['.github/workflows/deploytry',deployment.date,deployment.time].join("_")
  releaseFilePath = [releaseFilePath,'yml'].join(".")
  console.log(`release file: ${releaseFilePath}`);
  //const changelogFilePath = path.resolve(rawChangelogFilePath);
  //const dateStamp = format(new Date(),'yyyy-MM-dd');
  //const gitTagURL = `https://github.com/${repo}/releases/tag/v${newTag}`;

  const data = {
    version,
    type,
    components,
    deployment,
    releaseFilePath
  }

  return data;
}

const createReleaseScript = async ({ version, type, components, deployment, releaseFilePath }) => {
    
    const releaseHeader = generateHeader(deployment)
    const releaseDeployments = generateDeployment(components)
    const newEntryMarkdown = [...releaseHeader, ...releaseDeployments].join("\n")
    
    console.log(newEntryMarkdown);

    if(!newEntryMarkdown){
      return core.setFailed(
      `No release text.`
      )
    }

    //fs.appendFile(releaseFilePath, newEntryMarkdown, (error) => {
    //  if (error) {
    //    console.log(error);
    //    return core.setFailed(
    //      `Could not append change log.`
    //    )  
    //  }
    //});

    //fs.writeFile(releaseFilePath, newEntryMarkdown, 'utf8', (error) => { 
    //  if (error) {
    //    console.log(error);
    //    return core.setFailed(
    //      `Could not create release script.`
    //    )  
    //  }
    //});    

}

const generateDeployment = (components) => {
  var deploymentLines = [];
  deploymentLines.push('### deployment');
  Object.entries(components).forEach(([component, tag]) => {
    if (`${tag}`) {
      deploymentLines.push(`${component} : ${tag}`);
    }
  });
  return deploymentLines;
}

const generateHeader = (date, time) => {
  var headerLines = [];
  const cronDateTime = generateCronDateTime(date, time);
  headerLines.push("name: Deploy");
  headerLines.push("on");
  headerLines.push("\tschedule:");
  headerLines.push(`\t\t- cron: "${cronDateTime}"`);
  headerLines.push("\tworkflow_dispatch:");
  return headerLines;
}

const generateCronDateTime = (date, time) => {
  String dateStr = date.toString();
  String timeStr = time.toString();
  //var cronDateTime
  const dates = dateStr.split("/",3)
  const times = timeStr.split(":",2)
  const cronDateTime = [ times[1], times[0], dates[2], dates[1], "*" ].join(" ")
  console.log(`cron date time ${cronDateTime}`);
  return cronDateTime;
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
