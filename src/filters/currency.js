import numeral from 'numeral'
import {CURRENCY_TOKEN} from '../config/const'

const currencyFormat = (num, format, type) => {
  if (isNaN(parseFloat(num))) {
  	return num
  }

  var format = format || '0,0.00'
  var type = type ? CURRENCY_TOKEN[type] : ''

  return type + numeral(num).format(format)
}

export default currencyFormat