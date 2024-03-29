const fs = require('fs')
const { createComponent } = require(__dirname + '/sharedCreateComponent')

const myArgs               = process.argv.slice(2)
const repoPath             = myArgs[0] 
const componentName        = myArgs[1] 
const elements             = myArgs[2]?.split(',')
const isContainer          = componentName.includes('Container')

let componentBoilerplate = fs.readFileSync(__dirname + '/ComponentBoilerplate.js', 'utf-8')
let testBoilerplate      = fs.readFileSync(__dirname + '/TestBoilerplate.test.js', 'utf-8')

isContainer 
  ? createComponent(`./${repoPath}/src/containers/${componentName}`, componentName, componentBoilerplate, testBoilerplate, elements) 
  : createComponent(`./${repoPath}/src/components/${componentName}`, componentName, componentBoilerplate, testBoilerplate, elements)
