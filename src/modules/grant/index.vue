<template>
  <ld-page>
    <ld-header :active="2"></ld-header>
    <ld-stepbar :step="2"></ld-stepbar>
    <ld-content height="auto" style="margin-top: 25px;">
      <ld-content-main style="background-color: transparent;" :full="planType!=1">
        <div class="ld-table" style="background-color:#fff;">
          <table style="width: 100%;" v-if="planType==2">
            <colgroup>
              <col width="50%" />
              <col width="50%" />
            </colgroup>
            <tr class="stdh f12 grey"><th>激励工具</th><th>持股方式</th></tr>
            <tr class="stdh f16 bg-grey primary bold center">
              <td>{{plan.p_tool_type | filter-tool-type}}</td>
              <td>{{plan.p_keep_type | filter-keep-type}}</td>
            </tr>
          </table>
          <table style="width: 100%;" v-else>
            <colgroup>
              <col width="33.333%" />
              <col width="33.333%" />
              <col width="33.333%" />
            </colgroup>
            <tr class="stdh f12 grey"><th>注册地</th><th>(规划)上市地</th><th>发展阶段</th></tr>
            <tr class="stdh f16 bg-grey primary bold center">
              <td>{{company.c_reg_zone | filterCompanyRegarea}}</td>
              <td>{{company.c_stock_zone | filterCompanyStockarea}}</td>
              <td>{{company.c_round | filterCompanyExpround}}</td>
            </tr>
          </table>
        </div>

        <div class="ld-table ld-input-min" style="padding-bottom: 20px;background-color: #fff;">
          <table style="width: 100%;" border="0">
            <colgroup>
              <col width="33.333%" />
              <col width="33.333%" />
              <col width="33.333%" />
            </colgroup>
            <tr class="stdh f12 grey"><th>当前估值</th><th v-if="company.c_reg_zone == '1'">公司性质</th><th>股本数量</th></tr>
            <!-- 境内注册 -->
            <tr class="stdh f12" v-if="company.c_reg_zone == '1'">
              <td>
                <el-select :disabled="cap_stock_edit_disable" ref="currencyTypeSelect" @change="saveEditCompanyInfo" v-model="dataEditCompanyInfo.currency_type" style="float:left; margin-left: 40px; width: 98px;" placeholder="货币">
                  <el-option
                    v-for="(item, key) in currencyTypeOpts"
                    :key="key"
                    :label="item"
                    :value="key">
                  </el-option>
                </el-select>
                <el-input :disabled="cap_stock_edit_disable" ref="capValInput" @change="saveEditCompanyInfo" v-model="dataEditCompanyInfo.cap_val" style="float:left; width: 106px; margin-left: 11px;" placeholder="金额"></el-input>
              </td>
              <td>
                <el-select :disabled="cap_stock_edit_disable" @change="saveEditCompanyInfo" v-model="dataEditCompanyInfo.nature_type" style="width: 214px; margin-left: 25px;" placeholder="公司性质">
                  <el-option
                    v-for="(item, key) in companyTypeOpts"
                    :key="key"
                    :label="item"
                    :value="key">
                  </el-option>
                </el-select>
              </td>
              <td>
                <div v-if="dataEditCompanyInfo.nature_type == '1'" style="text-align: center; color: #94979a;">设定股本：100,000,000</div>
                <el-input :disabled="cap_stock_edit_disable" ref="stockValInput" v-else @change="saveEditCompanyInfo" v-model="dataEditCompanyInfo.stock_val" style="float: right; width: 214px; margin-right: 40px;" placeholder="输入已发行总股本"></el-input>
              </td>
            </tr>
            <!-- 境外注册 -->
            <tr class="stdh f12" v-if="company.c_reg_zone == '2'">
              <td>
                <el-select v-model="dataEditCompanyInfo.currency_type" @change="saveEditCompanyInfo" style="float:left; margin-left: 40px; width: 98px;" placeholder="货币">
                  <el-option
                    v-for="(item, key) in currencyTypeOpts"
                    :key="key"
                    :label="item"
                    :value="key">
                  </el-option>
                </el-select>
                <el-input v-model="dataEditCompanyInfo.cap_val" @change="saveEditCompanyInfo" style="float:left; width: 106px; margin-left: 11px;" placeholder="金额"></el-input>
              </td>
              <td>
                <el-input v-model="dataEditCompanyInfo.stock_val" @change="saveEditCompanyInfo" style="float: right; width: 214px; margin-right: 40px;" placeholder="输入已发行总股本"></el-input>
              </td>
            </tr>
          </table>
        </div>

        <div class="ld-grant-list">
          <div class="ld-grant-item" :class="{open: item.open}" v-for="(item, key) in grantStuffs" v-cloak>
            <div class="ld-grant__hd">
              <div class="ld-t" :style="{'border-color': item.color}">{{ item.title }}</div>
              <div class="ld-b">
                <div class="ld-l">
                  {{ item.desc }}
                </div>
                <div class="ld-r">
                  <template  v-if="planType==1">
                    <el-progress type="circle" :color="item.color" :width="66" :stroke-width="8" :percentage="marketCoverInfo[key] && marketCoverInfo[key].mc_value|percent-format"></el-progress>
                    <p class="ld-desc">
                      授予覆盖比例<br>
                      {{marketCoverInfo[key] && marketCoverInfo[key].mc_value|percent-format}}%
                    </p>
                  </template>
                  <div class="ld-arrow" @click="handleArrowClick(key)">
                    <span class="arrow"></span>
                  </div>
                </div>
              </div>
            </div>

            <div class="ld-grant__bd">
              <div class="ld-grant-table">
                <el-table
                  :data="store.states.tableData[key].data"
                  stripe
                  highlight-current-row
                  style="width: 100%">
                  <el-table-column
                    prop="pi_id"
                    label="ID"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    width="70"
                    prop="pi_grant_name"
                    label="姓名"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    :show-overflow-tooltip = "true"
                    prop="pi_grant_email"
                    label="邮箱"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    width="80"
                    prop="pi_staff_id"
                    label="岗位"
                    :formatter="staffTypeFormatter"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    width="100"
                    prop="pi_grant_stock"
                    label="授予股数"
                    align="center">
                    <template slot-scope="scope">
                      {{scope.row.pi_grant_stock|currency-format('0,0')}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    width="80"
                    prop="pi_strike_price"
                    label="行权价格"
                    align="center">
                    <template slot-scope="scope">
                      {{scope.row.pi_strike_price|currency-format('0,0.00', scope.row.pi_strike_currency)}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    :show-overflow-tooltip = "true"
                    prop="pi_lock_des"
                    label="生效安排描述"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    label="操作"
                    width="100"
                    align="center">
                    <template slot-scope="scope">
                      <span class="ld-icon ld-icon-notice" @click.stop="handleOnClickNotice(scope.row)"></span>
                      <el-popover
                        placement="bottom"
                        width="220"
                        trigger="hover">
                        <div style="text-align: center;">
                          <el-button size="mini" type="text" @click.stop="handleOnClickEditGrantBtn(scope.row)">编辑记录</el-button>
                          <el-button size="mini" type="text" @click.stop="handleOnClickViewProtocolBtn(scope.row)">查看协议</el-button>
                          <el-button size="mini" type="text" style="color: #F56C6C;" @click.stop="handleOnClickDeleteGrantBtn(scope.row)">删除记录</el-button>
                        </div>
                        <span slot="reference" class="ld-icon ld-icon-comunicate" style="margin-left: 8px;" @click.stop="handleOnClickMore(scope.row)"></span>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div class="ld-grant__ft">
                <div class="ld-l">
                  共<span class="num">{{store.states.tableData[key] && store.states.tableData[key].total || 0}}</span>人
                </div>
                <div class="ld-r" @click="handleOpenAddGrantDialog(item.type)">
                  <span class="plus">+</span>添加新成员
                </div>
              </div>
            </div>
          </div>
        </div>
      </ld-content-main>
      <ld-content-hover v-if="planType==1">
        <div class="ld-grant-rsider">
          <div class="ld-bd">
            <h3>输入总量与市场对比</h3>
            <p>基于最近连续12个月已发出授予邀请与所有处于编辑状态的授予记录相加进行判断</p>
            <div class="ld-plot-wrapper">
              <div class="ld-plot">
                <ld-plot3 ref="plot3"></ld-plot3>
              </div>
              <div class="ld-plot-ano">
                <div class="ld-xlabel"><span class="ld-l" style="position: relative; top: -3px;">偏低</span><span class="ld-c"></span><span class="ld-r" style="position: relative; top: -3px;">偏高</span></div>
                <ul style="margin: 10px 0 20px;">
                  <li><span class="ld-sb red"></span>最近连续12个月已发出授予邀请</li>
                  <li><span class="ld-sb blue"></span>所有处于编辑状态的授予记录</li>
                </ul>
              </div>
            </div>
            <!--  <div class="ld-botbar">
              <div class="ld-botbar-bd">查看实时进度</div>
              <div class="ld-botbar-ft"></div>
            </div> -->
          </div>
          <div class="ld-ft">
            <router-link v-if="plan.p_grant_time=='0'" class="ld-btn ld-btn-primary" to="/design/d4">上一步</router-link>
            <router-link class="ld-btn ld-btn-primary" :to="'/implement/'+planId">查看实时进度</router-link>
          </div>
        </div>
      </ld-content-hover>
    </ld-content>

    <ld-footer></ld-footer>
    <el-dialog :visible.sync="dialogVisible" :show-close="false" :custom-class="'ld-grant-dialog'+ (planType==1?'':' min')">
      <div class="ld-grant-add ld-input-min">
        <el-form class="ld-l" style="overflow-y: auto;">
          <p style="color: #FF4F51; font-size: 11px;">*请完善以下信息，方便我们更好地为您服务</p>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                个人信息
              </div>
              <div class="ld-form-group__bd">
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="dataAddGrant.grant_name"><span slot="prepend">姓名</span></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-select @change="handleStuffTypeChange" v-model="dataAddGrant.staff_id" placeholder="请选择岗位">
                      <span slot="prefix">岗位</span>
                      <el-option
                        v-for="(item, key) in stuffTypeOpts"
                        :key="key"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="dataAddGrant.grant_email"><span slot="prepend">邮箱</span></el-input>
                  </el-col>
                  <el-col :span="12">
                    <div class="ld-readonly">
                      <span class="ld-readonly__hd">ID</span>
                      <span class="ld-readonly__bd">{{dataAddGrant.sn}}</span>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-input v-model="dataAddGrant.grant_rate">
                      <div slot="prepend">授予比例<div class="ld-signalbars" :class="`s${grantRateLevel}`"><span class="ld-signalbar ld-signalbar1"></span><span class="ld-signalbar ld-signalbar2"></span><span class="ld-signalbar ld-signalbar3"></span></div></div>
                      <span slot="append">%</span>
                    </el-input>
                  </el-col>
                  <el-col :span="12">
                    <div class="ld-readonly">
                      <span class="ld-readonly__hd">授予股数</span>
                      <span class="ld-readonly__bd">{{dataAddGrant.grant_stock|currency-format('0,0')}}</span>
                      <span class="ld-readonly__ft">股</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                行权价规则
              </div>
              <div class="ld-form-group__bd">
                <el-row>
                  <el-col :span="24">
                    <el-select v-model="dataAddGrant.strike_type" placeholder="请选择行权规则" @change="handleOnStrikeTypeChange">
                      <el-option
                        v-for="(item, key) in strikeTypeOpts"
                        :key="key"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
                <!-- 按最近一轮融资估值 -->
                <el-row v-if="dataAddGrant.strike_type=='1'">
                  <el-col :span="8">
                    <div class="ld-readonly">
                      <span class="ld-readonly__hd">每股估值</span>
                      <span class="ld-readonly__bd">{{cap_per_stock|currency-format('0,0.00')}}</span>
                      <span class="ld-readonly__ft">元</span>
                    </div>
                  </el-col>
                  <el-col :span="8" style="padding-left:0;">
                    <div style="overflow:hidden;"><span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;"><i class="el-icon-close"></i></span><div style="margin-left: 20px;">
                    <el-input v-model="dataAddGrant.strike_val" placeholder="占比">
                      <span slot="append">%</span>
                    </el-input></div></div>
                  </el-col>
                  <el-col :span="8" style="padding-left:0;">
                    <div>
                      <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">=</span>
                      <div class="ld-readonly" style="margin-left: 20px;">
                        <span class="ld-readonly__hd">行权价</span>
                        <span class="ld-readonly__bd">{{dataAddGrant.strike_price|currency-format('0,0.000')}}</span>
                        <span class="ld-readonly__ft">元/股</span>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <!-- 按最近一个财年净资产 -->
                <el-row v-if="dataAddGrant.strike_type=='2'">
                  <el-col :span="3">
                    <el-select v-model="net_val_currency" placeholder="币种" @change="handleOnChangeNetValCurrency">
                      <el-option
                        v-for="(item, key) in currencyTypeOpts"
                        :key="key"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="12">
                    <div>
                      <div style="float:left; width: 80px;">
                        <el-input placeholder="净资产" v-model="dataAddGrant.net_val"></el-input>
                      </div>
                      <div style="margin-left: 80px;">
                        <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">÷</span>
                        <div class="ld-readonly" style="margin-left: 20px;">
                          <span class="ld-readonly__hd">总股本</span>
                          <span class="ld-readonly__bd">{{dataEditCompanyInfo.stock_val|currency-format('0,0')}}</span>
                          <span class="ld-readonly__ft">股</span>
                        </div>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="3" style="padding-left:0;">
                    <div style="overflow:hidden;">
                      <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">
                        ×
                      </span>
                      <div style="margin-left: 20px;">
                        <el-input placeholder="倍数" v-model="dataAddGrant.strike_val"></el-input>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="6" style="padding-left:0;">
                    <div>
                      <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">=</span>
                      <div class="ld-readonly" style="margin-left: 20px;">
                        <span class="ld-readonly__hd">行权价</span>
                        <span class="ld-readonly__bd">{{dataAddGrant.strike_price|currency-format('0,0.000')}}</span>
                        <span class="ld-readonly__ft">元/股</span>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <!-- 按股权价值 -->
                <el-row v-if="dataAddGrant.strike_type=='3'">
                  <template v-if="dataEditCompanyInfo.nature_type == '1'">
                    <el-col :span="3">
                      <el-select v-model="dataAddGrant.strike_currency" placeholder="币种">
                        <el-option
                          v-for="(item, key) in currencyTypeOpts"
                          :key="key"
                          :label="item"
                          :value="key">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="7">
                      <el-input placeholder="注册资本" v-model="dataAddGrant.reg_val"></el-input>
                    </el-col>
                    <el-col :span="7" style="padding-left:0;">
                      <div>
                        <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">÷</span>
                        <div class="ld-readonly" style="margin-left: 20px;">
                          <span class="ld-readonly__hd">总股本</span>
                          <span class="ld-readonly__bd">{{dataEditCompanyInfo.stock_val|currency-format('0,0')}}</span>
                          <span class="ld-readonly__ft">股</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="7" style="padding-left:0;">
                      <div>
                        <span style="float:left; width:20px;text-align:center;height:30px;line-height:30px;font-size:22px;">=</span>
                        <div class="ld-readonly" style="margin-left: 20px;">
                          <span class="ld-readonly__hd">行权价</span>
                          <span class="ld-readonly__bd">{{dataAddGrant.strike_price|currency-format('0,0.000')}}</span>
                          <span class="ld-readonly__ft">元/股</span>
                        </div>
                      </div>
                    </el-col>
                  </template>
                  <template v-else>
                    <el-col :span="12">
                      <span style="float:left; width:260px;text-align:right;height:30px;line-height:30px;font-size:14px; color:#94979a;">
                        股份有限公司每股价格作为行权价
                      </span>
                    </el-col>
                    <el-col :span="12">
                      <div>
                        <div class="ld-readonly">
                          <span class="ld-readonly__hd">行权价</span>
                          <span class="ld-readonly__bd">{{dataAddGrant.strike_price|currency-format('0,0.000')}}</span>
                          <span class="ld-readonly__ft">元/股</span>
                        </div>
                      </div>
                    </el-col>
                  </template>
                </el-row>
                <!-- 零价格 -->
                <el-row v-if="dataAddGrant.strike_type=='4'">
                  <div class="ld-readonly">
                    <span class="ld-readonly__hd">行权价</span>
                    <span class="ld-readonly__bd">0</span>
                    <span class="ld-readonly__ft">元/股</span>
                  </div>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group">
              <div class="ld-form-group__hd" style="position: relative;">
                <span>生效安排</span>
                <div style="position: absolute; right: 0px; top:-10px;">
                  <el-input v-if="toolType=='1'" v-model="dataAddGrant.effective_year" style="display: inline-block; width: 110px; height:20px; margin-right: 10px;" placeholder="有效时间"><span slot="suffix">年</span></el-input>
                  <el-switch
                    v-model="vestCustomerDefine"
                    @change="handleOnVestChange"
                    active-text="自定义">
                  </el-switch>
                </div>
              </div>
              <div class="ld-form-group__bd">
                <el-row v-if="vestCustomerDefine">
                  <el-col :span="24">
                    <el-form>
                      <el-row v-for="(item, index) in vestSetups" style="margin-top:0;">
                        <el-form-item
                          :key="index"
                          :rules="{
                            required: true, message: '不能为空', trigger: 'blur'
                          }"
                          >
                          <el-col :span="5">
                            <div>
                              <span style="float:left; width:50px;text-align:right;font-size:14px; color:#94979a;">
                                授予满
                              </span>
                              <div style="margin-left: 60px;">
<!--                                 <el-input v-model="item.month" @keyup="handleOnCustomerVestInput">
                                  <span slot="suffix">月</span>
                                </el-input> -->
                                <div class="el-input el-input--suffix">
                                  <input type="text" v-model="item.month" @keyup="handleOnCustomerVestInput" autocomplete="off" class="el-input__inner">
                                  <span class="el-input__suffix" style="top: 5px;">
                                    <span class="el-input__suffix-inner">
                                      <span>月</span>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="5" style="padding-left: 0;">
                            <div>
                              <span style="float:left; width:60px;text-align:center;font-size:14px; color:#94979a;">
                                生效
                              </span>
                              <div style="margin-left: 60px;">
<!--                                 <el-input v-model="item.percent" @keyup="handleOnCustomerVestInput">
                                  <span slot="suffix">%</span>
                                </el-input> -->
                                <div class="el-input el-input--suffix">
                                  <input type="text" v-model="item.percent" @keyup="handleOnCustomerVestInput" autocomplete="off" class="el-input__inner">
                                  <span class="el-input__suffix" style="top: 5px;">
                                    <span class="el-input__suffix-inner">
                                      <span>%</span>
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="4" v-if="index > 0">
                            <div style="font-size: 22px; color:#f56c6c;">
                              <i class="el-icon-remove" style="cursor: pointer;" @click.prevent="removeVestSetup(item)"></i>
                            </div>
                          </el-col>
                        </el-form-item>
                      </el-row>
                      <el-row style="margin-top:0;">
                        <el-col :span="10" style="padding-left: 20px;">
                          <div style="line-height: 22px; text-align: center; color:#94979a;">
                            <i class="el-icon-circle-plus" @click.prevent="addVestSetup" style="cursor: pointer; font-size: 22px; margin-top:4px; color: #67C23A; position:relative; top:2px;"></i>
                            <span style="margin-left: 5px;" :style="grantPercentStyle">
                              {{grantTotalPercent}}%
                            </span>
                          </div>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-col>
                </el-row>

                <el-row v-else>
                  <el-col :span="24">
                    <el-select v-model="dataAddGrant.vestPlan" @change="handleOnVestSelectChange" placeholder="请选择">
                      <el-option
                        v-for="(item, key) in vestPlanOpts"
                        :key="item.lock_tmpl"
                        :label="item.lock_des"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group"  v-if="planType==1">
              <div class="ld-form-group__hd">
                年化估值增长预期
              </div>
              <div class="ld-form-group__bd">
                <el-row>
                  <el-col :span="24">
                    <el-slider v-model="growthExpect" :max="growPlanMax" :format-tooltip="growthExpectSliderTooltip"></el-slider>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <el-button @click="handleOnAddGrant" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
        <div class="ld-r" v-if="planType==1">
          <div class="ld-fiugre">
            <div class="ld-hd">
              图表分析
            </div>
            <div class="ld-bd">
              <div class="ld-plot-wrap">
                <div class="ld-t">生效安排</div>
                <div class="ld-plot">
                  <ld-plot1 ref="plot1" :series="plot1Data" :total="dataAddGrant.grant_stock" :broken="dataAddGrant.effective_year"></ld-plot1>
                </div>
              </div>
              <div class="ld-plot-wrap">
                <div class="ld-t">预期价值</div>
                <div class="ld-plot">
                  <ld-plot2 ref="plot2" :series="plot2Data" :broken="10"></ld-plot2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 发出授予通知弹窗 -->
    <el-dialog width="400px" :visible.sync="dialogGrantNoticeVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">授予通知</div>
          <div v-if="grantStuff" style="margin-top: 10px;">
            您正在向
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_staff_id | filter-stuff-type(grantStuff.pi_staff_type)}} {{grantStuff && grantStuff.pi_grant_name}}</span>授予
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_grant_stock | currency-format('0,0')}}</span>股
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_tool_type | filter-tool-type}}</span><br>授予通知将发送至
            <span style="color:#FF4F51; margin:0 10px;">{{grantStuff && grantStuff.pi_grant_email}}</span>
          </div>
          <div class="ld-form-groups" style="margin-top: 30px;">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                被授予人信息
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="20">
                    <el-input v-model="doGrantIdCard" placeholder="被授予人身份证号">
                      <span slot="prepend">身份证</span>
                    </el-input>
                  </el-col>
                </el-row>
                <el-row :gutter="10" style="margin-top: 20px;">
                  <el-col :span="20">
                    <el-date-picker
                      v-model="doGrantDate"
                      value-format="timestamp"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="ld-form-group" v-if="company.c_reg_zone==2">
              <div class="ld-form-group__hd">
                股权激励授予主体
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="20">
                    <el-input v-model="doGrantSignSubject" placeholder="VIE公司注册英文名"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="ld-remind" v-if="planType==2">
            以上授予股数基于公司总股本<span style="margin:0 5px;">{{company && company.c_stock_val|currency-format('0,0')}}</span>股, 总估值<span style="margin:0 5px;">{{company && company.c_cap_val|currency-format('0,0.00', company.c_cap_currency)}}</span>。如信息准确可点击“确认”发送通知。如信息有误请关闭弹窗调整数据后再发送
            </div>
          </div>
          <el-button @click.stop="hadleOnClickGrantNoticeSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <ld-grant-dialog ref="grantEditDialog"></ld-grant-dialog>
    <ld-grant2-dialog ref="grant2Dialog"></ld-grant2-dialog>
  </ld-page>
</template>

<script>
import grant from './grant.js'

export default grant
</script>

<style lang="less">
@import './grant.less';
</style>
