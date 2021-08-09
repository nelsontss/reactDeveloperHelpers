const fs = require('fs')

const insertElements = (componentBoilerplate, elements) => {
  const componentBoilerplateArray = componentBoilerplate.split('\n')
  componentBoilerplateArray.splice(6,1)

  for (const element of elements.reverse()) {
    componentBoilerplateArray.splice(6, 0, `      <${element}></${element}>`);
  }

  return componentBoilerplateArray.join('\n')
}

const insertElementsString = (componentBoilerplate, elementsString) => {
  const componentBoilerplateArray = componentBoilerplate.split('\n')
  
  componentBoilerplateArray.splice(5, 1)
  componentBoilerplateArray.splice(6, 1)
  componentBoilerplateArray.splice(5, 1, elementsString);

  return componentBoilerplateArray.join('\n')
}

const createPackageJson = (path, componentName) => {
  fs.writeFileSync(`${path}/package.json`, `{\n  "main": "${componentName}.js"\n}`)
}

const createComponent = (path, componentName, componentBoilerplate, testBoilerplate, elements, elementsString=null) => {
  if (!fs.existsSync(path)){
    fs.mkdirSync(path)

    if(elements) componentBoilerplate = insertElements(componentBoilerplate, elements)
    if(elementsString) componentBoilerplate = insertElementsString(componentBoilerplate, elementsString)
    
    componentBoilerplate = componentBoilerplate.replace(/ComponentBoilerplate/g, componentName)
    testBoilerplate = testBoilerplate.replace(/ComponentBoilerplate/g, componentName)

    fs.writeFileSync(`${path}/${componentName}.js`, componentBoilerplate)
    fs.writeFileSync(`${path}/${componentName}.test.js`, testBoilerplate)
    createPackageJson(path, componentName)
  }
}

module.exports.createComponent = (path, name, componentBoilerplate, testBoilerplate, elements, elementsString) => createComponent(path, name, componentBoilerplate, testBoilerplate, elements, elementsString)
