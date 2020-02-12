const core = require('@actions/core')
const github = require('@actions/github')

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

try {
  const autoMerge = async () => {
    const base = core.getInput('base')

    const { payload: { ref } } = context
    const branch = ref.replace('refs/heads/', '')

    const [owner, repo] = context.payload.repository.full_name.split('/')
    const title = `PR ${branch} -> develop`

    const { data: prList } = await octokit.pulls.list({ owner, repo })
    const openedPr = prList.find(({ title: currentTitle }) => currentTitle === title)

    let mergeNumber

    if (!openedPr) {
      console.log('Opening PR')
      const { data: { number } = {} } = await octokit.pulls.create({
        head: branch,
        repo,
        owner,
        title,
        base,
      })
      mergeNumber = number
    }
    else {
      mergeNumber = openedPr.number
    }

    if (mergeNumber) {
      console.log('Merging PR')
      await octokit.pulls.merge({ repo, owner, pull_number: mergeNumber })
    }
  }
  autoMerge()
}
catch (error) {
  core.setFailed(error.message)
}
