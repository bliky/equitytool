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
const gapAngle = 3
const ringW = 8
const ringWHover = 12

export default {
  props: {
    series: Array
  },
  data () {
    return {
      zr: null,
      label: null,
      rings: [],
      plotGroup: new zrender.Group()
    }
  },
  mounted () {
    this.createRender()
    this.zr.add(this.plotGroup)
    this.plot()
  },
  methods: {
    normalRings () {
      let rings = this.rings
      for (let i=0, len=rings.length; i<len; i++) {
        rings[i].attr('shape', {w:ringW})
      }
    },
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
      let len = series.length

      this.clearPlot()
      let rings = this.rings = []
      let totalPercent = 0
      let beginAngle = 0

      // 过滤为0的数据
      let filterSeries = []
      series.forEach(data => {
        if (data.percent) {
          totalPercent += data.percent
          filterSeries.push(data)
        }
      })

      if (filterSeries.length == 0) {
        this.plotGroup.add(new zrender.Text({
          style: {
            textStroke: "#000",
            textFill: "#000",
            text: '未授予股数',
            fontSize: '12',
            textPosition: 'inside',
            textAlign: 'center'
          },
          position: [46, 32]
        }))
        return false
      }

      let percentK = 100 / totalPercent

      let ringLabel = this.label = new zrender.Text({
        style: {
          textStroke: "#000",
          textFill: "#000",
          text: filterSeries[0].label + "\n" + percentFormat(filterSeries[0].percent*percentK, '0') + "%",
          fontSize: '12',
          textPosition: 'inside',
          textAlign: 'center'
        },
        position: [46, 32]
      })

      this.plotGroup.add(ringLabel)

      filterSeries.forEach(data => {
        let angle = (data.percent/totalPercent) * 360
        let angle2 = angle
        if (filterSeries.length > 1) {
          angle2 = angle > gapAngle*2 ? angle - gapAngle : gapAngle
        }

        let ring = new Ring({
          shape: {
            w: ringW,
            beginAngle: beginAngle,
            angle: angle2,
          },
          style: {
            stroke: 'none',
            fill: data.color
          }
        })

        rings.push(ring)

        beginAngle += angle2 + gapAngle
        this.plotGroup.add(ring)

        // 绑定事件
        // 给复合bar绑定事件
        let that = this
        ring.on('mouseover', function (e) {
          ringLabel.attr('style', {text: data.label + "\n" + percentFormat(data.percent*percentK, '0') + "%"})
          that.normalRings()
          ring.attr('shape', {w:ringWHover})
        })
      })
      rings[0].attr('shape', {w:ringWHover})
    },
    createRender () {
      this.zr = zrender.init(this.$refs.ldCanvas, {
        devicePixelRatio: 1,
        width: gw,
        height: gh
      })
    }
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

</style>
