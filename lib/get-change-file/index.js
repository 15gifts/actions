
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
    
    const changeFiles = changeFileData.data.files.filter(async (f) => {
      if (f.status === 'added' && f.filename.includes('changes/')) {
        return await fs.readFile(f.filename, { encoding: 'utf8' });
      }
    });

    // if (changeFiles.length > 1) core.setFailed('Too many change files discovered. Please merge the changes files into one.')
    if (!changeFiles || changeFiles.length === 0) core.setFailed('No change file detected. Please create one.')
    else {
      const changeFile = JSON.parse(changeFiles[0]);

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