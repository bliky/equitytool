import zrender from 'zrender'

const ushape = zrender.Path.extend({
  type: 'ushape',
  shape: {
    x: 0,
    y: 0,
    width: 30
  },
  buildPath: function (path, shape) {
    let w = shape.width
    let x = shape.x
    let y = shape.y

    path.moveTo(x, y - 6)
    path.lineTo(x, y)
    path.lineTo(x + w, y)
    path.lineTo(x + w, y - 6)
  }
})

export default ushape
