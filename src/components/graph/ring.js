import zrender from 'zrender'

const ring = zrender.Path.extend({
  type: 'ring',
  shape: {
    x: 46,
    y: 46,
    r: 46,
    w: 6,
    beginAngle: 0,
    angle: 360
  },
  buildPath: function (path, shape) {
    let x = shape.x
    let y = shape.y
    let r = shape.r
    let w = shape.w
    let r2 = r - w
    let angle = shape.angle
    let a2r = Math.PI/180
    let radian = angle * a2r
    let beginAngle = (shape.beginAngle + -90) * a2r

    path.arc(x, y, r, beginAngle, beginAngle+radian)
    path.lineTo(x+r2*Math.cos(beginAngle+radian), y+r2*Math.sin(beginAngle+radian))
    path.arc(x, y, r2, beginAngle+radian, beginAngle, true)
    path.lineTo(x+r*Math.cos(beginAngle), y+r*Math.sin(beginAngle))
    //path.lineTo(x, y-r)
  }
})

export default ring
