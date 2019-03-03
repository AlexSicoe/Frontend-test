const { renderCanvas, renderPalette, PaintState } = require('./app')

it('renders canvas', () => {
  let canvas = renderCanvas(200, 300)
  expect(canvas.width).toBe(200)
  expect(canvas.height).toBe(300)
})

it('renders palette', () => {
  let palette = renderPalette()
  expect(palette.id).toBe('palette')
})

describe('Paint state', () => {
  let paint = new PaintState()
  it('changes color', () => {
    paint.setState({ color: 'blue' })
    expect(paint.state.color).toBe('blue')
  })
  it('changes size', () => {
    paint.setState({ size: 14 })
    expect(paint.state.size).toBe(14)
  })
  it('changes line join', () => {
    paint.setState({ join: 'bevel' })
    expect(paint.state.join).toBe('bevel')
  })
})
