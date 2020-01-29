const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
const editJsonFile = require('edit-json-file');

const context = github.context
const token = core.getInput('github-token')
const octokit = new github.GitHub(token)

const filename = core.getInput('filename')
const keys = core.getInput('keys')
const values = core.getInput('values')

try {
  const file = editJsonFile(filename);
  keys
    .replace(' ', '')
    .split(',')
    .map((key, i) => file.set(key, values[i]))

  file.save()

} catch (error) {
  core.setFailed(error.message);
}
