import numeral from 'numeral'

const percentFormat = num => {
  return numeral(num).format('0.0')
}

export default percentFormat

