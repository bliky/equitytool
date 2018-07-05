<template>
    <div class="win3 ld-input-min">
      <div class="win3-tit win-tit">公司目标设定</div>
      <div class="recommend">推荐目标不超过3项</div>

      <div class="selWrap">
          <div class="win3-sel">
              <div class="sel-list">
                    <div class="target" v-for="(item, index) in sdata">
                          <div class="clear titWrap">
                              <div class="target-tit">
                                <sub class="fontColorRed">*</sub>
                                <div class="target-text">目标{{convertNum[index]}}</div>
                              </div>
                              <div class="custom">
                                <el-switch
                                  v-model="item.iscustom"
                                  @change="customSwitch"
                                  active-text="自定义">
                                </el-switch>
                              </div>
                          </div>
                          <div class="win3-row" v-if="item.iscustom">
                              <el-row :gutter="10">
                                <el-col :span="24">
                                  <el-select v-model="item.t1">
                                    <span slot="prefix">指定目标</span>
                                    <el-option
                                        v-for="sitem in sample"
                                        :label="sitem.t1"
                                        :value="sitem.t1">
                                    </el-option>
                                  </el-select>
                                </el-col>
                              </el-row>
                          </div>

                          <div class="win3-row" v-else>
                              <el-row :gutter="10">
                                <el-col :span="24">
                                  <el-input v-model="item.t1">
                                    <span slot="prefix">指定目标</span>
                                  </el-input>
                                </el-col>
                              </el-row>
                          </div>

                          <div class="win3-row" style="margin-bottom:0">
                              <el-row :gutter="10">
                                <el-col :span="24">
                                  <el-input placeholder="金额" v-model="item.t2">
                                    <span slot="prefix">目标设定</span>
                                  </el-input>
                                </el-col>
                              </el-row>
                          </div>

                          <div v-if="index!==0">
                            <div class="del-target" @click="delTarget(index)">删除</div>
                          </div>

                          <div v-else>
                            <div class="del-target"></div> 
                          </div>
                    </div>
              </div>

              <div class="add-target" @click="addNewTarget">添加新目标</div>
          </div>

      </div>

      <div class="btn3">
        <el-button @click.stop="dialogSure" 
        style="margin: 0 auto;display: block;" type="primary" size="small" round>确定</el-button>
      </div>
    </div>
</template>

<script>
export default {
  props:['sdata'],
  mounted () {
    console.log(this.sdata);
  },
  data () {
    return {
      sample:[
        {
          t1:'事例一'
        },
        {
          t1:'事例二'
        },
      ],
      convertNum:{0:'一',1:'二',2:'三'}
    }
  },
  components: {

  },
  computed: {
  },
  methods: {
    customSwitch(e){
      console.log(e)
      console.log(this.sdata)
    },
    dialogSure(){
      console.log(0)
      this.$emit('dialogSure',this.sdata,false);
    },
    addNewTarget(){
      if(this.sdata.length<4){
        this.sdata.push({
          iscustom:false,
          t1:'',
          t2:''
        })
      }else{
        this.$alert('最多添加三个目标', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
        });
      }
    },
    delTarget(index){
      this.sdata.splice(index,1)
    }
  }
}
</script>
<style lang="less">
  .el-dialog__headerbtn{
    z-index: 9990
  }
  .win3{
    min-height: 400px;
    padding-left: 20px;
  }
  .win3-tit{
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
  .titWrap{
    width: 100%;
    height: 30px;
    line-height: 30px;
  }
  .sel-list{
    width: 430px;
    overflow-y: auto;
    overflow-x: hidden;
    height: 260px;
  }
  .del-target{
    cursor: pointer;
    margin-top:6px; 
    padding-right: 4px;
    font-size: 12px;
    text-align: right;
    height: 12px;
    line-height: 12px;
    color: #DFE0E1;
  }
  .target{
    width: 400px;
  }
  .target-tit{
    cursor: default;
    width: 70%;
    float: left;
    color: #2b2b2b;
    font-size: 14px;
  }
  .target-text{
    display: inline-block;
    margin-left: 6px;
  }
  .custom{
    cursor: pointer;
    width: 30%;
    float: left;
    text-align: right;
    color: #2b2b2b;
    font-size: 13px;
  }
  .recommend{
    cursor: default;
    color: #dfe0e1;
    font-size: 13px;
    margin-bottom: 8px;
  }
  .selWrap{
    min-height: 300px;
  }
  .win3-row{
    margin-bottom: 18px;
  }
  .win3 .el-input__inner{
    text-align: right;
  }
  .add-target{
    cursor: pointer;
    color: #bbd9f9;
  }
  .btn3{
    clear: both;
    float: left;
    margin-left: 5px;
  }
</style>