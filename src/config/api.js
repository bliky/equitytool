const host = 'http://dev.lingdongweilai.com/'
const version = 'v1'
const baseUrl = host + version + '/'
const api = r => baseUrl + r

const apis = {
  user: {
    register: api('user/register'),
    login: api('user/login'),
    logout: api('user/logout'),
    passwd: api('user/change-pwd'),
    userinfo: api('user/info'),
  },
  vcode: {
    gen: api('user/new-captcha'),
    load: id => api('user/captcha-view') + '?cap_id=' + id
  },
  sms: {
    vcode: api('user/sms')
  },
  company: {
    edit: api('company/before-grant-edit'),
    get: api('company/get-company-info'),
    verify: api('company/verify'),
    stockpoolrate: api('company/modify-stock-pool-rate')
  },
  capital: {
    modify: api('cap-change/add-cap-change')
  },
  plan: {
    delete: api('plan/del-plan'),
    create: api('plan/design-plan'),
    get: id => api('plan/plan-info') + '?plan_id=' + id,
    enter: api('plan/enter-plan'),
    detail: api('plan/plan-grant-detail'),
    list: api('plan/plan-info-list'),
    grants: api('plan/batch-plan-grant-detail'),
    grant: api('plan-item/get-list'),
    dash: api('plan-item/dash-board'),
    downtpl: api('general/down-project-tpl')
  },
  grant: {
    default: api('general/get-plan-design-rel-info'),
    getlocktmpl: api('plan-item/get-lock-tmpl'),
    add: api('plan-item/add-plan-item'),
    get: api('plan-item/get-plan-item-info'),
    delete: api('plan-item/del-plan-item'),
    update: api('plan-item/update-plan-item'),
    notice: api('plan-item/notice-plan-item'),
    staff: api('general/get-market-grant-info'),
    init: api('plan-item/initial-info'),
    protocol: api('plan-item/download-protocol')
  },
  service: {
    editinvoice: api('service/edit-invoice'),
    invoicelist: api('service/invoice-list'),
    getinvoice: api('service/get-invoice'),
    buyservice: api('service/service-order'),
    paystatus: api('service/pay-status'),
    orderlist: api('service/order-list'),
    getorder: api('service/get-order'),
    delorder: api('service/del-order'),
    repayorder: api('service/order-repay'),
    addorderinvoice: api('service/add-order-invoice'),
    getunpayed: api('service/get-unpayed')
  },
  communicate: {
    addcommunication: api('value-communication/add-communication'),
    updatecommunication: api('value-communication/update-communication'),
    confirmcommunication: api('value-communication/confirm-communication'),
    getlist: api('value-communication/get-list'),
    addstafftarget: api('add-staff-target'),
    updatestafftarget: api('value-communication/update-staff-target'),
    initialtargetsinfo: api('value-communication/initial-targets-info'),
    stafftargetslist: api('value-communication/staff-targets-list'),
    delcommunication: api('value-communication/del-communication'),
  },
  upload: {
    picture: api('general/pics')
  }
}

export {
  host,
  version,
  baseUrl,
  apis
}

export default apis