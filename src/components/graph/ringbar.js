import zrender from 'zrender'

const ringbar = zrender.Path.extend({
  type: 'ringbar',
  shape: {
    x: 0,
    y: 0,
    r: 100,
    w: 12,
    angle: 30
  },
  buildPath: function (path, shape) {
    let x = shape.x
    let y = shape.y
    let r = shape.r
    let w = shape.w
    let angle = shape.angle
    let a2r = Math.PI/180
    let radian = angle * a2r

    path.arc(x, y, r, Math.PI, Math.PI+radian)
    path.arc(x-(r-w/2)*Math.cos(radian), y-(r-w/2)*Math.sin(radian), w/2, Math.PI+radian, Math.PI*2+radian)
    path.arc(x, y, r-w, Math.PI+radian, Math.PI, true)
    path.arc(x-r+w/2, y, w/2, 0, Math.PI)
  }
})

export default ringbar
