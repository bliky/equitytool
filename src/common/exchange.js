const CURRENCY_EXCHANGE = {
  '2-1': 6.6,  // 美元兑人民币
  '3-1': 0.845,  // 港币兑人民币
  '1-2': 1/6.6,  // 人民币兑美元
  '1-3': 1/0.845,  // 人民币兑港币
  '2-3': 6.6/0.845,  // 美元兑港币
  '3-2': 0.845/6.6  // 港币兑美元
}

export default (from, to) => {
  if (from == to) return 1

  return CURRENCY_EXCHANGE[from+'-'+to]
}
