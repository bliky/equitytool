<template>
  <ld-plot1 v-if="type == 1" ref="plot" :series="series" :total="total"></ld-plot1>
  <ld-plot2 v-else ="plot2Data" ref="plot" :series="series"></ld-plot2>
</template>

<script>
import ldPlot1 from './plot1'
import ldPlot2 from './plot2'

export default {
  props: {
    type: String,
    series: Array,
    total: Number
  },
  data () {
    return {
    }
  },
  components: {
    ldPlot1,
    ldPlot2
  },
  mounted () {
  },
  methods: {
    paint () {
      this.$refs.plot.paint()
    }
  }
}
</script>
<style lang="less">
@import '../variables.less';
@import '../mixins.less';

.ld-graph-wrapper {
  text-align: center;
  canvas {
    display: inline-block;
  }
}
</style>