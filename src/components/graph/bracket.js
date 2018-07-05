import zrender from 'zrender'

const bracket = zrender.Path.extend({
  type: 'bracket',
  shape: {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    r: 8
  },
  buildPath: function (path, shape) {
    let x1 = shape.x1
    let y1 = shape.y1
    let x2 = shape.x2
    let y2 = shape.y2
    let r = shape.r

    // /path.beginPath()
    //path.moveTo(x1, y1)
    path.arc(x1+r, y1, r, Math.PI, Math.PI*1.5)
    path.lineTo((x1+x2)/2-r+2, (y1+y2)/2-r)
    // path.moveTo((x1+x2)/2, (y1+y2)/2-r*2)
    // path.arc((x1+x2)/2-r, (y1+y2)/2-r*2, r, 0, Math.PI*0.5)
    // path.moveTo((x1+x2)/2+r, (y1+y2)/2-r)
    // path.arc((x1+x2)/2+r, (y1+y2)/2-r*2, r, Math.PI*0.5, Math.PI)
    path.moveTo((x1+x2)/2+r-3, (y1+y2)/2-r)
    path.lineTo(x2-r, (y1+y2)/2-r)
    path.arc(x2-r, y2, r, Math.PI*1.5, 0)
  }
})

export default bracket
