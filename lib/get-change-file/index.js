const core = require('@actions/core')
const { getOctokit, context } = require("@actions/github");

const run = async () => {
  try {
    const githubToken = core.getInput("github-token", { required: true });
      
    const client = getOctokit(githubToken);
  
    const [ base, head ] = (() => {
      const pr = context.payload.pull_request;
      return [pr.base.sha, pr.head.sha];
    })();
  
    const changedFileNames = (await client.repos.compareCommits({
      ...context.repo,
      base,
      head
    })).data.files.map(f => f.filename);

    console.log({ changedFileNames })

    core.setOutput("success", true);
  
    // const isAllIncluded = fileNames.every(fileName =>changedFileNames.includes(fileName));
  
    // if (isAllIncluded) {
    //   core.setOutput("success", true);
    // } else {
    //   core.setFailed(`
    //     Please check your changed files
    //     Expect: ${JSON.stringify(fileNames, null, 2)}
    //     Actual: ${JSON.stringify(changedFileNames, null, 2)}
    //   `);
    // }
  }
  catch (error) {
    core.setFailed(error.message)
  }

}

run()