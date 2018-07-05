<template>
  <div class="ld-graph-wrapper">
    <canvas ref="ldCanvas" style="width: 580px; height: 220px; background-color: #fff;"></canvas>
  </div>
</template>

<script>
import currencyFormat from '../../filters/currency'
import zrender from 'zrender'
import Axis from './axis'
import {CURRENCY_TOKEN} from '../../config/const'

const gw = 580
const gh = 220

const acordW = 500
const acordH = 160

const xo = (gw - acordW) / 2
const yo = 25

const corX = x => xo + x
const corY = y => gh - yo -y

const acordXo = corX(0)
const acordYo = corY(-1)

let xMax = acordW - 20

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
      zr: null,
      currency: '1',
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
    this.paint()
    this.drawDetailAxis()
  },
  methods: {
    createRender () {
      this.zr = zrender.init(this.$refs.ldCanvas, {
        devicePixelRatio: 1,
        width: gw,
        height: gh
      })
    },
    clearPlot () {
      if (this.plotGroup) {
        this.plotGroup.removeAll()
      }
      if (this.scaleXGroup) {
        this.scaleXGroup.removeAll()
      }
    },
    setCurrency (c) {
      this.currency = c
    },
    paint (series, currency, maxRef) {
      var series = series || this.series
      var currency = currency || this.currency
      this.clearPlot()
      this.plot(series, currency, maxRef)
    },
    drawDetailAxis () {},
    showHoverDetail (detail) {},
    plot (series, currency, maxRef) {
      if (!series || !series.length) {
        return false
      }
      let shapes = []

      // 数据预处理
      console.log(series, currency, maxRef)
      let max = maxRef
      max = max < acordH ? acordH : max
      let base = series[0][0]
      let bk = 2 + base * acordH / max

      console.log('bk acordH max k', bk, acordH, max)

      for (let i = 0, len = series.length; i < len; i++) {
        let s = series[i]
        let h1 = bk
        let h2 = s[1]*acordH/max-bk
        let val = s[1]-s[0]
        console.log('h1, h2, val', h1, h2, val)
        shapes = shapes.concat(this.bar(h1, h2, i+1, val, currency))
      }

      let plotGroup = this.plotGroup
      for (let i = 0, len = shapes.length; i < len; i++) {
        plotGroup.add(shapes[i])
      }
      this.zr.add(plotGroup)
    },
    bar (h1, h2, n, val, currency) {
      var len = 3
      let barW = 25
      let shapes = []
      let barG = parseInt((acordW-barW*len - 20)/(len+1))
      if (barG < 20) {
        if (barG < 2) {
          barW = barG = ((acordW-15) / (len*2))
        } else {
          barG = parseInt((acordW-barW*len)/(len+1))
        }
      }

      let style1 = {
        stroke: "none",
        fill: '#0074f1'
      }
      let style2 = {
        stroke: "none",
        fill: '#ff4f51'
      }

      let x1 = (barW + barG) * n - barW
      let x2 = x1
      let y1 = h1
      let y2 = h1 + h2

      let shape1 = {
        x: corX(x1),
        y: corY(y1),
        width: barW,
        height: h1
      }
      shapes.push(new zrender.Rect({shape: shape1, style: style1}))

      if (y2 > acordH) {
        y2 = acordH
        let totalH = acordH - h1
        h2 = totalH/2 - 1
        let shape2 = {
          x: corX(x2),
          y: corY(y2),
          width: barW,
          height: h2
        }
        let shape3 = {
          x: corX(x2),
          y: corY(y2-h2-2),
          width: barW,
          height: h2
        }
        shapes.push(new zrender.Rect({shape: shape2, style: style2}))
        shapes.push(new zrender.Rect({shape: shape3, style: style2}))
      } else {
        let shape2 = {
          x: corX(x2),
          y: corY(y2),
          width: barW,
          height: h2
        }
        shapes.push(new zrender.Rect({shape: shape2, style: style2}))
      }

      let textX = corX(x1+barW/2)
      let xAxisLabel = new zrender.Text({
        style: {
          textStroke: "#000",
          textFill: "#94979a",
          text: len > 9 ? n : '满'+n+'年',
          fontSize: '14px',
          textPosition: 'inside',
          textAlign: 'center'
        },
        position: [textX, corY(-2)]
      })
      let yLabel = new zrender.Text({
        style: {
          textStroke: "#000",
          textFill: "#94979a",
          text: "账面净收益\n" + CURRENCY_TOKEN[currency] + ' ' + currencyFormat(val, '0,0.00'),
          fontSize: '14px',
          textPosition: 'inside',
          textAlign: 'center'
        },
        position: [textX, corY(y2+30)]
      })

      shapes.push(xAxisLabel)
      shapes.push(yLabel)
      return shapes
    },
    drawAxis () {
      this.zr.add(new Axis({
        shape: {
          x: acordXo,
          y: acordYo,
          width: acordW,
          height: acordH,
          arrow: 5,
          yAxis: false,
          broken: 0
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
          text: '已授予',
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
          text: '未授予',
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
    },
    draw (shapes) {
      let zr = this.zr
      for (let i = 0, len = shapes.length; i < len; i++) {
        zr.add(shapes[i])
      }
    }
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

</style>
