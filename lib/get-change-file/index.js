
const { promises: fs } = require('fs')
const core = require('@actions/core')
const { exec } = require('@actions/exec')
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
  
    const changeFiles = (
      await client.repos.compareCommits({
        ...context.repo,
        base,
        head
      })
    ).data.files.filter( async (f) => {
      if (f.status === 'added' && f.filename.includes('changes/')) {
        
        let contents = await fs.readFile(f.filename, { encoding: 'utf8' })
        console.log(contents)
      }
    });


    // console.log({ changeFiles })

    core.setOutput("success", true);
  
    // const isAllIncluded = fileNames.every(fileName =>changeFiles.includes(fileName));
  
    // if (isAllIncluded) {
    //   core.setOutput("success", true);
    // } else {
    //   core.setFailed(`
    //     Please check your changed files
    //     Expect: ${JSON.stringify(fileNames, null, 2)}
    //     Actual: ${JSON.stringify(changeFiles, null, 2)}
    //   `);
    // }
  }
  catch (error) {
    core.setFailed(error.message)
  }

}

run()