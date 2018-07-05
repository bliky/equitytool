import zrender from 'zrender'

const arrow = zrender.Path.extend({
  type: 'arrow',
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    arrow: 3,
    begin: true
  },
  buildPath: function (path, shape) {
    let xb = shape.x
    let yb = shape.y
    let dx = shape.dx
    let dy = shape.dy
    let xe = xb+dx
    let ye = yb-dy

    let aw = shape.arrow

    if (shape.begin) {
      path.moveTo(xb+aw, yb-aw)
      path.lineTo(xb, yb)
      path.lineTo(xb+aw, yb+aw)
    }
    path.moveTo(xb, yb)
    path.lineTo(xe, ye)
    path.moveTo(xe-aw, ye+aw)
    path.lineTo(xe, ye)
    path.lineTo(xe-aw, ye-aw)
  }
})

export default arrow
