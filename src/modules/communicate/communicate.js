import axios from 'axios'
import {CURRENCY_TYPE , CURRENCY_TOKEN} from '../../config/const' 
import localDb from '../../db.js'
import currencyFormat from '../../filters/currency'
import targetSel from '../../components/targetSel'
import communicate from '../../services/communicate'
import company from '../../services/company'

export default {
  components: {
    targetSel
  },
  data () {
    return {
      currentIndex: 0,
      tabData:[{nav:'当前沟通'},{nav:'历史沟通'}],
      stepNum:0,//走到第几步了
      // 设定沟通场景
      dialog1:false,
      id:false,
      type:null,//1展望未来,2回顾历史
      typeData:{'null':'','1':'展望未来','2':'回顾过去'},
      tempType:null,//未点确认时暂存type状态
      // 设定估值信息弹窗
      dialog2:false,
      cap_currency:null,//估值币种
      cap_val:'',//估值大小
      val_month:0,//估值月份
      is_public:false,//是否公开  0不公开 1公开
      // 设定专属领域目标
      dialog3:false,
      companytargets:[
        {
          iscustom:false,
          t1:'22222',
          t2:'33'
        }
      ],
      // 设定沟通场景
      dialog4:true,
      currencyTypeOpts: CURRENCY_TYPE,
      history:[],//历史沟通列表
      currentPage:1,
      total:0,
      loading:false
    }
  },
  computed: {
    // convertType () {
    //   return CURRENCY_TYPE[this.cap_currency] || ''
    // },
    convertToken () {
      return CURRENCY_TOKEN[this.cap_currency] || ''
    },
    convertCapval () {
      return currencyFormat(this.cap_val,'0,0')
    }
  },
  mounted () {
      // axios.all([
      //   communicate.add({type: 1}) // 获取方案初始化信息
      // ]).then(axios.spread(function (data1) {
      //    console.log(data1)
      // }))
      // communicate.add({type: 1}).then((res) => {
      //   console.log(res); v-for="(index item) in companyTargets" v-bind:todo="item" v-bind:key="index"
      // }) 

      company.get().then((res) =>{
        console.log(res)
      })// 获取公司基本信息
      this.getlist()
  },
  methods: {
    tab (index) {
      this.currentIndex = index
      if(index == 1 && this.total == 0){
        this.getlist({status:2 , page_size:6 , current_page:this.currentPage})
      }
    },
    step(index){
      if( this.stepNum >= (index -1) ){
        if(index<4){
          this['dialog'+index] = true
        }else{//专属领域目标
          this.currentIndex = 2
          this.stafftargetslist()
        }
      }else{
        return
      }
    },
    choose(index){
      this.tempType = index*10
    },
    dialog1Sure(){
      let tempType = this.tempType/10
      if(this.type == tempType){
        this.dialog1 = false
      }else if(this.id && tempType != this.type){//当前选中场景不等于之前选中场景
        this.dialog1Warn()
      }else if(this.type != null){
        this.add()
      }else {
        this.ealert({cont:'数据加载中请稍后再试！'})
        return  
      }
    },
    dialog2Sure(){
      console.log(this.is_public)
      let ispublic = this.is_public ? 1 :0
      let params = {
        id: this.id,
        type: this.type,
        cap_currency: this.cap_currency,
        cap_val: this.cap_val,
        val_month: this.val_month,
        is_public: ispublic 
      }
      communicate.update(params).then((res) => {
        if(res && res.retCode == 0){
          this.emsg({inf:'操作成功！'})
          this.dialog2 =false
        }else{
          this.emsg({inf:'操作失败！'})
        }
      }).catch((reject) => {
        this.emsg({inf:'网络超时！'})        
      })
    },
    dialog3Sure(data,data1){
      let ispublic = this.is_public ? 1 :0
      let params = {
        id: this.id,
        type: this.type,
        cap_currency: this.cap_currency,
        cap_val: this.cap_val,
        val_month: this.val_month,
        is_public: ispublic,
        company_targets:JSON.stringify(data)
      }
      communicate.update(params).then((res) => {
        if(res && res.retCode == 0){
          this.emsg({inf:'操作成功！'})
          this.dialog3 =false
          this.companytargets = data
        }else{
          this.emsg({inf:'操作失败！'})
        }
      }).catch((reject) => {
        this.emsg({inf:'网络超时！'})        
      })
    }, 
    add(){//增加场景
      let type = this.tempType/10
      communicate.add({type: type}).then((res) => {
            if(res && res.data.id){
              this.id = res.data.id
              this.type = type
              this.stepNum = 1
              this.dialog1 = false
            }else{
              this.ealert({cont:'场景增加失败！'})
            }
            return res
        })
        .then((res) =>{
          this.getlist()
        }) 
    },
    dialog1Warn(){
      this.ewarn({inf:'此操作将清空当前填写的数据, 是否继续?'}).then(() => {
          communicate.del({vc_id: this.id}).then((res) => {
            if(res && res.retCode == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.id = false
              this.type = this.tempType
              this.stepNum = 0
              this.add()
            }else{
              this.$message({
                type: 'success',
                message: '删除失败!'
              });
            }
          })
      }).catch((reject) => {
        this.emsg({inf:'网络超时！'})                
      })
    },
    getlist(config){
      let settings= Object.assign({},{
        status:1
      },config)
      this.loading = true
      communicate.getlist({status: settings.status }).then((res) => {
        if(res && Number(res.data.totalCount) > 0){
          let data = res.data.dataList[0]
          let type = Number(data.vc_type)
          type = (type ==1 || type ==2) && type //type必须是1或者2中的一个才更新
          this.type = type
          this.id = data.vc_id
          this.tempType = type*10
          this.stepNum = 3
          this.cap_currency = data.vc_cap_currency
          this.cap_val = data.vc_cap_val
          this.val_month = data.vc_val_month
          this.is_public = Number(data.vc_is_public) ? true :false

          if(data.vc_company_targets){
            this.companytargets = data.vc_company_targets && JSON.parse(data.vc_company_targets)
          } else if(this.stepNum >= 2){
            this.companytargets = [{ iscustom:true, t1:'事例一', t2:'事例二' }]
          }

          if(settings.status == 2){//历史列表
            this.total = Number(res.data.totalCount)
            this.history = res.data.dataList
          }
        }else{
          this.type = 0
          this.stepNum = 0
        }
        this.loading = false
      }).catch((reject) => {
          this.id = null
          this.type = 0
          this.stepNum = 0
          this.loading = false
      })//获取沟通列表 
    },
    goWhere(data){
      if(!data){
        return 
      }else if(data.vc_company_targets){
        this.stepNum = 3
      }
    },
    stafftargetslist(){
      communicate.stafftargetslist({vc_id: this.id }).then((res) => {
        if(res && res.retCode == 0){
          console.log(res)
        }
      })
    },
    checkCurrentMsg(id){
       console.log(id)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    ealert(config){
      let {tit = '提示' , cont =''} = config
      this.$alert(cont, tit, {
          confirmButtonText: '确定',
          callback: action => {}
      });
    },
    ewarn(config){
      let {inf = '', type = 'warning'} = config
      return this.$confirm(inf, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: type
      })
    },
    emsg(config){
      let {inf = '操作成功！', type = 'success'} = config
      this.$message({
        message: inf,
        type: type
      });
    }
  }
}