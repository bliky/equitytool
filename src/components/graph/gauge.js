import zrender from 'zrender'

const gauge = zrender.Path.extend({
  type: 'gauge',
  shape: {
    x: 0,
    y: 0,
    r: 100,
    w: 12
  },
  buildPath: function (path, shape) {
    let x = shape.x
    let y = shape.y
    let r = shape.r
    let w = shape.w

    path.arc(x, y, r, Math.PI, 0)
    path.arc(x+r-w/2, y, w/2, 0, Math.PI)
    path.arc(x, y, r-w, 0, Math.PI, true)
    path.arc(x-r+w/2, y, w/2, 0, Math.PI)
  }
})

export default gauge
