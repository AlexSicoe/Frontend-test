'use strict'

class PaintState {
  constructor() {
    /**
     * @type {{ color: string | CanvasGradient | CanvasPattern; size: number; join: CanvasLineJoin; }}
     */
    this.state = {
      color: 'red',
      size: 10,
      join: 'round'
    }
  }

  /**
   * @param {Partial<{ color: string | CanvasGradient | CanvasPattern; size: number; join: CanvasLineJoin; }>} nextState
   */
  setState(nextState) {
    this.state = { ...this.state, ...nextState }
  }
}

let paint = new PaintState()

let colors = [
  'red',
  'green',
  'blue',
  'cyan',
  'yellow',
  'orange',
  'magenta',
  'purple',
  'lightblue',
  'lightcoral',
  'lightseagreen',
  'lightgreen',
  'lightskyblue',
  'darkblue',
  'darkred',
  'darkmagenta',
  'darkorchid',
  'darkgoldenrod',
  'darkcyan',
  'darkorange',
  'darkviolet',
  'darkturquoise',
  'black',
  'gray',
  'white'
]

/** @param {Event} e */
function onSubmit(e) {
  e.preventDefault()

  /** @type {HTMLInputElement} */
  let widthInput = document.getElementById('width')
  /** @type {HTMLInputElement} */
  let heightInput = document.getElementById('height')

  widthInput.setCustomValidity('')
  if (!widthInput.checkValidity()) {
    widthInput.setCustomValidity(widthInput.validationMessage)
  }
  widthInput.setCustomValidity('')
  if (!heightInput.checkValidity()) {
    widthInput.setCustomValidity(heightInput.validationMessage)
  }

  let width = Number(widthInput.value)
  let height = Number(heightInput.value)
  console.log(`Canvas: (${width}, ${height})`)

  let painterDiv = document.createElement('div')
  painterDiv.id = 'painter'

  let palette = renderPalette()
  let canvas = renderCanvas(width, height)

  painterDiv.appendChild(palette)
  painterDiv.appendChild(canvas)
  document.body.appendChild(painterDiv)
  return true
}

function renderPalette() {
  let palette = document.getElementById('palette')
  if (!palette) {
    palette = document.createElement('div')
    palette.id = 'palette'

    let sizeDiv = renderSizeDiv()
    let joinDiv = renderJoinDiv()
    let colorsDiv = renderColorsDiv()

    palette.appendChild(sizeDiv)
    palette.appendChild(joinDiv)
    palette.appendChild(colorsDiv)
  }
  return palette
}

/**
 * @param {number} width
 * @param {number} height
 */
function renderCanvas(width, height) {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('canvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
  }

  /** @type {{ x: number; y: number; isDragging: boolean; paint: { color: string | CanvasGradient | CanvasPattern; size: number; join: CanvasLineJoin; }}[]} */
  let points = []

  /** @type {boolean} */
  let isPainting

  /**
   * @param {CanvasRenderingContext2D} context
   */
  function draw(context) {
    let curr = points[points.length - 1]
    context.strokeStyle = curr.paint.color
    context.lineJoin = curr.paint.join
    context.lineWidth = curr.paint.size

    context.beginPath()

    if (curr.isDragging && points.length > 1) {
      let last = points[points.length - 2]
      context.moveTo(last.x, last.y)
    } else {
      context.moveTo(curr.x - 1, curr.y)
    }
    context.lineTo(curr.x, curr.y)
    context.closePath()
    context.stroke()
  }

  canvas.id = 'canvas'
  canvas.width = width
  canvas.height = height

  let context = canvas.getContext('2d')

  canvas.onmousedown = (e) => {
    let x = e.pageX - canvas.offsetLeft
    let y = e.pageY - canvas.offsetTop
    isPainting = true
    let point = {
      x,
      y,
      isDragging: false,
      paint: paint.state
    }
    points.push(point)
    draw(context)
  }

  canvas.onmousemove = (e) => {
    let x = e.pageX - canvas.offsetLeft
    let y = e.pageY - canvas.offsetTop

    if (isPainting) {
      let point = {
        x,
        y,
        isDragging: true,
        paint: paint.state
      }
      points.push(point)
      draw(context)
    }
  }

  canvas.onmouseup = (e) => {
    isPainting = false
  }

  canvas.onmouseleave = (e) => {
    isPainting = false
  }

  return canvas
}

function renderSizeDiv() {
  let sizeDiv = document.createElement('div')
  sizeDiv.id = 'size'
  let text = document.createTextNode('Line size: ')
  let input = document.createElement('input')
  input.id = 'sizeInput'
  input.type = 'number'
  input.value = '10'
  input.min = '1'
  input.onchange = (e) => {
    // @ts-ignore
    paint.setState({ size: e.target.value })
  }
  sizeDiv.appendChild(text)
  sizeDiv.appendChild(input)
  return sizeDiv
}

function renderJoinDiv() {
  let joinDiv = document.createElement('div')
  joinDiv.id = 'join'
  let text = document.createTextNode('Line join: ')
  let select = document.createElement('select')
  select.id = 'joinInput'
  let round = document.createElement('option')
  let bevel = document.createElement('option')
  let miter = document.createElement('option')
  round.value = 'round'
  bevel.value = 'bevel'
  miter.value = 'miter'
  round.text = 'Round'
  bevel.text = 'Bevel'
  miter.text = 'Miter'
  select.options.add(round)
  select.options.add(bevel)
  select.options.add(miter)
  select.onchange = (e) => {
    // @ts-ignore
    paint.setState({ join: e.target.value })
  }
  joinDiv.appendChild(text)
  joinDiv.appendChild(select)
  return joinDiv
}

function renderColorsDiv() {
  let colorsDiv = document.createElement('div')
  colorsDiv.id = 'colors'

  for (let color of colors) {
    let colorButton = document.createElement('input')
    colorButton.type = 'button'
    colorButton.className = 'colorChoice'
    // @ts-ignore
    colorButton.style['background-color'] = color
    colorButton.onclick = (e) => {
      // @ts-ignore
      paint.setState({
        color: colorButton.style['background-color']
      })
    }
    colorsDiv.appendChild(colorButton)
  }
  return colorsDiv
}

module.exports = {
  renderCanvas,
  renderPalette,
  PaintState
}
