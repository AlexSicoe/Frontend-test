'use strict'

/**
 * @type {Readonly<{ color: string | CanvasGradient | CanvasPattern ; size: number ; join: CanvasLineJoin; }>}
 * paintState is immutable so that references in the points history are different
 */
let paintState = Object.freeze({
  color: 'red',
  size: 10,
  join: 'round'
})

/**
 * @param {Partial<{ color: string | CanvasGradient | CanvasPattern; size: number; join: CanvasLineJoin; }>} nextState
 */
function setPaintState(nextState) {
  paintState = { ...paintState, ...nextState }
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

  let painterDiv = document.createElement('div')
  painterDiv.id = 'painter'

  let palette = generatePalette()
  let canvas = generateCanvas(width, height)

  painterDiv.appendChild(palette)
  painterDiv.appendChild(canvas)
  document.body.appendChild(painterDiv)
  return true
}

function generatePalette() {
  let palette = document.getElementById('palette')
  if (!palette) {
    palette = document.createElement('div')
    palette.id = 'palette'

    let sizeDiv = document.createElement('div')
    sizeDiv.id = 'size'
    let sizeText = document.createTextNode('Line size: ')
    let sizeInput = document.createElement('input')
    sizeInput.id = 'sizeInput'
    sizeInput.type = 'number'
    sizeInput.value = '10'
    sizeInput.min = '1'
    sizeInput.onchange = (e) => {
      // @ts-ignore
      setPaintState({ size: e.target.value })
    }
    sizeDiv.appendChild(sizeText)
    sizeDiv.appendChild(sizeInput)

    let joinDiv = document.createElement('div')
    joinDiv.id = 'join'
    let joinText = document.createTextNode('Line join: ')
    let joinSelect = document.createElement('select')
    joinSelect.id = 'joinInput'
    let round = document.createElement('option')
    let bevel = document.createElement('option')
    let miter = document.createElement('option')
    round.value = 'round'
    bevel.value = 'bevel'
    miter.value = 'miter'
    round.text = 'Round'
    bevel.text = 'Bevel'
    miter.text = 'Miter'
    joinSelect.options.add(round)
    joinSelect.options.add(bevel)
    joinSelect.options.add(miter)
    joinSelect.onchange = (e) => {
      // @ts-ignore
      setPaintState({ join: e.target.value })
    }
    joinDiv.appendChild(joinText)
    joinDiv.appendChild(joinSelect)

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
        setPaintState({ color: colorButton.style['background-color'] })
      }
      colorsDiv.appendChild(colorButton)

      palette.appendChild(sizeDiv)
      palette.appendChild(joinDiv)
      palette.appendChild(colorsDiv)
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

  /** @type {{ x: number; y: number; isDragging: boolean; paint: { color: string | CanvasGradient | CanvasPattern; size: number; join: CanvasLineJoin; }}[]} */
  let points = []

  /** @type {boolean} */
  let isPainting

  function redraw() {
    if (!context) {
      throw new Error('inexistent context')
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)

    for (let i = 0; i < points.length; i++) {
      context.strokeStyle = points[i].paint.color
      context.lineJoin = points[i].paint.join
      context.lineWidth = points[i].paint.size
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
      isDragging: false,
      paint: paintState
    }
    points.push(point)
    redraw()
  }

  canvas.onmousemove = (e) => {
    let x = e.pageX - canvas.offsetLeft
    let y = e.pageY - canvas.offsetTop

    if (isPainting) {
      let point = {
        x,
        y,
        isDragging: true,
        paint: paintState
      }
      points.push(point)
      redraw()
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
