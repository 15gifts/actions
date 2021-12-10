const path = require('path')
const core = require('@actions/core')

const packageFile = require(path.resolve('package.json'));

const run = async () => {
  try {
    const { version } = packageFile;
    console.log('Version: ' + version);

    core.setOutput('version', version)
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
