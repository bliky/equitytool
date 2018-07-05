import index from './modules/index'
import page404 from './modules/page404'

import design from './modules/design/'
import design1 from './modules/design/design1'
import design2 from './modules/design/design2'
import design3 from './modules/design/design3'
import design4 from './modules/design/design4'

import grant from './modules/grant/'
import implement from './modules/implement/'
import plan from './modules/plan/'
import planview from './modules/plan/view'

import userReg from './modules/user/reg'
import userLogin from './modules/user/login'
import usercenter from './modules/user/founder/usercenter'
import changepwd from './modules/user/founder/changepwd'
import verifycompany from './modules/user/founder/verifycompany'
import serviceselect from './modules/user/founder/serviceselect'
import payresult from './modules/user/founder/payresult'

import entry from './modules/entry/'
import entry1 from './modules/entry/entry1'
import entry2 from './modules/entry/entry2'
import entry3 from './modules/entry/entry3'
import communicate from './modules/communicate'
import communicate1 from './modules/communicate/communicate1'

export default [
  {
    name: 'home',
    path: '/',
    component: index
  },
  {
    name: '404',
    path: '/404',
    component: page404
  },
  {
    name: 'design',
    path: '/design',
    component: design,
    redirect: '/design/d1',
    children: [
      {
        name: 'design1',
        path: 'd1',
        component: design1
      },
      {
        name: 'design2',
        path: 'd2',
        component: design2
      },
      {
        name: 'design3',
        path: 'd3',
        component: design3
      },
      {
        name: 'design4',
        path: 'd4',
        component: design4
      }
    ]
  },
  {
    name: 'grant',
    path: '/grant/:id',
    component: grant,
    meta: { requiresAuth: true }
  },
  {
    name: 'implement',
    path: '/implement/:id',
    component: implement,
    meta: { requiresAuth: true }
  },
  {
    name: 'plan',
    path: '/plan',
    component: plan,
    meta: { requiresAuth: true }
  },
  {
    name: 'reg',
    path: '/reg',
    component: userReg
  },
  {
    name: 'login',
    path: '/login',
    component: userLogin
  },
  {
    name: 'usercenter',
    path: '/usercenter',
    component: usercenter,
    meta: { requiresAuth: true }
  },
  {
    name: 'changepwd',
    path: '/changepwd',
    component: changepwd
  },
  {
    name: 'verifycompany',
    path: '/verifycompany',
    component: verifycompany
  },
  {
    name: 'serviceselect',
    path: '/serviceselect',
    component: serviceselect
  },
  {
    name: 'payresult',
    path: '/payresult',
    component: payresult
  },
  {
    name: 'entry',
    path: '/entry',
    component: entry,
    redirect: '/entry/e1',
    meta: { requiresAuth: true },
    children: [
      {
        name: 'entry1',
        path: 'e1',
        component: entry1
      },
      {
        name: 'entry2',
        path: 'e2',
        component: entry2
      },
      {
        name: 'entry3',
        path: 'e3',
        component: entry3
      }
    ]
  },
  {
    name: 'communicate',
    path: '/communicate',
    component: communicate,
    redirect: '/communicate/c1',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'c1',
        name: 'c1',
        component: communicate1
      }
    ]
  }
]
