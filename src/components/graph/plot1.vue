<template>
  <div class="ld-graph-wrapper">
    <canvas ref="ldCanvas" style="width: 580px; height: 220px; background-color: #fff;"></canvas>
    <!-- <e-charts :options="polar"></e-charts> -->
  </div>
</template>

<script>
import zrender from 'zrender'
import Axis from './axis'
import Arrow from './arrow'
import Bracket from './bracket'
import Ushape from './ushape'
import currencyFormat from '../../filters/currency'

const gw = 580
const gh = 220

const acordW = 500
const acordH = 120

const xo = (gw - acordW) / 2
const yo = 48

const corX = x => xo + x
const corY = y => gh - yo -y

const acordXo = corX(0)
const acordYo = corY(-1)

const barW = 7

let sumH = 0
let xMax = acordW - 20
let yOffset = 0

export default {
  props: {
    series: Array,
    total: Number,
    broken: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      context2d: null,
      zr: null,
      xScaleMaxLabel: null,
      plotGroup: new zrender.Group(),
      scaleXGroup: new zrender.Group(),
      hoverGroup: new zrender.Group(),
      detailScaleXGroup: new zrender.Group(),
      detailBarGroup: new zrender.Group()
    }
  },
  mounted () {
    this.createRender()
    // 绘制坐标轴
    this.drawAxis()
    this.drawYBar()
    this.paint()
    this.drawDetailAxis()
  },
  methods: {
    createRender () {
      this.zr = zrender.init(this.$refs.ldCanvas, {
        devicePixelRatio: 1,
        width: gw,
        height: gh
      });
    },
    paint (series) {
      sumH = 0
      var series = series || this.series
      this.clearPlot()
      this.plot(series)
    },
    setMaxYear (max) {
      max = parseInt(max)
      this.xScaleMaxLabel && this.xScaleMaxLabel.attr('style', {text: (max||0)+'年'})
    },
    clearPlot () {
      if (this.plotGroup) {
        this.plotGroup.removeAll()
      }
      if (this.scaleXGroup) {
        this.scaleXGroup.removeAll()
      }
    },
    drawDetailAxis () {
      let hoverGroup = this.hoverGroup
      let circle = new zrender.Ellipse({
        shape: {
          cx: 0,
          cy: 0,
          rx: 120,
          ry: 100
        },
        style: {
          stroke: '#999',
          fill: '#fff',
          lineWidth: 1
        },
        z: 1
      })
      let xAxis = new zrender.Line({
        shape: {
          x1: -120,
          y1: 0,
          x2: 120,
          y2: 0
        },
        style: {
          stroke: '#0074f1',
          fill: 'none',
          lineWidth: 1
        },
        z: 2
      })

      hoverGroup.position = [gw - 140, gh/2]
      hoverGroup.z = 100
      hoverGroup.add(circle)
      hoverGroup.add(xAxis)
      hoverGroup.add(this.detailScaleXGroup)
      hoverGroup.add(this.detailBarGroup)
      hoverGroup.hide()
      this.zr.add(hoverGroup)
    },
    showHoverDetail (detail) {
      let hoverGroup = this.hoverGroup
      let detailScaleXGroup = this.detailScaleXGroup
      let detailBarGroup = this.detailBarGroup
      let maxMonth = 0
      let minMonth = 12

      detailScaleXGroup.removeAll()
      detailBarGroup.removeAll()

      // 获取最大月份和最小月份
      detail.forEach(item => {
        let month = item.month
        if (month == 0) {
          maxMonth = 12
        } else {
          if (maxMonth < month) {
            maxMonth = month
          }
          if (minMonth > month) {
            minMonth = month
          }
        }
      })
      // 用排序的方法改进获取最大月和最小月份
      // detail.sort((a, b) => b.month-a.month)
      let xnum = maxMonth - minMonth
      // 根据月份绘制刻度线
      let scaleXW = 160 / xnum
      scaleXW = scaleXW > 40 ? 40 : scaleXW

      //  绘制刻度标注
      let legend = new Ushape({
        shape: {
          x: -40,
          y: 60,
          width: scaleXW
        },
        style: {
          stroke: '#0074f1',
          fill: 'none'
        },
        z: 3
      })
      let legendLabel = new zrender.Text({
        position: [scaleXW - 30, 50],
        style: {
          text: "代表一个月",
          textStroke: "#000",
          textFill: "#94979a",
          fontSize: '10px',
          textPosition: 'inside',
          textAlign: 'left'
        },
        z: 2
      })
      let legendNumberLabel = new zrender.Text({
        position: [-40, 70],
        style: {
          text: "* 数字代表可行权股数",
          textStroke: "#000",
          textFill: "#94979a",
          fontSize: '10px',
          textPosition: 'inside',
          textAlign: 'left'
        },
        z: 2
      })

      detailScaleXGroup.add(legend)
      detailScaleXGroup.add(legendLabel)
      detailScaleXGroup.add(legendNumberLabel)

      for (let i=0; i<=xnum; i++) {
        let sx = scaleXW * i - 80
        let sy = 6 * (i%2==0?1:-1)
        let sy2 = i%2==0 ? 6 : -18
        let xl = new zrender.Line({
          shape: {
            x1: sx,
            y1: sy,
            x2: sx,
            y2: 0
          },
          style: {
            stroke: '#0074f1',
            fill: 'none'
          },
          z: 2
        })
        let xlabel = new zrender.Text({
          style: {
            textStroke: "#000",
            textFill: "#94979a",
            text: '第' + (minMonth + i) + '月',
            fontSize: '14px',
            textPosition: 'inside',
            textAlign: 'center'
          },
          position: [sx, sy2],
          z: 2
        })
        detailScaleXGroup.add(xl)
        //detailScaleXGroup.add(xlabel)
      }

      let total = this.total
      // 绘制bar
      detail.forEach(item => {
        let month = item.month
        month = month == 0 ? 12 : month
        let percent = item.percent
        let sx3 = (month - minMonth) * scaleXW - 80
        let symod = (month - minMonth) % 4
        let sy3 = symod == 0 ? 5 :
                  symod == 1 ? -17 :
                  symod == 2 ? 17 :
                  symod == 3 ? -28 : 0
        let stock = parseInt(percent * total / 100)
        let ylabel = new zrender.Text({
          style: {
            textStroke: "#000",
            textFill: "#94979a",
            //text: '第' + month + "月末\n" + stock + "\n股可行使",
            text: currencyFormat(stock, '0,0'),
            fontSize: '6px',
            textPosition: 'inside',
            textAlign: 'center'
          },
          position: [sx3, sy3],
          z: 2
        })
        detailBarGroup.add(ylabel)
      })
      hoverGroup.show()
    },
    plot (series) {
      if (!series || !series.length) {
        return false
      }
      let shapes = []
      let sers = []
      let indexYear = 0
      let preYear = 0

      // 数据预处理
      for (let i = 0, len = series.length; i < len; i++) {
        let s = series[i]
        let month = s.month
        let year = Math.ceil(month/12)
        month = parseInt(month % 12)

        series[i].percent = parseInt(series[i].percent)
        if (i == 0) {
          sers.push({percent: s.percent, year: year, month: month, mix: false, detail:[{month: month, percent: s.percent}]})
        } else {
          if (year != preYear) {
            sers.push({percent: s.percent, year: year, month: month, mix: false, detail: [{ month: month, percent: s.percent}]})
            indexYear++;
          } else {
            sers[indexYear].percent += s.percent
            sers[indexYear].detail.push({month: month, percent:s.percent})
            sers[indexYear].mix = true
          }
        }

        preYear = year
      }

      let maxYear = sers[sers.length-1].year || 1
      let scaleX = (acordW-130) / maxYear
      let scaleXGroup = this.scaleXGroup

      for (let i = 0; i < maxYear; i++) {
        let s = sers[i]
        let year = i+1
        let sx = year * scaleX

        scaleXGroup.add(new zrender.Line({
          shape: {
            x1: corX(sx),
            y1: corY(-8),
            x2: corX(sx),
            y2: corY(0)
          },
          style: {
            stroke: '#0074f1',
            fill: 'none',
            lineWidth: 1
          }
        }))

        scaleXGroup.add(new zrender.Text({
          style: {
            textStroke: "#000",
            textFill: "#94979a",
            text: '满'+year+'年',
            fontSize: '14px',
            textPosition: 'inside',
            textAlign: 'center'
          },
          position: [corX(sx), corY(-6)]
        }))
      }
      this.zr.add(scaleXGroup)

      let len2 = sers.length
      for (let i = 0; i < len2; i++) {
        let s = sers[i]
        shapes = shapes.concat(this.bar(s.percent, s.year, s.month, s.mix, scaleX, s.mix?s.detail:[]))
      }

      let plotGroup = this.plotGroup
      for (let i = 0, len = shapes.length; i < len; i++) {
        plotGroup.add(shapes[i])
      }
      this.zr.add(plotGroup)
    },
    bar (percent, year, month, mix, scaleX, detail) {
      let xn = year
      let xm = month
      let xc = scaleX * (xn-1)
      let x = 0
      let color = '#ff4f51'
      let shapes = []
      let addScaleX = false
      if (mix) {
        // 混合Bar: 几个月总和
        x = xc + scaleX/2
        color = '#E6A23C'
      } else {
        if (month > 0) {
          x = xc + xm * scaleX / 12
          // 非整年单次授予，增加刻度线
          addScaleX = true
        } else {
          x = scaleX * xn
        }
      }

      // 高度为百分数 转高度
      let dh = percent * acordH / 100

      sumH += dh
      let y = sumH

      x = x-4
      let shape = {
        x: corX(x),
        y: corY(y + yOffset),
        width: barW,
        height: dh
      }

      let style = {
        stroke: "none",
        fill: color
      }

      let stock = parseInt(percent * this.total / 100)
      let xArrow = new Arrow({
        shape: {
          x: corX(x+barW),
          y: corY(y-dh/2 + yOffset),
          dx: xMax-x-barW
        },
        style: {
          stroke: '#999',
          fill: 'none',
          lineWidth: 1,
          textStroke: "#000",
          textFill: "#94979a",
          textBackgroundColor: "#fff",
          text: '可行使'+ stock +'股',
          fontSize: '14px',
          textPosition: 'inside',
          textAlign: 'center'
        }
      })

      let bar = new zrender.Rect({shape: shape, style: style})
      let zr = this.zr
      let hoverGroup = this.hoverGroup
      let scaleXGroup = this.scaleXGroup

      if (mix) {
        let xBracket = new Bracket({
          shape: {
            x1: corX((year-1)*scaleX),
            y1: corY(y-dh),
            x2: corX(year*scaleX),
            y2: corY(y-dh)
          },
          style: {
            stroke: color,
            fill: 'none',
            lineWidth: 1
          }
        })
        shapes.push(xBracket)

        let showHoverDetail = this.showHoverDetail
        // 给复合bar绑定事件
        bar.on('mouseover', function (e) {
          let x = this.shape.x + 127
          if (x+127>gw) {
            x = this.shape.x - 120
          }
          showHoverDetail(detail)
          hoverGroup.attr('position', [x, gh/2])
        })
        bar.on('mouseout', function () {
          hoverGroup.hide()
        })
      }

      // 增加刻度线
      if (addScaleX) {
        scaleXGroup.add(new zrender.Line({
          shape: {
            x1: corX(x+3),
            y1: corY(-6),
            x2: corX(x+3),
            y2: corY(0)
          },
          style: {
            stroke: '#0074f1',
            fill: 'none',
            lineWidth: 1
          }
        }))
      }

      shapes.push(bar)
      shapes.push(xArrow)
      return shapes
    },
    drawYBar () {
      // 绘制最大Y轴主线
      this.zr.add(new zrender.Rect({
        shape: {
          x: corX(2),
          y: corY(acordH + yOffset),
          width: barW,
          height: acordH
        },
        style: {
          stroke: 'none',
          fill: '#3f96f4'
        }
      }))
    },
    drawAxis () {
      this.zr.add(new Axis({
        shape: {
          x: acordXo,
          y: acordYo,
          width: acordW,
          height: acordH,
          arrow: 5,
          yAxis: false
        },
        scale: [1, 1],
        style: {
          stroke: "#3f96f4",
          fill: 'none',
          lineWidth: 2
        }
      }))

      let legendGroup = new zrender.Group()
      let legendY = corY(-40)
      let redCircle = new zrender.Circle(
      {
        shape: {
          cx: corX(80),
          cy: legendY,
          r: 3
        },
        style: {
          stroke: 'none',
          fill: '#ff4f51'
        }
      })
      let blueCircle = new zrender.Circle(
      {
        shape: {
          cx: corX(150),
          cy: legendY,
          r: 3
        },
        style: {
          stroke: 'none',
          fill: '#0074f1'
        }
      })
      let redLegend = new zrender.Text(
      {
        style: {
          textFill: "#94979a",
          text: '可行权',
          fontSize: '14px',
          textPosition: 'bottom',
          textAlign: 'center'
        },
        position: [corX(106), legendY-6]
      })
      let blueLegend = new zrender.Text(
      {
        style: {
          textFill: "#94979a",
          text: '可行使',
          fontSize: '14px',
          textPosition: 'bottom',
          textAlign: 'center'
        },
        position: [corX(176), legendY-6]
      })

      legendGroup.add(redCircle)
      legendGroup.add(blueCircle)
      legendGroup.add(redLegend)
      legendGroup.add(blueLegend)
      //this.zr.add(legendGroup)

      // 断线
      if (this.broken) {
        let brokenLine = new zrender.Line({
          shape: {
            x1: corX(xMax-10),
            y1: corY(-1),
            x2: corX(xMax-30),
            y2: corY(-1)
          },
          style: {
            stroke: '#3f96f4',
            fill: 'none',
            lineWidth: 2,
            lineDash: [3,3]
          }
        })
        let xMaxLine = new zrender.Line({
          shape: {
            x1: corX(xMax),
            y1: corY(0),
            x2: corX(xMax),
            y2: corY(acordH)
          },
          style: {
            stroke: '#999',
            fill: 'none',
            lineWidth: 1,
            lineDash: [3,3]
          }
        })
        let xScaleMax = new zrender.Line({
          shape: {
            x1: corX(xMax),
            y1: corY(-6),
            x2: corX(xMax),
            y2: corY(0)
          },
          style: {
            stroke: '#3f96f4',
            fill: 'none',
            lineWidth: 1
          }
        })
        let xScaleMaxLabel = new zrender.Text({
          style: {
            textStroke: "#000",
            textFill: "#94979a",
            text: this.broken+'年',
            fontSize: '14px',
            textPosition: 'inside',
            textAlign: 'center'
          },
          position: [corX(xMax), corY(-6)]
        })
        this.xScaleMaxLabel = xScaleMaxLabel
        this.zr.add(brokenLine)
        this.zr.add(xMaxLine)
        this.zr.add(xScaleMax)
        this.zr.add(xScaleMaxLabel)
      }
    }
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

</style>
