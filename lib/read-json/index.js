const fs = require('fs')
const core = require('@actions/core')

const run = async () => {
  try {
    const jsonFilePath = core.getInput('json-file')
    const jsonKey = core.getInput('json-key')
    const jsonFileData = JSON.parse(fs.readFileSync(jsonFilePath, { encoding: 'utf8'}))
    //if (jsonKey) {
    //  console.log(`key: ${jsonKey}`);
    //  console.log(JSON.stringify(jsonFileData[jsonKey]));
      //core.setOutput('json-contents', JSON.stringify(jsonFileData[jsonKey]))
    //  core.setOutput('json-contents', jsonFileData[jsonKey])
    //}
    //else {
      console.log(JSON.stringify(jsonFileData));
      core.setOutput('json-contents', jsonFileData)
    //}
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()