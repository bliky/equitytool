import zrender from 'zrender'

const axis = zrender.Path.extend({
  type: 'axis',
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    arrow: 5,
    yAxis: true,
    broken: 50
  },
  buildPath: function (path, shape) {
    let xo = shape.x
    let yo = shape.y
    let w = shape.width
    let h = shape.height
    let xh = xo+w
    let yh = yo
    let xv = xo
    let yv = yo-h
    let aw = shape.arrow
    let broken = shape.broken

    if (shape.yAxis) {
      path.moveTo(xv-aw, yv+aw)
      path.lineTo(xv, yv)
      path.lineTo(xv+aw, yv+aw)
      path.moveTo(xv, yv)
      path.lineTo(xo, yo)
    } else {
      path.moveTo(xo, yo)
    }

    if (broken) {
      path.lineTo(xh-broken, yh)
      path.moveTo(xh-broken + 20, yo)
    }

    path.lineTo(xh, yh)
    path.moveTo(xh-aw, yh+aw)
    path.lineTo(xh, yh)
    path.lineTo(xh-aw, yh-aw)
  }
})

export default axis
