const { parse }           = require('svg-parser')
const fs                  = require('fs')
const HtmlElement         = require('./HtmlElement')
const { createComponent } = require('../command_generator/sharedCreateComponent')
const pixelWidth          = require('string-pixel-width');



const stylesByClassname = {
  'row': [
    {'display': 'flex'},
    {'flex-direction': 'row'}
  ],
  'col': [
    {'display': 'flex'},
    {'flex-direction': 'column'}
  ],
  'align-center': [
    {'align-items': 'center'}
  ],
  'justify-center': [
    {'justify-content': 'center'},
  ],
  'display-flex': [
    {'display': 'flex'},
  ]
}

const parseClassname = (classname) => {
  let styles = []
  
  for (const key in stylesByClassname) {
    if(classname.includes(key)) {
      styles = styles.concat(stylesByClassname[key])
    }
  }

  return styles
}

const parseRect = (rect) => {
  let styles = []
  let position = []
  
  for (const property in rect.properties) {
    switch (property) {
      case 'fill':
        styles.push({'background-color': rect.properties[property]})
        break;
      case 'height':
        styles.push({'height': `${rect.properties[property]}px`})
        break;
      case 'width':
        styles.push({'width': `${rect.properties[property]}px`})
        break;
      case 'rx':
        styles.push({'border-radius': `${rect.properties[property]}px`})
        break;
      case 'x':
        position.push(rect.properties[property])
        break;
      case 'y':
        position.push(rect.properties[property])
        break;
      default:
        break;
    }
  }

  return [styles, position]  
}

const parseStyles = (properties, rect=null) => {
  let styles = []
  let position = []
  
  for (const property in properties) {
    switch (property) {
      case 'fill':
        styles.push({'color': properties[property]})
        break;
      case 'font-family':
        styles.push({'font-family': properties[property]})
        break;
      case 'font-size':
        styles.push({'font-size': `${properties[property]}px`})
        break;
      case 'font-weight':
        styles.push({'font-weight': properties[property]})
        break;
      default:
        break;
    }
  }

  if (rect) {
    [stylesFromRect,  position] = parseRect(rect)

    styles = styles.concat(stylesFromRect)
  }

  if (properties.id) styles = styles.concat(parseClassname(properties.id))

  return [styles, position]
}

const getPossibleBackground = (childrens, key) => {
  switch (childrens[key].tagName) {
    case 'g':
      return childrens[key]?.children[0].tagName == 'rect' ? childrens[key]?.children[0] : null
    default:
      return null;
  }
}

const getWidthAndHeightFromText = (parsed) => {
  const isBold =  parsed.properties['font-weight'] != undefined
  const width  = pixelWidth(parsed.properties.id, { font: 'open sans', size: parsed.properties['font-size'], bold: isBold }) + 1;
  const height = parsed.properties['font-size']

  return [
    { 'width' : `${width}px`  },
    { 'height': `${height}px` },
    { 'line-height': `${height}px` }
  ]
}

const pushMarginLeftIfNeeded = (styles, position, parentPosition) => {
  const marginLeft = parentPosition ? position[0] - parentPosition[0] : null
  if (marginLeft && marginLeft != 0) {
    styles.push({ 'margin-left': `${marginLeft}px`})
  }
}

const getStyle = (styles, styleToGet) => {
  const style = styles.filter(style => Object.entries(style)[0][0] === styleToGet)[0]
  if (style) return Object.values(style)[0]
}

const pushMarginTopIfNeeded = (styles, position, parentPosition) => {
  const marginTop = parentPosition ? parseInt(position[1]) - parentPosition[1] : null
  if (marginTop && marginTop != 0) {
    styles.push({ 'margin-top': `${marginTop}px`})
  }
}

const parseElems = (parsed, parentHtmlElement, possibleBackground=null) => {  
  let nextHtmlElement
  if(parsed.type == 'element') {
    let [styles, position] = parseStyles(parsed.properties, possibleBackground)

    switch (parsed.tagName) {
      case 'g':
        nextHtmlElement = new HtmlElement('div', parsed.properties.id, styles, null, [], position)
        break;
      case 'text':
        position = [
          parsed.children[0].properties.x,
          parsed.children[0].properties.y - parsed.properties['font-size']
        ]
        const widthAndHeight = getWidthAndHeightFromText(parsed)
        parentHtmlElement.setPositionIfNeeded(position)
        parentHtmlElement.setWidthAndHeightIfNeeded(widthAndHeight.slice(0,2))
        styles.push(...widthAndHeight)
        pushMarginLeftIfNeeded(styles, position, [parentHtmlElement.x, parentHtmlElement.y])
        if( getStyle(parentHtmlElement.styles, 'align-items') == undefined) pushMarginTopIfNeeded(styles, position, [parentHtmlElement.x, parentHtmlElement.y])
        nextHtmlElement = new HtmlElement('div', 'text-field', styles, parsed.properties.id, [], position)
        break;
      case 'rect':
        if (parsed.properties.id != undefined) {
          [styles, position] = parseStyles([], parsed)
          nextHtmlElement = new HtmlElement('div', parsed.properties.id, styles, null, [], position)
        }
        break;
      default:
        break;
    }

    if(nextHtmlElement) parentHtmlElement.addChildren(nextHtmlElement)
  }

  if(parsed.children) {
    for (const key in parsed.children) {
      parseElems(
        parsed.children[key],
        nextHtmlElement ? nextHtmlElement : parentHtmlElement,
        getPossibleBackground(parsed.children, key)
      )
    }
  }
}

const file   = fs.readFileSync(__dirname + '/video_card.svg','utf-8')
const parsed = parse(file)

let htmlElement = new HtmlElement('root', null, null, null, [], [])
parseElems(parsed, htmlElement)
htmlElement.getPositionsFromChildren()
htmlElement.generateSpacingStyle()
const elementsString = htmlElement.generateHtml()
const stylesString = htmlElement.generateStylesSass()
createComponent(
  `./myapp/src/components/${htmlElement.getComponentName()}`,
  htmlElement.getComponentName(),
  fs.readFileSync('./command_generator/ComponentBoilerplate.js', 'utf-8'),
  fs.readFileSync('./command_generator/TestBoilerplate.test.js', 'utf-8'),
  null,
  elementsString
)
fs.writeFileSync(`./myapp/src/components/${htmlElement.getComponentName()}/${htmlElement.getComponentName()}.sass`, stylesString)
