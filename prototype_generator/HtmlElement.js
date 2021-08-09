const toComponentName = string => {
  string = string.charAt(0).toUpperCase() + string.slice(1)

  let tracePosition = string.indexOf('-')
  while(tracePosition != -1) {
    string = string.slice(0, tracePosition) + string.charAt(tracePosition + 1).toUpperCase() + string.slice(tracePosition + 2)
    
    tracePosition = string.indexOf('-')
  }
  
  if(string.includes(' ')) string =  string.slice(0, string.indexOf(' '))

  return string
} 

class HtmlElement {
  constructor(type, classname, styles, value, children, position){
    this.type      = type
    this.classname = classname
    this.value     = value
    this.children  = children
    this.styles    = styles
    
    if (position.length === 2) {
      this.x = position[0]
      this.y = position[1]
    }
  }

  setPositionIfNeeded(position) {
    if (this.x == undefined && this.y == undefined && position.length === 2) {
      this.x = position[0]
      this.y = position[1]
    }
  }

  setWidthAndHeightIfNeeded(widthAndHeigth){
    if (!this.getStyle(this.styles, 'width') && !this.getStyle(this.styles, 'heigth')) {
      this.styles.push(...widthAndHeigth)
    }
  }

  addChildren(htmlElement) {
    this.children.push(htmlElement)
  }

  generateClassname() {
    if (this.classname) {
      return ` className='${this.classname}'`
    } else {
      return ''
    }
  }

  generateChildrenOrValue(identation) {
    if (this.value){
      return `${' '.repeat(identation)}${this.value}`
    } else {
      return this.children.map(entry => entry.generateHtml(identation)).join('\n')
    }
  }

  spanString = (identation) => 
    `${' '.repeat(identation)}<${this.type}${this.generateClassname()}>` + 
    `${this.value}` +
    `</${this.type}>`

  divString = (identation) => 
    `${' '.repeat(identation)}<${this.type}${this.generateClassname()}>\n` + 
    `${this.generateChildrenOrValue(identation + 2)}\n` +
    `${' '.repeat(identation)}</${this.type}>`

  generateHtml(identation = 4) {
    switch (this.type) {
      case 'root':
        return this.generateChildrenOrValue(identation)
      case 'div':
        return this.divString(identation)
      case 'span':
        return this.spanString(identation)
    }
  }

  classnameSassString = (identation) =>
    `${' '.repeat(identation)}.${this.classname.replace(/ /g, '.')}\n`

  sassString = (identation, style) => {
    const [styleKey, styleValue] = Object.entries(style)[0]
    return `${' '.repeat(identation)}${styleKey}: ${styleValue}`
  }

  stylesSassString = (identation) => {
    if (this.styles) return this.styles.map(style => this.sassString(identation,style)).join('\n')
  }
    

  generateChildrenStyles(identation) {
    if(this.children)  return `${this.children.map(entry => entry.generateStylesSass(identation)).join('\n')}`
  }

  generateStylesSass(identation = 0) {
    let string = ''
    if(this.classname){
      string = string.concat(this.classnameSassString(identation))
      identation += 2
    }
    
    if (this.styles) {
      string = string.concat(`${this.stylesSassString(identation)}\n`)
    }
    
    return string.concat(`${this.generateChildrenStyles(this.type == 'root' ? 0 : identation)}`)
  }

  getComponentName() {
    return toComponentName(this.children[0].classname)
  }

  getStyle(styles, styleToGet) {
    const style = styles.filter(style => Object.entries(style)[0][0] === styleToGet)[0]
    if (style) return parseFloat(Object.values(style)[0])
  }

  calculateMarginDown(positionA, positionB) {
    return positionB[1] - (positionA[1] + positionA[3])
  }

  calculateMarginRight(positionA, positionB) {
    return positionB[0] - (positionA[0] + positionA[2])
  }
  
  addMarginRight(children, margin) {
    children.styles.push({'margin-right': `${margin}px`})
  }

  addMarginDown(children, margin) {
    children.styles.push({'margin-bottom': `${margin}px`})
  }

  calculateParentPositionForRow(firstChildren, lastChildren, height) {
    return [
      firstChildren[0],
      firstChildren[1],
      lastChildren[0] + (lastChildren[2] - firstChildren[0]),
      height
    ]
  }

  calculateParentPositionForCol(firstChildren, lastChildren, width) {
    return [
      firstChildren[0],
      firstChildren[1],
      width,
      lastChildren[1] + (lastChildren[3] - firstChildren[1])
    ]
  }

  getPositionsFromChildren() {
    for (const children of this.children) {
      children.getPositionsFromChildren()
    }
    
    const childrensPositions = this.children
      .map(entry => [entry.x, entry.y, this.getStyle(entry.styles, 'width'), this.getStyle(entry.styles, 'height')])
      .filter( array => array.filter( entry => entry != undefined).length === 4)
      
    if (this.classname && (this.x == undefined || this.y == undefined)){
      if (childrensPositions.length > 0) {
        let height;
        let width;
        
        if (this.classname.includes('row')) {
          [this.x, this.y, width, height] = this.calculateParentPositionForRow(
            childrensPositions[0],
            childrensPositions[childrensPositions.length - 1],
            Math.max(...childrensPositions.map( position => position[3]))
          )
        } else {
          [this.x, this.y, width, height] = this.calculateParentPositionForCol(
            childrensPositions[0],
            childrensPositions[childrensPositions.length - 1],
            Math.max(...childrensPositions.map( position => position[2]))
          )
        }

        if (!this.getStyle(this.styles, 'height')) this.styles.push({'height': `${height}px`}) 
        if (!this.getStyle(this.styles, 'width')) this.styles.push({'width': `${width}px`})
      }
    }    
  } 

  generateSpacingStyle() {
    const childrensPositions = this.children
      .map(entry => [entry.x, entry.y, this.getStyle(entry.styles, 'width'), this.getStyle(entry.styles, 'height')])
      .filter( array => array.filter( entry => entry != undefined).length === 4)

    if (childrensPositions.length > 1) {
      for (const key in this.children) {
        const intKey = parseInt(key)
        if (this.classname.includes('row')) {
          if (intKey + 1 < this.children.length) this.addMarginRight(this.children[key], this.calculateMarginRight(childrensPositions[key], childrensPositions[intKey + 1]))
        } else {
          if (intKey + 1 < this.children.length) this.addMarginDown(this.children[key], this.calculateMarginDown(childrensPositions[key], childrensPositions[intKey + 1]))
        }
      }
    }

    for (const children of this.children) {
      children.generateSpacingStyle()
    }
  }
}
 
module.exports = HtmlElement
