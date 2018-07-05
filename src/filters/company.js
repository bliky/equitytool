import {COMPANY_REGAREA, COMPANY_STOCKAREA, COMPANY_EXPROUND} from '../config/const'

const filterCompanyRegarea = value => COMPANY_REGAREA[value]
const filterCompanyStockarea = value => COMPANY_STOCKAREA[value]
const filterCompanyExpround = value => COMPANY_EXPROUND[value]

export {
  filterCompanyRegarea,
  filterCompanyStockarea,
  filterCompanyExpround
}
