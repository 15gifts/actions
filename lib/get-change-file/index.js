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
  
    const changeFiles = (
      await client.repos.compareCommits({
        ...context.repo,
        base,
        head
      })
    ).data.files.filter( async (f) => {
      if (f.status === 'added' && f.filename.includes('changes/')) {
        const copy = f.patch.replace(/(\r\n|\n|\r)/gm, "")

        const stuff = await client.request(`GET ${f.contents_url}`);

        console.log({stuff})
        console.log(f.filename, copy)
        return f.filename
      }
    });

    console.log({ changeFiles })

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