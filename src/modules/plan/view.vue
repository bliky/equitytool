<template>
  <ld-page>
    <ld-header></ld-header>
    <div class="ld-plan-topbar">
      <div class="ld-main">
        <el-row :gutter="16">
            <el-col :span="6">
              <div class="ld-plan blue">
                <div class="ld-plan__hd">
                  <span class="ld-icon ld-icon-plan-now"></span>当前方案
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">股票期权</div>
                  <div class="ld-r">尚未依据本方案向激励对象发出授予通知</div>
                </div>
                <div class="ld-plan__ft">
                  <el-row>
                    <el-col :span="8">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-addgrant"></i>
                        <p>增加授予</p>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看授予</p>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-del"></i>
                        <p>删除方案</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="ld-plan blue">
                <div class="ld-plan__hd">
                  <span class="ld-icon ld-icon-plan-now"></span>当前方案
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">股票期权</div>
                  <div class="ld-r">尚未依据本方案向激励对象发出授予通知</div>
                </div>
                <div class="ld-plan__ft">
                  <el-row>
                    <el-col :span="8">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-addgrant"></i>
                        <p>增加授予</p>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看授予</p>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-del"></i>
                        <p>删除方案</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="ld-plan">
                <div class="ld-plan__hd his">
                  <span class="ld-icon ld-icon-plan-his"></span>历史方案
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">限制性股票</div>
                  <div class="ld-r">尚未依据本方案向激励对象发出授予通知</div>
                </div>
                <div class="ld-plan__ft">
                  <el-row>
                    <el-col :span="12">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看授予</p>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-del"></i>
                        <p>删除方案</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="ld-plan">
                <div class="ld-plan__hd his">
                  <span class="ld-icon ld-icon-plan-his"></span>历史方案
                </div>
                <div class="ld-plan__bd">
                  <div class="ld-l">员工入股</div>
                  <div class="ld-r">授予日期<p style="color: #52575d;">2017年12月12日</p></div>
                </div>
                <div class="ld-plan__ft">
                  <el-row>
                    <el-col :span="12">
                      <div class="ld-plan-btn">
                        <i class="ld-icon ld-icon-viewgrant"></i>
                        <p>查看授予</p>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="ld-plan-btn disable">
                        <i class="ld-icon ld-icon-del"></i>
                        <p>删除方案</p>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-col>
          </el-row>
      </div>
    </div>

    <div class="ld-plan-viewer">
      <h3 class="ld-t3">下列授予数据基于公司总股本为100，000元</h3>
      <div style="text-align: center; margin-top: 20px;">
        <span class="ld-icon-arrowdowm"></span>
      </div>
      <div class="ld-plan-btns">
        <span class="ld-text">如果股份发生变化，请进行修改</span>
        <span class="ld-opt-btn selected">再融资/增资</span>
        <span class="ld-opt-btn unselected">搭建VIE</span>
        <span class="ld-opt-btn selected">股份制改造</span>
        <span class="ld-opt-btn">并股</span>
        <span class="ld-opt-btn active">股改</span>
        <span class="ld-opt-btn">资本金转移</span>
      </div>
      <div class="ld-plan-table">
        <div class="ld-grant-table">
          <el-table
            :data="tableData"
            :span-method="arraySpanMethod"
            highlight-current-row
            style="width: 100%">
            <el-table-column
              prop="u_serial_number"
              label="ID"
              align="center"
              width="80">
            </el-table-column>
            <el-table-column
              width="60"
              prop="pi_staff_type"
              label="岗位"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_grant_email"
              label="激励工具"
              align="center">
            </el-table-column>
            <el-table-column
              width="80"
              prop="pi_grant_stock"
              label="授予股数"
              align="center">
            </el-table-column>
            <el-table-column
              width="80"
              prop="pi_strike_price"
              label="行权价格/入股价格"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_desc"
              label="已生效股数"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_desc"
              label="未生效股数"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_desc"
              label="已行权/兑现股数"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_desc"
              label="已生效价值"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_desc"
              label="未生效价值"
              align="center">
            </el-table-column>
            <el-table-column
              prop="pi_desc"
              label="已行权/兑现价值"
              align="center">
            </el-table-column>
          </el-table>
        </div>
        <p style="text-align: left; margin-top: 15px; color: #94979a; font-size: 12px;">共<span>{{tableData.length}}</span>人</p>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="50"
          style="margin-top: 45px;"
          @next-click="clickNext()">
        </el-pagination>
      </div>
    </div>
    <ld-footer></ld-footer>
  </ld-page>
</template>

<script>
import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
// import plan from '../../services/plan' // eslint-disable-line

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter
  },
  data () {
    return {
      id: this.$route.params.id,
      tableData: [
        {
          u_serial_number: '123',
          pi_grant_name: '戴有名',
          pi_grant_email: 'leebenw@126.com',
          pi_staff_type: 'CEO',
          pi_grant_stock: '股票期权',
          pi_strike_price: '10￥',
          pi_desc: '分三年授予，加速'
        },
        {
          u_serial_number: '123',
          pi_grant_name: '戴有名',
          pi_grant_email: 'leebenw@126.com',
          pi_staff_type: 'CEO',
          pi_grant_stock: '股票期权',
          pi_strike_price: '10￥',
          pi_desc: '分三年授予，加速'
        },
        {
          u_serial_number: '456',
          pi_grant_name: '张老大',
          pi_grant_email: 'leebenw@126.com',
          pi_staff_type: 'CTO',
          pi_grant_stock: '股票期权',
          pi_strike_price: '10￥',
          pi_desc: '分三年授予，加速'
        },
        {
          u_serial_number: '456',
          pi_grant_name: '张老大',
          pi_grant_email: 'leebenw@126.com',
          pi_staff_type: 'CTO',
          pi_grant_stock: '股票期权',
          pi_strike_price: '10￥',
          pi_desc: '分三年授予，加速'
        },
        {
          u_serial_number: '789',
          pi_grant_name: '刘罗锅',
          pi_grant_email: 'leebenw@126.com',
          pi_staff_type: 'CMO',
          pi_grant_stock: '股票期权',
          pi_strike_price: '10￥',
          pi_desc: '分三年授予，加速'
        },
        {
          u_serial_number: '789',
          pi_grant_name: '刘罗锅',
          pi_grant_email: 'leebenw@126.com',
          pi_staff_type: 'CMO',
          pi_grant_stock: '股票期权',
          pi_strike_price: '10￥',
          pi_desc: '分三年授予，加速'
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return [2, 1];
        } else {
          return [0, 0];
        }
      }
      if (columnIndex === 1) {
        if (rowIndex % 2 === 0) {
          return [2, 1];
        } else {
          return [0, 0];
        }
      }
    }
  }
}
</script>

<style lang="less">
@import '../../components/variables.less';
@import '../../components/mixins.less';

.ld-plan-topbar {
  height: 232px;
  background-color: @color-bg-panel;
  .ld-main {
    width: @main-width;
    margin: 0 auto;
    height: 100%;
    .ld-box {
      float: left;
      width: 260px;
      position: relative;
      height: 100%;
      &+.ld-box {
        border-left: 1px solid #fff;
      }
      &.ld-box-lg {
        width: 598px;
      }
    }

    .ld-welcome {
      position: absolute;
      top: 10px;
      left: 60px;
      font-size: 12px;
      color: @color-blue4;
    }
    .ld-data-panel {
      .ld-t {
        font-size: 14px;
        color: @color-title;
      }
      .ld-b {
        .ld-plot {
          margin-top: 20px;
          width: 92px;
          height: 92px;
          display: inline-block;
          background-color: #fff;
        }
        .ld-ano {
          margin-top: 10px;
          font-size: 12px;
          color: @color-text;
          .sbar {
            width: 14px;
            height: 8px;
            display: inline-block;
            margin-right: 15px;
            &.red {
               background-color: @color-red2;
            }
            &.blue {
               background-color: @color-blue;
            }
          }
        }
      }
      text-align: center;
      margin-top: 40px;
    }
  }
}

.ld-pibar {
  width: @main-width;
  margin: 15px auto 0;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  color: @color-text-secondary;
  .ld-l {
    float: left;
  }
  .ld-r {
    float: right;
    padding-right: 50px;
    .plustext {
      color: @color-text-secondary;
      cursor: pointer;
      display: inline-block;
      padding-left: 16px;
      position: relative;
      &:hover {
        color: @color-blue2;
      }
      &:before {
        display: inline-block;
        content: '+';
        position: absolute;
        left: 0;
        top: 0;
      }
      &+.plustext {
        margin-left: 26px;
      }
    }
  }
}

.ld-plans {
  width: @main-width;
  margin: 0 auto 15px;
}
.ld-plan {
  border-top: 2px solid @color-split;
  height: 198px;
  margin-top: 15px;
  background-color: #fff;
  box-shadow: 1px 1px 6px rgba(82,87,93,.2);
  &.blue {
    border-color: @color-blue3;
  }
  .ld-plan__hd {
    padding: 0 15px;
    font-size: 12px;
    color: @color-blue3;
    height: 50px;
    line-height: 50px;
    &.his {
      color: @color-text-secondary;
    }
    .ld-icon {
      display: inline-block;
      position: relative;
      top: 2px;
      margin-right: 8px;
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: 16px 16px;
      background-position: center;
      &.ld-icon-plan-now {
        background-image: url(../../assets/images/icon-plan-now.png);
      }
      &.ld-icon-plan-his {
        background-image: url(../../assets/images/icon-plan-his.png);
      }
    }
  }
  .ld-plan__bd {
    margin-top: 15px;
    padding: 0 15px;
    overflow: hidden;
    height: 36px;
    .ld-l {
      float: left;
      width: 35%;
      font-size: 20px;
      color: @color-title;
      height: 36px;
      line-height: 36px;
    }
    .ld-r {
      float: left;
      width: 55%;
      margin-left: 10%;
      font-size: 12px;
      height: 36px;
      line-height: 18px;
      color: @color-text-secondary;
    }
  }
  .ld-plan__ft {
    margin-top: 30px;
    .el-col + .el-col {
      border-left: 1px solid @color-split;
    }
    .ld-plan-btn {
      text-align: center;
      font-size: 12px;
      color: @color-text;
      cursor: pointer;
      .ld-icon {
        display: inline-block;
        width: 22px;
        height: 22px;
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: center;
        transition: background-image .3s, transform .3s;
        &.ld-icon-addgrant {
          background-image: url(../../assets/images/icon-addgrant-color.png);
        }
        &.ld-icon-viewgrant {
          background-image: url(../../assets/images/icon-plan-view-color.png);
        }
        &.ld-icon-del {
          background-image: url(../../assets/images/icon-plan-del-color.png);
        }
      }
      p {
        color: @color-text;
        .transition(color);
        margin-top: 5px;
      }
      &:not(.disable):hover {
        .ld-icon {
          .dotranform(scale(1.2));
        }
        p {
          color: @color-primary;
        }
        .ld-icon-addgrant {
          background-image: url(../../assets/images/icon-addgrant-hover.png);
        }
        .ld-icon-viewgrant {
          background-image: url(../../assets/images/icon-plan-view-hover.png);
        }
        .ld-icon-del {
          background-image: url(../../assets/images/icon-plan-del-hover.png);
        }
      }
      &.disable {
        cursor: not-allowed;
        p {
          color: @color-text-secondary;
        }
        .ld-icon-addgrant {
          background-image: url(../../assets/images/icon-addgrant.png);
        }
        .ld-icon-viewgrant {
          background-image: url(../../assets/images/icon-plan-view.png);
        }
        .ld-icon-del {
          background-image: url(../../assets/images/icon-plan-del.png);
        }
      }
    }
  }
}

.ld-icon-hi {
  display: inline-block;
  position: relative;
  top: 3px;
  width: 16px;
  height: 16px;
  background-repeat: no-repeat;
  background-size: 16px 16px;
  background-position: center;
  background-image: url(../../assets/images/icon-hi.png);
}

.ld-plan-viewer {
  padding: 60px 0;
  background-color: #fff;
  .ld-t3 {
    text-align: center;
  }
  .ld-plan-btns {
    width: @main-width;
    height: 30px;
    margin: 20px auto;
    padding-left: 20px;
    .clearfix();
    .ld-text {
      float: left;
      font-size: 14px;
      color: @color-text;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
      margin-right: 10px;
    }
    .ld-opt-btn {
      float: left;
      display: inline-block;
      margin-left: 10px;
      height: 30px;
      line-height: 28px;
      text-align: center;
      padding: 0 15px;
      font-size: 12px;
      color: @color-text-secondary;
      border: 1px solid @color-split;
      cursor: pointer;
      &.unselected {
        border-color: @color-disable;
      }
      &.selected {
        border: 0;
        background-color: @color-blue3;
        color: #fff;
      }
    }
  }
}

.ld-icon-arrowdowm {
  display: inline-block;
  width: 15px;
  height: 17px;
  background-size: 15px 17px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(../../assets/images/arrow_down.png);
}

.ld-plan-table {
  width: @main-width;
  margin: 30px auto;
  text-align: center;
}
</style>
