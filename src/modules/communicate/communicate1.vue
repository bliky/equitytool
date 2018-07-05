<template>
<div class="communicateWrap">
  <div class="communicate">
      <div class="tab" v-bind:style="{display:2 === currentIndex ? 'none' : 'block'}">
        <ul class="nav">
          <li v-for="(item,index) in tabData" 
          @click="tab(index)"
          v-bind:class="{'active': index === currentIndex}">{{item.nav}}</li>
        </ul>
        <div class="content" 
            v-loading="loading" 
            element-loading-text="数据加载中">
          <div class="content-1" v-bind:style="{display:0 === currentIndex ? 'block' : 'none'}">
              <div class="step">
                <div class="l-triangle"></div>
                <div class="c-rect"></div>
                <div class="r-triangle"></div>

                <div class="circleWrap">
                  <div class="circle circle1" @click="step(1)">
                    <div class="circle-bgcolor" v-bind:class="[{ 'active': Number(stepNum) >= 0 } ]"> 
                      <div class="circle-bg"></div>
                      <div class="num">1</div>
                    </div>
                  </div>
                  <div class="circle circle2" @click="step(2)">
                    <div class="circle-bgcolor" 
                      v-bind:class="[{'beActive':Number(stepNum) == 1},{ 'active': Number(stepNum) > 1 } ]"> 
                      <div class="circle-bg"></div>
                      <div class="num">2</div>
                    </div>
                  </div>
                  <div class="circle circle3" @click="step(3)">
                    <div class="circle-bgcolor" 
                      v-bind:class="[{'beActive':Number(stepNum) == 2},{ 'active': Number(stepNum) > 2 } ]"> 
                      <div class="circle-bg"></div>
                      <div class="num">3</div>
                    </div>
                  </div>
                  <div class="circle circle4" @click="step(4)">
                    <div class="circle-bgcolor" 
                      v-bind:class="[{'beActive':Number(stepNum) == 3},{ 'active': Number(stepNum) > 3 } ]"> 
                      <div class="circle-bg"></div>
                      <div class="num">4</div>
                    </div>
                  </div>
                </div>
                
                <div class="textWrap">
                  <div class="onestepWrap">
                    <div class="onestep-tit">设定沟通场景</div>
                    <div class="onestep-content">
                      {{typeData[type]}}
                    </div>
                  </div>
                  <div class="onestepWrap">
                    <div class="onestep-tit">设定估值信息</div>
                    <div class="onestep-content">
                        <div>公司未来{{val_month}}个月后</div>
                        <div>期望达到的估值目标是</div>
                        <div>{{convertToken}} {{convertCapval}}</div>
                    </div>
                  </div>
                  <div class="onestepWrap">
                    <div class="onestep-tit">设定公司目标</div>
                    <div class="onestep-content" v-if="companytargets">
                        <div>公司未来{{val_month}}个月后</div>
                        <div>指标 {{companytargets[0].t1}}</div>
                        <div>目标 {{companytargets[0].t2}}</div>
                    </div>
                  </div>
                  <div class="onestepWrap">
                    <div class="onestep-tit">设定专属领域目标</div>
                    <div class="onestep-content">
                      设定描述
                    </div>
                  </div>

                </div>
              </div>
          </div>

          <div class="content-2" v-bind:style="{display:1 === currentIndex ? 'block' : 'none'}">
              <ul class="history">
                <li v-for="(item,index) in history" 
                    @click="checkCurrentMsg(item.vc_id)">
                    <div class="time">
                      <span class="t-ico"></span>
                      <span class="t-txt">{{item.vc_update_time}}</span>
                    </div>
                    <div class="them">{{typeData[item.vc_type]}}</div>
                    <div class="l-cont" v-if="Number(item.vc_type) == 1">
                      展望未来，当公司估值达到{{item.vc_cap_val}}时，股权激励的预期价值
                    </div>
                    <div class="l-cont" v-if="Number(item.vc_type) == 2">
                      回顾过去，公司已完成的最近一轮融资，估值达到{{item.vc_cap_val}}时，股权激励的对应价值
                    </div>
                </li>
              </ul>

              <div class="pagination">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="total"
                    @current-change="handleCurrentChange"
                    >
                  </el-pagination>
              </div>

          </div>
        </div>
      </div>
      <!-- 设定沟通场景弹窗 -->
      <el-dialog width="860px" :visible.sync="dialog1"  custom-class="dialog1">
           <div class="win1">
              <div class="win1-tit win-tit">设定沟通场景</div>
              <div class="win1-entry check">
                <div class="entry entry1">
                  <div class="entry-bg" v-bind:class="{active : Number(tempType) == 10}" @click="choose(1)">
                    <div class="entry-txt">展望未来</div>
                    <div class="right-ico">
                      <div class="el-icon-check"></div>
                    </div>
                  </div>
                </div>
                <div class="entry entry2">
                  <div class="entry-bg" v-bind:class="{active : Number(tempType) == 20}" @click="choose(2)">
                    <div class="entry-txt">回顾过去</div>
                    <div class="right-ico">
                      <div class="el-icon-check"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="btn1">
                <el-button @click.stop="dialog1Sure" :disabled="!tempType" style="margin: 0 auto;display: block;" type="primary" size="small" round>确定</el-button>
              </div>
           </div>
      </el-dialog>

      <!-- 设定估值信息弹窗 -->
      <el-dialog width="480px" :visible.sync="dialog2"  custom-class="dialog2">
           <div class="win2 ld-input-min">
              <div class="win2-tit win-tit">未来估值</div>
              <div class="win2-sel-tit clear">
                <div class="sel-ico"></div>
                <div class="sel-text">公司计划目标时间</div>
              </div>
              <div class="month">
                <el-input v-model="val_month" placeholder=""><span slot="suffix">月</span></el-input>
              </div>
              <div class="win2-sel-tit clear"> 
                <div class="sel-ico"></div>
                <div class="sel-text">期望达到的每股估值目标</div>
              </div>

              <div class="sel">
                <el-row :gutter="10">
                  <el-col :span="9">
                    <el-select v-model="cap_currency">
                      <span slot="prefix">货币选择</span>
                      <el-option
                        v-for="(item, key) in currencyTypeOpts"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="14">
                    <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">估值/股</span></el-input>
                  </el-col>
                </el-row>
              </div>

              <div style="margin-left:12px;color:#94979a;cursor: default;">
                与当前估值******元相比，增长了<span style="color: #ff4f51;">***</span>%
              </div>

              <div style="margin:42px 0 0 6px;">
                <el-checkbox v-model="is_public">向激励对象公开详细估值信息</el-checkbox>
              </div>

              <div class="btn2">
                <el-button @click.stop="dialog2Sure" 
                style="margin: 0 auto;display: block;" type="primary" size="small" round>确定</el-button>
              </div>
           </div>
      </el-dialog>

      <!-- 设定公司目标 -->
      <el-dialog width="480px" :visible.sync="dialog3"  custom-class="dialog3">
          <target-sel :sdata="companytargets" @dialogSure="dialog3Sure"></target-sel>
      </el-dialog>

      <!-- 设定专属领域目标 --> 
      <div class="field-goal" v-bind:style="{display:2 === currentIndex ? 'block' : 'none'}">
        <table class="table">
          <thead>
            <tr>
              <td>岗位</td>
              <td>高层管理</td>
              <td>中层管理</td>
              <td>基层管理</td>
              <td>核心员工</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="col-1">技术系列</td>
              <td class="col-2" rowspan="3">
                <div class="div aset">
                  <div class="text">已设定</div>
                  <div class="edit">
                    <div class="QR"></div>
                    <div class="pen"></div>
                  </div>
                </div>
              </td>
              <td class="col-3">
                <div class="div aset">
                  <div class="text">已设定</div>
                  <div class="edit">
                    <div class="QR"></div>
                    <div class="pen"></div>
                  </div>
                </div>
              </td>
              <td class="col-4">
                <div class="div unset">
                  <div class="text">未设定</div>
                </div>
              </td>
              <td class="col-5">
                <div class="div unset">
                    <div class="text">未设定</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="col-1">产品系列</td>
              <td class="col-3">
                <div class="div aset">
                  <div class="text">已设定</div>
                  <div class="edit">
                    <div class="QR"></div>
                    <div class="pen"></div>
                  </div>
                </div>
              </td>
              <td class="col-4">
                <div class="div unset">
                  <div class="text">未设定</div>
                </div>
              </td>
              <td class="col-5">
                <div class="div unset">
                    <div class="text">未设定</div>
                </div>
              </td>
            </tr>
            <tr>
              <td class="col-1">设计系列</td>
              <td class="col-3">
                <div class="div aset">
                  <div class="text">已设定</div>
                  <div class="edit">
                    <div class="QR"></div>
                    <div class="pen"></div>
                  </div>
                </div>
              </td>
              <td class="col-4">
                <div class="div unset">
                  <div class="text">未设定</div>
                  <div class="nTarget">
                    <div class="t-row">延用<span class="fontColorBlue t1">设计-基层</span> 沟通目标</div>
                    <div class="t-row">延用<span class="fontColorBlue t1">设计-中层</span>沟通目标</div>
                    <div class="t-row">设定<span class="fontColorBlue t0">新目标</span></div>
                  </div>
                </div>
              </td>
              <td class="col-5">
                <div class="div unset">
                    <div class="text">未设定</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 设定专属领域目标弹窗 -->  
      <el-dialog width="860px" :visible.sync="dialog4"  custom-class="dialog4">
          <target-sel :sdata="companytargets" @dialogSure="dialog4Sure"></target-sel>
          <div class="contactlist">
            
          </div>
      </el-dialog> 

      <el-button type="text" @click="dialog1Warn"></el-button>

  </div>
</div>
</template>

<script>
import communicate from './communicate.js'
export default communicate
</script>

<style lang="less">
  @import './communicate.less';
</style>
