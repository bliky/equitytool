import {STUFF_TYPE, TOOL_TYPE, KEEP_TYPE, COMPANY_EXPROUND2} from '../config/const'

const filterStuffType = (value, type) => {
  return STUFF_TYPE[type][value]
}
const filterToolType = value => TOOL_TYPE[value]
const filterKeepType = value => KEEP_TYPE[value]
const filterCompanyRound = value => COMPANY_EXPROUND2[value]

export {
  filterStuffType,
  filterToolType,
  filterKeepType,
  filterCompanyRound
}
