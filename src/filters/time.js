import moment from 'moment'

const timeFormat = (time, format) => {
  var format = format || 'YYYY-MM-DD HH:mm:ss'
  return moment.unix(time).format(format)
}

export default timeFormat