<template>
  <div class="ld-graph-wrapper">
    <canvas ref="ldCanvas" style="width: 92px; height: 92px;"></canvas>
  </div>
</template>

<script>
import zrender from 'zrender'
import Ring from './ring'
import percentFormat from '../../filters/percent'

const gw = 92
const gh = 92
export default {
  props: {
    series: Array
  },
  data () {
    return {
      zr: null,
      plotGroup: new zrender.Group()
    }
  },
  mounted () {
    this.createRender()
    this.drawRing()
    this.zr.add(this.plotGroup)
    this.plot()
  },
  methods: {
    clearPlot () {
      if (this.plotGroup) {
        this.plotGroup.removeAll()
      }
    },
    plot (series) {
      var series = series || this.series
      if (!series || !series.length) {
        return false
      }
      this.clearPlot()
      let totalPercent = 0
      let beginAngle = 0

      series.forEach(data => {
        let angle = data.percent * 360 / 100
        let ring = new Ring({
          shape: {
            beginAngle: beginAngle,
            angle: angle,
          },
          style: {
            stroke: 'none',
            fill: data.color
          }
        })
        totalPercent += data.percent
        beginAngle += angle
        this.plotGroup.add(ring)
      })

      let percentLabel = new zrender.Text({
        style: {
          textStroke: "#000",
          textFill: "#000",
          text: percentFormat(totalPercent, '0.0') + "%",
          fontSize: '20',
          textPosition: 'inside',
          textAlign: 'center'
        },
        position: [46, 36]
      })

      this.plotGroup.add(percentLabel)
    },
    createRender () {
      this.zr = zrender.init(this.$refs.ldCanvas, {
        devicePixelRatio: 1,
        width: gw,
        height: gh
      })
    },
    drawRing () {
      let ringBase = new Ring({
        style: {
          stroke: 'none',
          fill: '#bbd9f9'
        }
      })
      this.zr.add(ringBase)
    }
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

</style>
