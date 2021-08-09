const fs = require('fs')

const myArgs   = process.argv.slice(2)
const repoPath = myArgs[0]

const foldersToCreate = [
  'src/assets',
  'src/assets/images',
  'src/assets/stylesheets',
  'src/components',
  'src/pages',
  'src/containers',
  'src/services'
]

styleSheetsToMove = [
  'App.css',
  'index.css'
]

filesToChange = [
  ['App.js', 1, "import './assets/stylesheets/App.css';"],
  ['index.js', 2, "import './assets/stylesheets/index.css';"]
]

for (const folder of foldersToCreate) {
  const path = `./${repoPath}/${folder}`
  if (!fs.existsSync(path)){
    fs.mkdirSync(path)
  }
}

for (const styleSheet of styleSheetsToMove) {
  if (fs.existsSync(`./${repoPath}/src/${styleSheet}`)){
    fs.renameSync(`./${repoPath}/src/${styleSheet}`, `./${repoPath}/src/assets/stylesheets/${styleSheet}`)
  }
} 

for (const entry of filesToChange) {
  const path = `./${repoPath}/src/${entry[0]}`
  if (fs.existsSync(path)){
    let file            = fs.readFileSync(path, 'utf8')
    let fileArray       = file.split('\n')
    fileArray[entry[1]] = entry[2]
    file                = fileArray.join('\n')

    fs.writeFileSync(path, file)
  }
} 
