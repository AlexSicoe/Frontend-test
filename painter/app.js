'use strict'

/**
 * @type {{ color: string | CanvasGradient | CanvasPattern ; lineWidth: number ; lineJoin: CanvasLineJoin; }}
 */
let paintState = {
  color: 'red',
  lineWidth: 10,
  lineJoin: 'round'
}

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

  generateCanvas(width, height)
  generatePalette()
  return true
}

function generatePalette() {
  let palette = document.getElementById('palette')
  if (!palette) {
    palette = document.createElement('div')
    palette.id = 'palette'
    palette.textContent = 'I will be a color palette'
    document.body.appendChild(palette)
  }
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

  /** @type {number[]} */
  let clickX = []
  /** @type {number[]} */
  let clickY = []
  /** @type {boolean[]} */
  let clickDrags = []
  /** @type {boolean} */
  let isPainting

  /**
   * @param {number} x
   * @param {number} y
   * @param {boolean} isDragging
   */
  function addClick(x, y, isDragging) {
    clickX.push(x)
    clickY.push(y)
    clickDrags.push(isDragging)
  }

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

    for (let i = 0; i < clickX.length; i++) {
      context.beginPath()
      if (clickDrags[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1])
      } else {
        context.moveTo(clickX[i] - 1, clickY[i])
      }
      context.lineTo(clickX[i], clickY[i])
      context.closePath()
      context.stroke()
    }
  }

  canvas.id = 'canvas'
  canvas.width = width
  canvas.height = height
  document.body.appendChild(canvas)

  let context = canvas.getContext('2d')

  canvas.onmousedown = (e) => {
    let mouseX = e.pageX - canvas.offsetLeft
    let mouseY = e.pageY - canvas.offsetTop
    isPainting = true
    addClick(mouseX, mouseY, false)
    redraw(paintState)
  }

  canvas.onmousemove = (e) => {
    let mouseX = e.pageX - canvas.offsetLeft
    let mouseY = e.pageY - canvas.offsetTop

    if (isPainting) {
      addClick(mouseX, mouseY, true)
      redraw(paintState)
    }
  }

  canvas.onmouseup = (e) => {
    isPainting = false
  }

  canvas.onmouseleave = (e) => {
    isPainting = false
  }
}
