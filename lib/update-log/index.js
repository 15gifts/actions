const { exec } = require('child_process');
const fs = require('fs')
const path = require('path')

const core = require('@actions/core')
const {format} = require('date-fns');

const run = () => {
  try {
    const file = core.getInput('file')
    const log = core.getInput('log')
    const error = core.getInput('error')
    const dateTimeStamp = format(new Date(),'yyyy-MM-dd:HH:mm:SS');
  
    var logLines = ""
    var errorLines = ""
  
    if(log){
      logLines = ["\n", dateTimeStamp, core.getInput('log')].join("\n")
      fs.appendFileSync(file, logLines)
    }
    if(error){
      errorLines = ["\n", `${dateTimeStamp} *****ERROR*****`, core.getInput('error')].join("\n")
      fs.appendFileSync(file, errorLines)
    }
  
    console.log(`log: ${logLines}`);
    console.log(`error: ${errorLines}`);
  }
  catch (error) {
    core.setFailed(error.message)
  }
}

run()
