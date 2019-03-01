'use strict'

/**
 * @param {Event} e
 */

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

  let width = widthInput.value
  let height = heightInput.value
  console.log(`Canvas: (${width}, ${height})`)

  handleCanvas(width, height)
  return true
}

/**
 * @param {number} width
 * @param {number} height
 */
function handleCanvas(width, height) {
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
  let clickDrag = []
  /** @type {boolean} */
  let paint

  /**
   * @param {number} x
   * @param {number} y
   * @param {boolean} dragging
   */
  function addClick(x, y, dragging) {
    clickX.push(x)
    clickY.push(y)
    clickDrag.push(dragging)
  }

  function redraw() {
    if (!context) {
      throw new Error('inexistent context')
    }
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.strokeStyle = 'red'
    context.lineJoin = 'round'
    context.lineWidth = 5

    for (let i = 0; i < clickX.length; i++) {
      context.beginPath()
      if (clickDrag[i] && i) {
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
    paint = true
    addClick(mouseX, mouseY, false)
    redraw()
  }

  canvas.onmousemove = (e) => {
    let mouseX = e.pageX - canvas.offsetLeft
    let mouseY = e.pageY - canvas.offsetTop

    if (paint) {
      addClick(mouseX, mouseY, true)
      redraw()
    }
  }

  canvas.onmouseup = (e) => {
    paint = false
  }

  canvas.onmouseleave = (e) => {
    paint = false
  }
}
