<template>
  <ld-page>
    <ld-header :active="3"></ld-header>
    <!-- dashboard -->
    <div class="ld-plan-topbar" v-if="!viewMode">
      <div class="ld-main">
        <div class="ld-box">
          <!-- <p class="ld-welcome"><span class="ld-icon-hi"></span>, 欢迎来到灵动未来！</p> -->
          <div class="ld-data-panel">
            <p class="ld-t">股权激励池<span style="color: #7db8f6;">占比</span></p>
            <div class="ld-b">
              <div class="ld-plot">
                <ld-plot4 ref="plot1" :series="plot1Data"></ld-plot4>
              </div>
              <div class="ld-ano">
                <a v-if="!edit_stock_encourage_percent" @click.stop="edit_stock_encourage_percent=true" style="color: #0074f1; font-size: 12px; cursor: pointer;">修改<i style="margin-left: 5px;" class="el-icon-edit"></i></a>
                <div v-else class="ld-input-min" style="width: 90px; margin-left:auto; margin-right:auto;">
                <el-input
                  @change="handleOnChangeStockPercent"
                  placeholder="股权激励池占比"
                  v-model="stock_encourage_percent">
                  <span slot="suffix">%</span>
                </el-input></div>
              </div>
            </div>
          </div>
        </div>
        <div class="ld-box">
          <div class="ld-data-panel">
            <p class="ld-t">股权激励池<span style="color: #3f96f4;">使用情况</span></p>
            <div class="ld-b">
              <div class="ld-plot">
                <ld-plot4 ref="plot2" :series="plot2Data"></ld-plot4>
              </div>
              <div class="ld-ano">
                <div style="text-align:left; width:100px; margin-left: auto; margin-right:auto;">
                  <span class="sbar red"></span>决策中 {{decisionPercent}}%
                </div>
                <div style="text-align:left; width:100px; margin-left: auto; margin-right:auto;">
                  <span class="sbar blue"></span>已授予 {{grantedPercent}}%
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ld-box ld-box-lg">
          <div class="ld-data-panel">
            <p class="ld-t">已授予股权<span style="color: #3f96f4;">激励分布</span></p>
            <div class="ld-b">
              <el-row>
                <el-col :span="8">
                  <div class="ld-plot">
                    <ld-plot5 ref="plot3" :series="plot3Data"></ld-plot5>
                  </div>
                  <div class="ld-ano">
                    <p>各层级比例</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="ld-plot">
                    <ld-plot5 ref="plot4" :series="plot4Data"></ld-plot5>
                  </div>
                  <div class="ld-ano">
                    <p>各职位类型比例</p>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="ld-plot">
                    <ld-plot5 ref="plot5" :series="plot5Data"></ld-plot5>
                  </div>
                  <div class="ld-ano">
                    <p>已解锁/未解锁比例</p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 方案查看列表 -->
    <template v-if="viewMode">
    <div class="ld-plan-topbar autoheight">
      <div class="ld-main">
        <el-row :gutter="16">
          <template v-for="(item, key) in planList">
            <el-col :span="6" v-if="item.p_tool_type === '1'">
              <div class="ld-plan mini" :class="{blue: item.history == 0, active: item.checked}" @click.stop="handleOnPlanCheckClick(item.p_id, item, $event)">
                <div class="ld-plan__hd" v-if="item.history == 0">
                  <span class="ld-icon ld-icon-plan-now"></span>当前方案<span style="margin-left:10px;">{{ item.p_create_time|time-format('YYYY/MM/DD HH:MM') }}</span>
                </div>
                <div class="ld-plan__hd his" v-else>
                  <span class="ld-icon ld-icon-plan-his"></span>历史方案<span style="margin-left:10px;">{{ item.p_create_time|time-format('YYYY/MM/DD HH:MM') }}</span>
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">股票期权<br><span style="font-size: 12px; color:#94979a;">{{item.p_round|filter-company-round}}</span></div>
                  <div class="ld-r">
                    <template v-if="item.p_grant_time!='0'"><p style="color: #52575d;">最新于&nbsp;{{item.p_grant_time|time-format('YYYY-MM-DD')}}<br>发出授予</p></template>
                    <template v-else>尚未依据本方案向激励对象发出授予通知</template>
                  </div>
                </div>
                <div class="mask"><i class="el-icon-circle-check checked"></i></div>
              </div>
            </el-col>

            <el-col :span="6" v-if="item.p_tool_type === '2'">
              <div class="ld-plan mini" :class="{blue: item.history == 0, active: item.checked}" @click.stop="handleOnPlanCheckClick(item.p_id, item, $event)">
                <div class="ld-plan__hd" v-if="item.history == 0">
                  <span class="ld-icon ld-icon-plan-now"></span>当前方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
                </div>
                <div class="ld-plan__hd his" v-else>
                  <span class="ld-icon ld-icon-plan-his"></span>历史方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">限制性股票<br><span style="font-size: 12px; color:#94979a;">{{item.p_round|filter-company-round}}</span></div>
                  <div class="ld-r">
                    <template v-if="item.p_grant_time!='0'"><p style="color: #52575d;">最新于&nbsp;{{item.p_grant_time|time-format('YYYY-MM-DD')}}<br>发出授予</p></template>
                    <template v-else>尚未依据本方案向激励对象发出授予通知</template>
                  </div>
                </div>
                <div class="mask"><i class="el-icon-circle-check checked"></i></div>
              </div>
            </el-col>

            <el-col :span="6" v-if="item.p_tool_type === '3'">
              <div class="ld-plan mini" :class="{blue: item.history == 0, active: item.checked}" @click.stop="handleOnPlanCheckClick(item.p_id, item, $event)">
                <div class="ld-plan__hd" v-if="item.history == 0">
                  <span class="ld-icon ld-icon-plan-now"></span>当前方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
                </div>
                <div class="ld-plan__hd his" v-else>
                  <span class="ld-icon ld-icon-plan-his"></span>历史方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">员工入股<br><span style="font-size: 12px; color:#94979a;">{{item.p_round|filter-company-round}}</span></div>
                  <div class="ld-r">
                    <template v-if="item.p_grant_time!='0'"><p style="color: #52575d;">最新于&nbsp;{{item.p_grant_time|time-format('YYYY-MM-DD')}}<br>发出授予</p></template>
                    <template v-else>尚未依据本方案向激励对象发出授予通知</template>
                  </div>
                </div>
                <div class="mask"><i class="el-icon-circle-check checked"></i></div>
              </div>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>

    <div class="ld-plan-viewer" style="background-color: #fff;">
      <h3 class="ld-t3">下列授予数据基于公司总股本为<span style="margin:0 5px;">{{company && company.c_stock_val|currency-format('0,0')}}</span>股, 总估值为<span style="margin:0 5px;">{{company && company.c_cap_val|currency-format('0,0.00', company.c_cap_currency)}}</span></h3>
      <div style="text-align: center; margin-top: 20px;">
        <span class="ld-icon-arrowdowm"></span>
      </div>
      <div class="ld-plan-btns left">
        <span class="ld-text">如果股份发生变化，请进行修改</span>
        <span class="ld-opt-btn" @click.stop="handleOnClickRongZengBtn">再融资/增资</span>
        <span class="ld-opt-btn" @click.stop="handleOnClickVieBtn">搭建VIE</span>
        <span class="ld-opt-btn" @click.stop="handleOnClickGufenzhigaiBtn">股份制改造</span>
        <span class="ld-opt-btn" @click.stop="handleOnClickChaiguBtn">拆股</span>
        <span class="ld-opt-btn" @click.stop="handleOnClickBingguBtn">并股</span>
        <span class="ld-opt-btn" @click.stop="handleOnClickZibenzzBtn">资本金转增</span>
      </div>
      <div class="ld-plan-table">
        <div class="ld-grant-table">
          <el-table
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="tableData"
            :span-method="arraySpanMethod"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              prop="pi_grant_name"
              label="姓名"
              align="center"
              width="80">
            </el-table-column>
            <el-table-column
              width="60"
              label="岗位"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_staff_id|filter-stuff-type(scope.row.pi_staff_type) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="激励工具"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_tool_type|filter-tool-type }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="80"
              prop="pi_grant_stock"
              label="授予股数"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_grant_stock|currency-format('0,0') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="120"
              prop="pi_strike_price"
              label="行权价格/入股价格"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_strike_price|currency-format('0,0.00', scope.row.pi_strike_currency) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pi_effect_stock"
              label="已生效股数"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_effect_stock|currency-format('0,0') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="未生效股数"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_grant_stock - scope.row.pi_effect_stock|currency-format('0,0') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pi_used_stock"
              label="已行权/兑现股数"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_used_stock|currency-format('0,0') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="已生效价值"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_effect_stock * (capValPerStock - currencyExchange(scope.row.pi_strike_currency, company.c_cap_currency)*scope.row.pi_strike_price)|currency-format('0,0.00', company.c_cap_currency) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="未生效价值"
              align="center">
              <template slot-scope="scope">
                <span>{{ (scope.row.pi_grant_stock - scope.row.pi_effect_stock) * (capValPerStock - currencyExchange(scope.row.pi_strike_currency, company.c_cap_currency)*scope.row.pi_strike_price)|currency-format('0,0.00', company.c_cap_currency) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="已行权/兑现价值"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.pi_used_stock * (capValPerStock - currencyExchange(scope.row.pi_strike_currency, company.c_cap_currency)*scope.row.pi_strike_price)|currency-format('0,0.00', company.c_cap_currency) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <p style="text-align: left; margin-top: 15px; color: #94979a; font-size: 12px;">共<span>{{fetchGrantsTotal}}</span>人</p>
        <el-pagination
          v-if="fetchGrantsTotal>0"
          background
          layout="prev, pager, next"
          :total="fetchGrantsTotal"
          :page-size="grantsPageSize"
          :current-page="currentGrantsPage"
          style="margin-top: 45px;"
          @size-change="handleOnPagerSizeChange"
          @current-change="handleOnPagerCurrentChange"
          @prev-click="handleOnPagerClickPrev"
          @next-click="handleOnPagerClickNext">
        </el-pagination>
      </div>
    </div>
    </template>

    <template v-if="!viewMode">
    <div class="ld-pibar">
      <div class="ld-l">共<span>{{planTotal}}</span>个方案</div>
      <div class="ld-r">
        <router-link to="/design" class="plustext"><span style="margin-left: 15px;">新方案设计</span></router-link>
        <router-link to="/entry" class="plustext"><span style="margin-left: 15px;">录入已设计方案</span></router-link>
      </div>
    </div>

    <!-- 方案列表 -->
    <div class="ld-plans">
      <el-row :gutter="16">
        <template v-for="(item, key) in planList">
          <!-- 股票期权 -->
          <el-col :span="6" v-if="item.p_tool_type === '1'">
            <div class="ld-plan" :class="{blue: item.history == 0}" @click.stop="handleOnGrantViewClick(item.p_id, item)">
              <div class="ld-plan__hd" v-if="item.p_type == 2">
                <span class="ld-icon ld-icon-plan-now"></span>录入方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__hd" v-else-if="item.history == 0">
                <span class="ld-icon ld-icon-plan-now"></span>当前方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__hd his" v-else>
                <span class="ld-icon ld-icon-plan-his"></span>历史方案<span style="margin-left:10px;">{{ item.p_create_time|time-format('YYYY/MM/DD HH:MM') }}</span>
              </div>
              <div class="ld-plan__bd">
                <div class="ld-l">股票期权<br><span style="font-size: 12px; color:#94979a;">{{item.p_round|filter-company-round}}</span></div>
                <div class="ld-r">
                  <template v-if="item.p_grant_time!='0'"><p style="color: #52575d;">最新于&nbsp;{{item.p_grant_time|time-format('YYYY-MM-DD')}}<br>发出授予</p></template>
                  <template v-else>尚未依据本方案向激励对象发出授予通知</template>
                </div>
              </div>
              <div class="ld-plan__ft">
                <el-row>
                  <el-col :span="8">
                    <!-- 增加授予，考虑到目前方案ID是数据自增，将方案ID存储在localStorage, 后期考虑路由参数方式传递 -->
                    <div v-if="item.history == 1 && item.p_type == 1" class="ld-plan-btn disable" @click.stop="">
                      <i class="ld-icon ld-icon-addgrant"></i>
                      <p>增加授予</p>
                    </div>
                    <div v-else class="ld-plan-btn" @click.stop="handleOnGrantAddClick(item.p_id, item)">
                      <i class="ld-icon ld-icon-addgrant"></i>
                      <p>增加授予</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <!-- <router-link :to="'/plan/' + item.p_id"> -->
                      <div class="ld-plan-btn" @click.stop="handleOnGrantImplementClick(item.p_id, item)">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看进度</p>
                      </div>
                    <!-- </router-link> -->
                  </el-col>
                  <el-col :span="8">
                    <div v-if="item.p_grant_time!='0'" class="ld-plan-btn disable" @click.stop="">
                      <i class="ld-icon ld-icon-del"></i>
                      <p>删除方案</p>
                    </div>
                    <div v-else class="ld-plan-btn" @click.stop="handleOnPlanDeleteClick(item.p_id, item)">
                      <i class="ld-icon ld-icon-del"></i>
                      <p>删除方案</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <i class="el-icon-circle-check unchecked"></i>
            </div>
          </el-col>
          <!-- 限制性股票 -->
          <el-col :span="6" v-if="item.p_tool_type === '2'">
            <div class="ld-plan" :class="{blue: item.history == 0}" @click.stop="handleOnGrantViewClick(item.p_id, item)">
              <div class="ld-plan__hd" v-if="item.p_type == 2">
                <span class="ld-icon ld-icon-plan-now"></span>录入方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__hd" v-else-if="item.history == 0">
                <span class="ld-icon ld-icon-plan-now"></span>当前方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__hd his" v-else>
                <span class="ld-icon ld-icon-plan-his"></span>历史方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__bd">
                <div class="ld-l">限制性股票<br><span style="font-size: 12px; color:#94979a;">{{item.p_round|filter-company-round}}</span></div>
                <div class="ld-r">
                  <template v-if="item.p_grant_time!='0'"><p style="color: #52575d;">最新于&nbsp;{{item.p_grant_time|time-format('YYYY-MM-DD')}}<br>发出授予</p></template>
                  <template v-else>尚未依据本方案向激励对象发出授予通知</template>
                </div>
              </div>
              <div class="ld-plan__ft">
                <el-row>
                  <el-col :span="8">
                    <!-- 增加授予，考虑到目前方案ID是数据自增，将方案ID存储在localStorage, 后期考虑路由参数方式传递 -->
                    <div v-if="item.history == 1 && item.p_type == 1" class="ld-plan-btn disable" @click.stop="">
                      <i class="ld-icon ld-icon-addgrant"></i>
                      <p>增加授予</p>
                    </div>
                    <div v-else class="ld-plan-btn" @click.stop="handleOnGrantAddClick(item.p_id, item)">
                      <i class="ld-icon ld-icon-addgrant"></i>
                      <p>增加授予</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <!-- <router-link :to="'/plan/' + item.p_id"> -->
                      <div class="ld-plan-btn" @click.stop="handleOnGrantImplementClick(item.p_id, item)">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看进度</p>
                      </div>
                    <!-- </router-link> -->
                  </el-col>
                  <el-col :span="8">
                    <div v-if="item.p_grant_time!='0'" class="ld-plan-btn disable" @click.stop="">
                      <i class="ld-icon ld-icon-del"></i>
                      <p>删除方案</p>
                    </div>
                    <div v-else class="ld-plan-btn" @click.stop="handleOnPlanDeleteClick(item.p_id, item)">
                      <i class="ld-icon ld-icon-del"></i>
                      <p>删除方案</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <i class="el-icon-circle-check unchecked"></i>
            </div>
          </el-col>
          <!-- 限制性股票 -->
          <el-col :span="6" v-if="item.p_tool_type === '3'">
            <div class="ld-plan" :class="{blue: item.history == 0}" @click.stop="handleOnGrantViewClick(item.p_id, item)">
              <div class="ld-plan__hd" v-if="item.p_type == 2">
                <span class="ld-icon ld-icon-plan-now"></span>录入方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__hd" v-else-if="item.history == 0">
                <span class="ld-icon ld-icon-plan-now"></span>当前方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__hd his" v-else>
                <span class="ld-icon ld-icon-plan-his"></span>历史方案<span style="margin-left:10px;">{{ item.p_create_time|time-format }}</span>
              </div>
              <div class="ld-plan__bd">
                <div class="ld-l">员工入股<br><span style="font-size: 12px; color:#94979a;">{{item.p_round|filter-company-round}}</span></div>
                <div class="ld-r">
                  <template v-if="item.p_grant_time!='0'"><p style="color: #52575d;">最新于&nbsp;{{item.p_grant_time|time-format('YYYY-MM-DD')}}<br>发出授予</p></template>
                  <template v-else>尚未依据本方案向激励对象发出授予通知</template>
                </div>
              </div>
              <div class="ld-plan__ft">
                <el-row>
                  <el-col :span="8">
                    <!-- 增加授予，考虑到目前方案ID是数据自增，将方案ID存储在localStorage, 后期考虑路由参数方式传递 -->
                    <div v-if="item.history == 1 && item.p_type == 1" class="ld-plan-btn disable" @click.stop="">
                      <i class="ld-icon ld-icon-addgrant"></i>
                      <p>增加授予</p>
                    </div>
                    <div v-else class="ld-plan-btn" @click.stop="handleOnGrantAddClick(item.p_id, item)">
                      <i class="ld-icon ld-icon-addgrant"></i>
                      <p>增加授予</p>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <!-- <router-link :to="'/plan/' + item.p_id"> -->
                      <div class="ld-plan-btn" @click.stop="handleOnGrantImplementClick(item.p_id, item)">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看进度</p>
                      </div>
                    <!-- </router-link> -->
                  </el-col>
                  <el-col :span="8">
                    <div v-if="item.p_grant_time!='0'" class="ld-plan-btn disable" @click.stop="">
                      <i class="ld-icon ld-icon-del"></i>
                      <p>删除方案</p>
                    </div>
                    <div v-else class="ld-plan-btn" @click.stop="handleOnPlanDeleteClick(item.p_id, item)">
                      <i class="ld-icon ld-icon-del"></i>
                      <p>删除方案</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <i class="el-icon-circle-check unchecked"></i>
            </div>
          </el-col>
        </template>
      </el-row>
    </div>
    </template>
    <ld-footer></ld-footer>

    <!-- *弹窗* -->
    <!-- 再融资/增资 -->
    <el-dialog width="400px" :visible.sync="dialogRongZengVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">再融资/增资</div>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                融资（或增资）金额
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-select v-model="currency_type" placeholder="货币选择">
                      <el-option
                        v-for="(item, key) in currencyTypeOpts"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">{{ currencyToken }}</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                因本次融资(或增资)增发的股权，占增发后总股权的比例
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="16">
                    <el-input v-model="ratio" placeholder=""><span slot="suffix">%</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div>
            <p style="font-size:14px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
            <div class="">
              <el-checkbox v-model="capitalChecked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
            </div>
          </div>
          <el-button :disabled="!capitalChecked" @click.stop="handleOnClickRongZengDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <!-- 搭建VIE -->
    <el-dialog width="400px" :visible.sync="dialogVieVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">搭建VIE</div>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                已发行总股本
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-input v-model="stock_val" placeholder="VIE架构境外公司"><span slot="suffix">股</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                新引入投资人持有股数
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-input v-model="new_stock" placeholder="本次搭建VIE架构过程中新引入投资者持有"><span slot="suffix">股</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                VIE搭建完成后公司总估值
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-select v-model="currency_type" placeholder="货币选择">
                      <el-option
                        v-for="(item, key) in currencyTypeOpts"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">{{ currencyToken }}</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div>
            <p style="font-size:14px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
            <div class="">
              <el-checkbox v-model="capitalChecked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
            </div>
          </div>
          <el-button :disabled="!capitalChecked" @click.stop="handleOnClickVieDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <!-- 股份制改造 -->
    <el-dialog width="400px" :visible.sync="dialogGufenzhigaiVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">股份制改造</div>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                已发行总股本
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-input v-model="stock_val" placeholder="股份制改造后公司已发行总股本"><span slot="suffix">股</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                新引入投资人持有股数
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-input v-model="new_stock" placeholder="股份制改造过程中新引入投资者持有"><span slot="suffix">股</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div class="ld-form-group">
              <div class="ld-form-group__hd">
                股份制改造完成后公司总估值
              </div>
              <div class="ld-form-group__bd">
                <el-row :gutter="10">
                  <el-col :span="8">
                    <el-select v-model="currency_type" placeholder="货币选择">
                      <el-option
                        v-for="(item, key) in currencyTypeOpts"
                        :label="item"
                        :value="key">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-input v-model="cap_val" placeholder="金额"><span slot="prefix">{{ currencyToken }}</span></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div>
            <p style="font-size:14px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
            <div class="">
              <el-checkbox v-model="capitalChecked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
            </div>
          </div>
          <el-button :disabled="!capitalChecked" @click.stop="handleOnClickGufenzhigaiDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <!-- 拆股 -->
    <el-dialog width="400px" :visible.sync="dialogChaiguVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">拆股</div>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd" style="float: left; position: relative; top: 7px;">
                每一股拆分
              </div>
              <div style="float:left; margin-left: 10px; width: 150px;">
                <el-input v-model="ratio" placeholder=""><span slot="suffix">股</span></el-input>
              </div>
            </div>
          </div>
          <div>
            <p style="font-size:14px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
            <div class="">
              <el-checkbox v-model="capitalChecked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
            </div>
          </div>
          <el-button :disabled="!capitalChecked" @click.stop="handleOnClickChaiguDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <!-- 并股 -->
    <el-dialog width="400px" :visible.sync="dialogBingguVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">并股</div>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd" style="float: left; position: relative; top: 7px;">
                每
              </div>
              <div style="float:left; margin-left: 10px; width: 150px;">
                <el-input v-model="ratio" placeholder=""><span slot="suffix">股</span></el-input>
              </div>
              <div style="float:left; margin-left: 10px; line-height: 30px;">
                合并成一股
              </div>
            </div>
          </div>
          <div>
            <p style="font-size:14px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
            <div class="">
              <el-checkbox v-model="capitalChecked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
            </div>
          </div>
          <el-button :disabled="!capitalChecked" @click.stop="handleOnClickBingguDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <!-- 资本金转增 -->
    <el-dialog width="400px" :visible.sync="dialogZibenzzVisible"  custom-class="ld-plan-dialog">
      <div class="ld-input-min">
        <el-form>
          <div class="ld-title">资本金转增</div>
          <div class="ld-form-groups">
            <div class="ld-form-group">
              <div class="ld-form-group__hd" style="float: left; position: relative; top: 7px;">
                每一股经资本金转增后，增加至
              </div>
              <div style="float:left; margin-left: 10px; width: 120px;">
                <el-input v-model="ratio" placeholder=""><span slot="suffix">股</span></el-input>
              </div>
            </div>
          </div>
          <div>
            <p style="font-size:14px;">上述资本运作完成后，公司总股数更新为 <b>{{stockMod|currency-format('0,0')}}</b>股;<br>总估值更新为<b>{{capMod|currency-format('0,0.00', currencyMod)}}</b>元。</p>
            <div class="">
              <el-checkbox v-model="capitalChecked">确认：更新后的股数和估值信息与公司当前情况一致</el-checkbox>
            </div>
          </div>
          <el-button :disabled="!capitalChecked" @click.stop="handleOnClickZibenzzDialogSubmit" style="margin-top: 20px;" type="primary" size="small" round>确定</el-button>
        </el-form>
      </div>
    </el-dialog>
  </ld-page>
</template>

<script>
import plan from './plan.js'

export default plan
</script>

<style lang="less">
@import './plan.less';
</style>
