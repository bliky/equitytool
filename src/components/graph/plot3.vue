<template>
  <div class="ld-graph-wrapper">
    <canvas ref="ldCanvas" style="width: 217px; height: 140px;"></canvas>
    <!-- <e-charts :options="polar"></e-charts> -->
  </div>
</template>

<script>
import zrender from 'zrender'
import Gauge from './gauge'
import Ringbar from './ringbar'
import Pointer from './pointer'

const gw = 217
const gh = 140

export default {
  props: {
  },
  data () {
    return {
      zr: null,
      angle1: 0,
      angle2: 0,
      pointer: null,
      bar1: null,
      bar2: null
    }
  },
  mounted () {
    this.createRender()
    this.drawGauge()
  },
  methods: {
    createRender () {
      this.zr = zrender.init(this.$refs.ldCanvas, {
        devicePixelRatio: 1,
        width: gw,
        height: gh
      })
    },
    setBase(angle) {
      console.log('角度1', angle)
      this.angle1 = angle
      this.bar1.attr('shape', {angle:angle>180?180:angle})
    },
    setAngle(angle) {
      console.log('角度2', angle)
      this.angle2 = angle
      if (this.angle2 < this.angle1) {
        this.bar1.attr('z', 0)
        this.bar2.attr('z', 1)
      } else {
        this.bar1.attr('z', 1)
        this.bar2.attr('z', 0)
      }
      this.bar2.attr('shape', {angle:angle>180?180:angle})
      this.pointer.attr('shape', {angle:angle>180?190:angle})
    },
    drawGauge () {
      const rx = gw/2
      const ry = gh-16
      let gauge = new Gauge({
        shape: {
          x: rx,
          y: ry
        },
        style: {
          stroke: 'none',
          fill: '#ddd'
        }
      })
      let middleLabel = new zrender.Text({
        style: {
          textStroke: "#000",
          textFill: "#BBD9F9",
          text: "适中",
          fontSize: '12',
          textPosition: 'inside',
          textAlign: 'center'
        },
        position: [rx, ry-80]
      })
      this.bar1 = new Ringbar({
        shape: {
          x: rx,
          y: ry,
          angle: 0
        },
        style: {
          stroke: 'none',
          fill: '#ffa5bc'
        },
        z: 1
      })
      this.bar2 = new Ringbar({
        shape: {
          x: rx,
          y: ry,
          angle: 0
        },
        style: {
          stroke: 'none',
          fill: '#0074f1'
        }
      })
      this.pointer = new Pointer({
        shape: {
          x: rx,
          y: ry,
          angle: 0
        },
        style: {
          stroke: 'none',
          fill: '#0074f1'
        }
      })

      this.zr.add(gauge)
      this.zr.add(middleLabel)
      this.zr.add(this.bar2)
      this.zr.add(this.bar1)
      this.zr.add(this.pointer)
    }
  }
}
</script>

<style lang="less">
@import '../variables.less';
@import '../mixins.less';

</style>
