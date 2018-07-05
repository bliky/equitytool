const STAFF_GROUP = {
  '1': '高层',
  '2': '技术',
  '3': '产品',
  '4': '设计',
  '5': '运营',
  '6': '战略',
  '7': '仓储',
  '8': '市场',
  '9': '销售',
  '10': '财务',
  '11': '人资',
  '12': '法务',
  '13': '行政',
  '14': '采购',
  '15': '客服'
}

const STUFF_TYPE = {
  '1' : {
    '0': '未定义',
    '1': 'CEO',  // 1
    '2': 'CTO',  // 2
    '3': 'COO',  // 3
    '4': '首席产品管',  // 4
    '5': '首席战略官',  // 5
    '6': '首席市场官',  // 6
    '7': '首席财务官',  // 7
    '8': '首席人才官',  // 8
    '9': '副总裁',  // 9
    '15': '其他'  // 15
  },
  '2' : {
    '21': '技术',
    '22': '产品',
    '23': '设计',
    '24': '运营',
    '25': '战略',
    '26': '仓储物流',
    '27': '市场',
    '28': '销售',
    '29': '财务',
    '30': '人力资源',
    '31': '法务',
    '32': '行政',
    '33': '采购',
    '34': '客服',
    '40': '其他'
  },
  '3' : {
    '51': '技术',
    '52': '产品',
    '53': '设计',
    '54': '运营',
    '55': '战略',
    '56': '仓储物流',
    '57': '市场',
    '58': '销售',
    '59': '财务',
    '60': '人力资源',
    '61': '法务',
    '62': '行政',
    '63': '采购',
    '64': '客服',
    '70': '其他'
  },
  '4' : {
    '81': '技术',
    '82': '产品',
    '83': '设计',
    '84': '运营',
    '85': '战略',
    '86': '仓储物流',
    '87': '市场',
    '88': '销售',
    '89': '财务',
    '80': '人力资源',
    '91': '法务',
    '92': '行政',
    '93': '采购',
    '94': '客服',
    '100': '其他'
  }
}

const STRIKE_TYPE = {
  '1': '以授予时公司最近一轮融资估值的百分比做为行权价/入股价',
  '2': '以授予时公司最近一个财年净资产的n倍做为行权价/入股价',
  '3': '以每股注册资本/每股发行股份对应的股权价值为人民币1元做为行权价/入股价',
  '4': '零价格'
}

const VEST_PLAN_PREOPTS = {
  '1': '三年逐年滚动，每年生效1/3',
  '2': '四年逐年滚动，每年生效1/4'
}

const TOOL_TYPE = {
  '1': '股票期权',
  '2': '限制性股票',
  '3': '员工入股'
}

const COMPANY_REGAREA = {
  '1': '中国境内',
  '2': '中国境外'
}

const COMPANY_STOCKAREA = {
  '1': '计划上市中国境内',
  '2': '计划上市中国境外',
  '3': '上市计划尚未明确',
  '4': '已上市中国境内',
  '5': '已上市中国境外'
}

const COMPANY_EXPROUND = {
  '1': 'PreA',
  '2': 'A',
  '3': 'B',
  '4': 'C',
  '5': 'Ｄ',
  '11': '有上升空间',
  '12': '趋于平稳'
}

const COMPANY_EXPROUND2 = {
  '1': 'A轮前方案',
  '2': 'A轮后方案',
  '3': 'B轮后方案',
  '4': 'C轮后方案',
  '5': 'Ｄ轮后方案',
  '11': '上市后增长期方案',
  '12': '上市后平稳期方案'
}

const COMPANY_TYPE = {
  '1': '有限责任公司',
  '2': '股份有限公司'
}

const CURRENCY_TYPE = {
  '1': '人民币',
  '2': '美元',
  '3': '港币'
}

const CURRENCY_TOKEN = {
  '1': 'CNY',
  '2': 'USD',
  '3': 'HKD'
}

const KEEP_TYPE = {
  '1': '直接持股（境内）',
  '2': '直接持股 （境外）',
  '3': '间接持股'
}

export {
  STUFF_TYPE,
  STRIKE_TYPE,
  VEST_PLAN_PREOPTS,
  TOOL_TYPE,
  COMPANY_REGAREA,
  COMPANY_STOCKAREA,
  COMPANY_EXPROUND,
  COMPANY_EXPROUND2,
  COMPANY_TYPE,
  CURRENCY_TYPE,
  CURRENCY_TOKEN,
  STAFF_GROUP,
  KEEP_TYPE
}