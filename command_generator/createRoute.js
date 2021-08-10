const { createComponent } = require('./sharedCreateComponent')

const fs = require('fs')

const myArgs     = process.argv.slice(2)
const repoPath   = myArgs[0] 
const routeName  = myArgs[1]
const path       = `./${repoPath}/src/pages/${routeName}`

if (!fs.existsSync(`./${repoPath}/src/settings.json`)) {
  fs.writeFileSync(`./${repoPath}/src/settings.json`, fs.readFileSync(__dirname + '/settings.json'))
}
const { routes } = JSON.parse(fs.readFileSync(`./${repoPath}/src/settings.json`, 'utf-8'))

let componentBoilerplate = fs.readFileSync(__dirname + '/ComponentBoilerplate.js', 'utf-8')
let testBoilerplate      = fs.readFileSync(__dirname + '/TestBoilerplate.test.js', 'utf-8')

const addRoutesToAppFile = (appBoilerPlate) => {
  const appBoilerplateArray = appBoilerPlate.split('\n')
  let initialImportLine     = 7
  let initialElemsLine      = 13

  for (const route of routes) {
    const importString = [ `import ${route} from './pages/${route}'` ]

    const elems = [
      `        <Route path="/${route.toLowerCase()}">`,
      `          <${route} />`,
      '        </Route>'
    ]
    appBoilerplateArray.splice(initialImportLine,'0', ...importString)
    appBoilerplateArray.splice(initialElemsLine,'0', ...elems)

    initialImportLine += 1
    initialElemsLine  += 4
  }
  appBoilerplateArray.splice(initialImportLine,'0', '')
  fs.writeFileSync(`./${repoPath}/src/App.js`, appBoilerplateArray.join('\n'))
}


let appBoilerPlate = fs.readFileSync(__dirname + '/AppBoilerplate.js', 'utf-8')
if(!routes.includes(routeName)) {
  routes.push(routeName)
  addRoutesToAppFile(appBoilerPlate)
  fs.writeFileSync(`./${repoPath}/src/settings.json`, JSON.stringify({ routes }))
  createComponent(path, routeName, componentBoilerplate, testBoilerplate, null)
}
