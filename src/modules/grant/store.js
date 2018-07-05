const grantStore = function (mod, initialState = {}) {
  if (!mod) {
    throw new Error('Module is required.')
  }

  this.states = {
    tableData: [
      {
        total:0,
        data: []
      },
      {
        total:0,
        data: []
      },
      {
        total:0,
        data: []
      },
      {
        total:0,
        data: []
      }
    ],
    dataEditCompanyInfo: {
      p_id: 0,
      company_id: '', // 公司ID
      currency_type: '', // 币种类型
      cap_val: '', // 估值
      stock_val: '', // 股本数量
      nature_type: '' // 公司性质
    },
    dataAddGrant: {
      plan_id: '',
      staff_type: '',
      staff_id: '',
      effective_year: 10,
      sn: '',
      grant_rate: '',
      grant_stock: '',
      lock_schema: '',
      lock_tmpl: '',
      net_val: '',
      reg_val: '',
      strike_type: '',
      strike_val: '',
      strike_currency: '',
      strike_price: '',
      grant_email: '',
      grant_name: '',
      vestPlan: ''
    },
    grantStuffs: [
      {
        type: 1,
        title: '高层管理',
        desc: '公司最高层管理团队，参与公司层面跨领域问题的讨论和决策。中等规模公司的高层管理团队人数为10人左右。',
        open: true,
        color: '#db4648'
      },
      {
        type: 2,
        title: '中层管理',
        desc: '公司最高层管理团队，参与公司层面跨领域问题的讨论和决策。中等规模公司的高层管理团队人数为10人左右。',
        open: true,
        color: '#ff4f51'
      },
      {
        type: 3,
        title: '基层员工',
        desc: '公司最高层管理团队，参与公司层面跨领域问题的讨论和决策。中等规模公司的高层管理团队人数为10人左右。',
        open: true,
        color: 'rgba(219,70,72, .8)'
      },
      {
        type: 4,
        title: '核心员工',
        desc: '公司最高层管理团队，参与公司层面跨领域问题的讨论和决策。中等规模公司的高层管理团队人数为10人左右。',
        open: true,
        color: 'rgba(219,70,72, .6)'
      }
    ]
  }

  for (let prop in initialState) {
    if (initialState.hasOwnProperty(prop) && this.states.hasOwnProperty(prop)) {
      this.states[prop] = initialState[prop];
    }
  }
}

grantStore.prototype.save = function () {

}

export default grantStore
