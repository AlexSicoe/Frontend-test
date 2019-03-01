'use strict'
function validateInput(textbox) {
  if (textbox.value == '') {
    textbox.setCustomValidity('Required field')
  } else if (textbox.value < 50) {
    textbox.setCustomValidity('Value should be greater than 50')
  } else {
    textbox.setCustomValidity('')
  }
  return true
}

function onSubmit(e) {
  e.preventDefault()

  let widthInput = document.getElementById('width')
  let heightInput = document.getElementById('height')

  widthInput.oninvalid = (e) => validateInput(e)
  heightInput.onInvalid = (e) => validateInput(e)

  let width = widthInput.value
  let height = heightInput.value

  let message = `(${width}, ${height})`
  console.log(message)

  /** @type {HTMLCanvasElement} */
  let canvas = document.getElementById('canvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
  }

  let clickX = []
  let clickY = []
  let clickDrag = []
  let paint

  function addClick(x, y, dragging) {
    clickX.push(x)
    clickY.push(y)
    clickDrag.push(dragging)
  }

  function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.strokeStyle = '#000000'
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
    addClick(mouseX, mouseY)
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
