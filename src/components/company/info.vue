<template>
  <ld-content-main>
    <ld-stepline :step="step"></ld-stepline>
    <p style="margin-top: 40px; font-size: 13px; color: #94979a; text-align: center;">请选择<p>
    <h2 style="margin-top: 15px; font-size: 20px; color: #272e35; text-align: center;">{{title}}</h2>
    <ul v-if="step==1" class="ld-pic-selector" style="margin-top:50px;">
      <li v-for="areaItem in areaList" @click="onChooseArea(areaItem.areaId)" :class="{'active':areaId === areaItem.areaId}">
        <i class="el-icon-circle-check" v-show="areaId === areaItem.areaId"></i>
        <img v-if="areaId === areaItem.areaId" :src="areaItem.activePic"/>
        <img v-else :src="areaItem.inactivePic"/>
        <p>{{areaItem.name}}</p>
      </li>
    </ul>

    <ul v-if="step==2" class="ld-pic-selector zone-and-round" style="margin-top:50px;">
      <li v-for="stockZone in stockZoneList" @click="onChooseStockZone(stockZone.stockZoneId)"  :class="{'active':stockZoneId === stockZone.stockZoneId}">
        <i class="el-icon-circle-check" v-show="stockZoneId === stockZone.stockZoneId"></i>
        <img v-if="stockZoneId === stockZone.stockZoneId" :src="stockZone.activePic"/>
        <img v-else :src="stockZone.inactivePic"/>
        <p>{{stockZone.name}}</p>
      </li>
    </ul>

    <ul v-if="step==3" class="ld-pic-selector" :class="{'zone-and-round':stockZoneId < 4}" style="margin-top:50px;">
      <li v-for="roundGrow in roundGrowList" @click="onChooseRound(roundGrow.roundId)"  :class="{'active':roundId===roundGrow.roundId}">
        <i class="el-icon-circle-check" v-show="roundId===roundGrow.roundId"></i>
        <img v-if="roundId===roundGrow.roundId" :src="roundGrow.activePic"/>
        <img v-else :src="roundGrow.inactivePic"/>
        <p>{{roundGrow.name}}</p>
      </li>
    </ul>
    <div style="margin-top: 72px; text-align: center;">
      <a class="ld-btn ld-btn-primary" @click="actionChange(0)">上一步</a>
      <a class="ld-btn ld-btn-primary" @click="actionChange(1)">下一步</a>
    </div>
  </ld-content-main>
</template>

<script>
import localDb from '../../db.js'
import LdStepline from '../stepline'
import {LdContentMain} from '../content'

export default {
  props: {
    step: {
      type: Number,
      default: 1
    },
    chooseArea: {
        type: Function
    },
    chooseStockZone: {
        type: Function
    },
    chooseRound: {
        type: Function
    }
  },
  data () {
    return {
      title: ['公司当前注册地', '公司规划上市地或上市地', '您对公司未来股价的预期'][this.step - 1],

      areaId: localDb.get('areaId'),
      stockZoneId: localDb.get('stockZoneId'),
      roundId: localDb.get('roundId'),

      //注册地
      areaList:[
          {
              name:"中国境内",
              areaId:'1',
              inactivePic:require("../../assets/images/listedland_china.png"),
              activePic:require("../../assets/images/listedland_china_a.png"),
          },
          {
              name:"中国境外",
              areaId:'2',
              inactivePic:require("../../assets/images/regadr_foreign.png"),
              activePic:require("../../assets/images/regadr_foreign_a.png"),
          }
      ],
      //上市地
      stockZoneList:[
          {
              name:"计划上市中国境内",
              stockZoneId:'1',
              inactivePic:require("../../assets/images/stockland_china.png"),
              activePic:require("../../assets/images/stockland_china_a.png"),
          },
          {
              name:"计划上市中国境外",
              stockZoneId:'2',
              inactivePic:require("../../assets/images/stockland_foreign.png"),
              activePic:require("../../assets/images/stockland_foreign_a.png"),
          },
          {
              name:"上市计划尚未明确",
              stockZoneId:'3',
              inactivePic:require("../../assets/images/stockland_unconfirm.png"),
              activePic:require("../../assets/images/stockland_unconfirm_a.png"),
          },
          {
              name:"已上市中国境内",
              stockZoneId:'4',
              inactivePic:require("../../assets/images/stock_in_china.png"),
              activePic:require("../../assets/images/stock_in_china_a.png"),
          },
          {
              name:"已上市中国境外",
              stockZoneId:'5',
              inactivePic:require("../../assets/images/stock_in_foreign.png"),
              activePic:require("../../assets/images/stock_in_foreign_a.png"),
          }
      ],
      //轮次或增长预期
      roundGrowList:[],
      //轮次信息
      roundList: [
          {
              name:"A轮之前",
              roundId:'1',
              activePic:require("../../assets/images/cap_stage_pre_a_a.png"),
              inactivePic:require("../../assets/images/cap_stage_pre_a.png"),
          },
          {
              name:"A轮",
              roundId:'2',
              activePic:require("../../assets/images/cap_stage_a_a.png"),
              inactivePic:require("../../assets/images/cap_stage_a.png"),
          },
          {
              name:"B轮",
              roundId:'3',
              activePic:require("../../assets/images/cap_stage_b_a.png"),
              inactivePic:require("../../assets/images/cap_stage_b.png"),
          },
          {
              name:"C轮",
              roundId:'4',
              activePic:require("../../assets/images/cap_stage_c_a.png"),
              inactivePic:require("../../assets/images/cap_stage_c.png"),
          },
          {
              name:"D轮及以上",
              roundId:'5',
              activePic:require("../../assets/images/cap_stage_d_a.png"),
              inactivePic:require("../../assets/images/cap_stage_d.png"),
          }
      ],
      //上升趋势信息
      growTrendList: [
        {
            name:"有上升空间",
            roundId:'11',
            inactivePic:require("../../assets/images/develop_up.png"),
            activePic:require("../../assets/images/develop_up_a.png"),
        },
        {
            name:"趋于平衡",
            roundId:'12',
            inactivePic:require("../../assets/images/develop_steady.png"),
            activePic:require("../../assets/images/develop_steady_a.png"),
        }
    ],
    }
  },
  mounted () {
    this.roundGrowList = this.growTrendList
    if(this.stockZoneId < 4){
        this.roundGrowList = this.roundList
    }
  },
  components: {
    LdStepline,
    LdContentMain
  },
  methods: {
    actionChange(direction){
        //let _step = parseInt(this.step)
        if(direction === 1){
            switch (this.step){
                case 1:
                    if(this.areaId){
                        this.$router.push({path: '/design/d2'});
                    }else{
                        this.$message('请选择公司当前注册地');
                    }
                    break;
                case 2:
                    if(this.stockZoneId){
                        this.$router.push({path: '/design/d3'});
                    }else{
                        this.$message('请选择公司规划上市地或上市地');
                    }
                    break;
                case 3:
                    if(this.roundId){
                        //TODO:创建方案
                        this.$router.push({path: '/design/d4'});
                    }else{
                        let message = parseInt(this.stockZoneId) < 4 ? '请选择公司已完成的融资轮次' : '请选择您对公司未来股份的预期';
                        this.$message(message);
                    }
                    break;
                default:
                    break;
            }
        }else{
            this.$router.go(-1)
        }
    },
    onChooseArea(areaId){
      this.areaId = areaId
      localDb.set('areaId', areaId)
      localDb.set('stockZoneId', 0)
      localDb.set('roundId', 0)
      this.chooseArea(areaId)
    },
    onChooseStockZone(stockZoneId){
      this.stockZoneId = stockZoneId
      localDb.set('stockZoneId', stockZoneId)
      localDb.set('roundId', 0)
      this.chooseStockZone(this.areaId, stockZoneId)
    },
    onChooseRound(roundId){
      this.roundId = roundId
      localDb.set('roundId', roundId)
      this.chooseRound(this.areaId,this.stockZoneId,roundId)
    },
  }
}
</script>

<style lang="less">
  @import '../variables.less';
  @import '../mixins.less';

  .ld-pic-selector {
    text-align: center;
    height: 148px;
    line-height: 148px;
    overflow: hidden;
    .active{
      background-color: #bbd9f9;
    }
    li {
      display: inline-block;
      width: 120px;
      height: 148px;
      border: @border-default;
      text-align: center;
      padding: 0px 19px;
      position: relative;
      i{
        position: absolute;
        right: 2px;
        top: 2px;
        color: #0074f1;
      }
      img {
        display: inline-block;
      }
      p {
        font-size: 14px;
        line-height: 20px;
        color: #52575D;
        float: left;
        margin-top: -50px;
        width: 82px;
      }
      &+li {
        margin-left: 30px;
      }
    }
  }

  .zone-and-round {
    li {
      &+li {
        margin-left: 15px;
      }
    }
  }
</style>

