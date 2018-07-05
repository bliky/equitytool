import zrender from 'zrender'

const pointer = zrender.Path.extend({
  type: 'pointer',
  shape: {
    x: 0,
    y: 0,
    r: 6,
    length: 80,
    theta: 30,
    angle: 30
  },
  buildPath: function (path, shape) {
    let x = shape.x
    let y = shape.y
    let r = shape.r
    let length = shape.length
    let theta = shape.theta
    let angle = shape.angle
    let a2r = Math.PI/180
    let radian = angle * a2r

    let alpha = Math.acos(r/length)

    path.arc(x, y, r, Math.PI+radian+alpha, Math.PI+radian-alpha)
    path.lineTo(x-Math.cos(radian)*length, y-Math.sin(radian)*length)
    path.lineTo(x+Math.cos(Math.PI-radian-alpha)*r, y-Math.sin(Math.PI-radian-alpha)*r)
  }
})

export default pointer
