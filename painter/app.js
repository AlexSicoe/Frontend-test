'use strict'

/**
 * @type {{ color: string | CanvasGradient | CanvasPattern ; lineWidth: number ; lineJoin: CanvasLineJoin; }}
 */
let paintState = {
  color: 'red',
  lineWidth: 10,
  lineJoin: 'round'
}

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

  let palette = generatePalette()
  let canvas = generateCanvas(width, height)
  let painter = document.createElement('div')
  painter.id = 'painter'
  painter.appendChild(palette)
  painter.appendChild(canvas)
  document.body.appendChild(painter)
  return true
}

function generatePalette() {
  let palette = document.getElementById('palette')
  if (!palette) {
    palette = document.createElement('div')
    palette.id = 'palette'
    for (let color of colors) {
      let button = document.createElement('input')
      button.type = 'button'
      button.className = 'colorChoice'
      // @ts-ignore
      button.style['background-color'] = color
      button.onclick = (e) => {
        // @ts-ignore
        let nextColor = button.style['background-color']
        paintState.color = nextColor
      }
      palette.appendChild(button)
    }
  }
  return palette
}

/**
 * @param {number} width
 * @param {number} height
 */
function generateCanvas(width, height) {
  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('canvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
  }

  // objs {x,y,isdragging,color}
  let points = []

  /** @type {boolean} */
  let isPainting

  /**
   * @param {{ color: string | CanvasGradient | CanvasPattern ; lineWidth: number ; lineJoin: CanvasLineJoin; }} paintState
   */
  function redraw(paintState) {
    if (!context) {
      throw new Error('inexistent context')
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.strokeStyle = paintState.color
    context.lineJoin = paintState.lineJoin
    context.lineWidth = paintState.lineWidth

    for (let i = 0; i < points.length; i++) {
      context.beginPath()
      if (points[i].isDragging && i) {
        context.moveTo(points[i - 1].x, points[i - 1].y)
      } else {
        context.moveTo(points[i].x - 1, points[i].y)
      }
      context.lineTo(points[i].x, points[i].y)
      context.closePath()
      context.stroke()
    }
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
      isDragging: false
    }
    points.push(point)
    redraw(paintState)
  }

  canvas.onmousemove = (e) => {
    let x = e.pageX - canvas.offsetLeft
    let y = e.pageY - canvas.offsetTop

    if (isPainting) {
      let point = {
        x,
        y,
        isDragging: true
      }
      points.push(point)
      redraw(paintState)
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
