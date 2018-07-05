<template>
  <ld-content :height="560">
    <ld-stepbar :step="1" step1Text="方案机制录入"></ld-stepbar>

    <div id="box">
      <div class="boxContent">
        <dl>
          <dt>
            <p>激励工具</p>
          </dt>
          <dd>
            <template v-for="tool in toolTypeList">
              <p class="item" @click="choseToolType(tool.toolTypeId)" :class="{active: tool.toolTypeId==toolTypeId}"><i class="el-icon-circle-check" v-show="tool.toolTypeId==toolTypeId"></i>{{tool.name}}</p>
            </template>
          </dd>
        </dl>
      </div>

      <div class="boxContent boxRight">
        <dl>
          <dt>
            <p>持股方式</p>
          </dt>
          <dd>
            <template v-for="keepType in keepTypeList">
              <p class="item" @click="choseKeepType(keepType.keepTypeId)" :class="{active: keepType.keepTypeId==keepTypeId}"><i class="el-icon-circle-check" v-show="keepType.keepTypeId==keepTypeId"></i>{{keepType.name}}</p>
            </template>
          </dd>
        </dl>
      </div>
    </div>

    <div style="margin-top: 114px; text-align: center;">
      <a class="ld-btn ld-btn-primary" @click="nextStep()">下一步</a>
    </div>

  </ld-content>
</template>

<script>
import LdStepbar from '../../components/stepbar'
import localDb from '../../db'

export default {
  components: {
    LdStepbar
  },
  data () {
    return {
      user: localDb.get('userinfo'),
      //激励工具ID
      toolTypeId: localDb.get('toolTypeId') || '',
      //持股方式ID
      keepTypeId: localDb.get('keepTypeId') || '',
      //激励工具列表
      toolTypeList:[
        {
          name:"股票期权",
          toolTypeId:'1',
        },
        {
          name:"限制性股票",
          toolTypeId:'2',
        },
        {
          name:"员工入股",
          toolTypeId:'3',
        }
      ],
      //持股方式
      keepTypeList:[
        {
          name:"直接持股（境内）",
          keepTypeId:'1',
        },
        {
          name:"直接持股 （境外）",
          keepTypeId:'2',
        },
        {
          name:"间接持股",
          keepTypeId:'3',
        }
      ]
    }
  },

  mounted () {
    if (!this.user) {
      this.$router.push('/login')
    }
  },

  methods: {
    choseToolType: function (toolTypeId) {
      this.toolTypeId = toolTypeId
    },
    choseKeepType: function (keepTypeId) {
      this.keepTypeId = keepTypeId
    },
    nextStep: function () {
      if (this.toolTypeId == 0) {
        this.$message('请选择激励工具')
        return false
      }
      if (this.keepTypeId == 0) {
        this.$message('请选择持股方式')
        return false
      }

      console.log('激励工具', this.toolTypeId)
      console.log('持股方式', this.keepTypeId)
      // set db
      localDb.set('toolTypeId', this.toolTypeId)
      localDb.set('keepTypeId', this.keepTypeId)

      //判断用户是否登录
      let userInfo = localDb.get('userinfo')
      console.log(userInfo)
      if(!userInfo){
        this.$router.push({path: '/login'})
        return
      }

      localDb.set('cap_currency',userInfo.company_info.c_cap_currency)
      localDb.set('cap_val',userInfo.company_info.c_cap_val)
      localDb.set('stock_val',userInfo.company_info.c_stock_val)
      this.$router.push({path: '/entry/e2'})
    }
  }
}
</script>

<style lang="less">
  @import '../../components/variables.less';
  @import '../../components/mixins.less';

  #box{
    width:784px;
    height:300px;
    margin: auto;

    dl{
      dt{
        p{
          margin-top: 90px;
          font-size: 16px;
          margin-bottom: 30px;
          color: rgb(39, 46, 53);
          font-weight: bold;
        }
      }
    }
    .boxContent{
      width:260px;
      float:left;
      text-align: center;
      margin-left: 60px;

      .active{
        background-color: @color-blue4;
        color: @color-blue2;
      }
    }

    .boxRight{
      margin-left: 120px;
    }

    .item{
      height: 60px;
      width: 260px;
      line-height: 60px;
      text-align: center;

      font-size:14px;
      color: @color-text-secondary;
      cursor: pointer;
      position: relative;
      i{
        position: absolute;
        right: 5px;
        top: 5px;
        color: @color-primary;
      }

      &:hover {
        background-color: #fff;
        color: @color-blue2;
        border: solid 1px @color-blue2;
      }
    }
  }
</style>
