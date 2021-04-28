
const { promises: fs } = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context

const run = async () => {
  try {
    const token = core.getInput("github-token", { required: true });
    const client = new github.GitHub(token);

    const [ base, head ] = (() => {
      const pr = context.payload.pull_request;
      return [pr.base.sha, pr.head.sha];
    })();
  
    const changeFileData = await client.repos.compareCommits({
        ...context.repo,
        base,
        head
      })

    const isNewChangeFile = (file) => (file.status === 'added' && file.filename.includes('changes/'))
    const rawChangeFile = changeFileData.data.files.find(isNewChangeFile)

    // if (changeFiles.length > 1) core.setFailed('Too many change files discovered. Please merge the changes files into one.')
    if (!rawChangeFile) core.setFailed('A change file was not detected. Please create one.')
    else {

      const changeFileContents = await fs.readFile(rawChangeFile.filename, { encoding: 'utf8' });
      const changeFile = JSON.parse(changeFileContents)
      console.log(changeFile)

      if (!changeFile.incrementation) {
        core.setFailed('An incrementation type has not been set in the change file. Please add a valid incrementation type: major | minor | patch.')
      }
      else {
        core.setOutput('changeFile', changeFile)
        core.setOutput('incrementation', changeFile.incrementation)
        core.setOutput("success", true);
      }
    }
  }
  catch (error) {
    core.setFailed(error.message)
  }

}

run()