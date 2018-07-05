<template>
  <ld-content :height="560">
    <ld-company-info :step="step" :chooseArea="chooseArea"></ld-company-info>
    <ld-sider ref="rsiderfunc" :opts="opts" :desc="desc"></ld-sider>
  </ld-content>
</template>

<script>
import {LdContent} from '../../components/content'
import LdCompanyInfo from '../../components/company'
import LdSider from '../../components/rsider'
import localDb from '../../db.js'

export default {
  components: {
    LdContent,
    LdCompanyInfo,
    LdSider
  },
  data () {
    return {
      step: 1,
      desc: '',
      opts: [[true, true, true], [true, true, true], [true, true]],
    }
  },
  mounted () {
    let areaId = localDb.get('areaId')
    if(parseInt(areaId)){
      this.chooseArea(areaId)
    }
  },
  methods: {
    chooseArea (areaId) {
      areaId = parseInt(areaId)
      let optData = [];
      switch (areaId){
        case 1:
          this.desc = '境内架构下，不存在境外实体，无法采用直接持股（境外）的模式。'
          optData = [[true, true, true], [true, false, true], [true, true]]
          break;
        case 2:
          this.desc = '境外架构下股票期权和限制性股票是更常见的激励工具，员工入股多见于境内架构。\n' +
          '境外架构建议采用境外实体公司直接持股，以便上市后可直接交易变现，激励感知度更强。'
          optData = [[true, true, false], [false, true, false], [true, true]]
          break;
      }
      this.$refs.rsiderfunc.changeOption(optData)
    }
  }
}
</script>

<style lang="less">
</style>
