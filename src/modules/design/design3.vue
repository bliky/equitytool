<template>
  <ld-content :height="560">
    <ld-company-info :step="step" :chooseRound="chooseRound"></ld-company-info>
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
      step: 3,
      desc: '',
      opts: [[true, false, true], [false, true, true], [true, false]]
    }
  },
  mounted () {
    let areaId = localDb.get('areaId')
    if(parseInt(areaId)){
      this.chooseArea(areaId)
    }
    let stockZoneId = localDb.get('stockZoneId')
    if(parseInt(stockZoneId)){
      this.chooseStockZone(areaId, stockZoneId)
    }
    let roundId = localDb.get('roundId')
    if(parseInt(roundId)){
      this.chooseRound(areaId, stockZoneId, roundId)
    }
  },
  methods: {
      chooseArea(areaId){
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
      },
      chooseStockZone(areaId, stockZoneId){
          areaId = parseInt(areaId)
          stockZoneId = parseInt(stockZoneId)
          let optData = [];
          if(areaId === 1){
              switch (stockZoneId){
                  case 1:
                      this.desc = '依据境内上市监管要求，上市前公司股权架构需要稳定，股权归属清晰，不存在任何形式的锁定安排，因此员工入股是最典型的选择。而股票期权可在上市前通过行权转变为股份，也是可选项之一。'
                      optData = [[true, false, true], [false, false, true], [true, true]]
                      break;
                  case 2:
                      this.desc = '境内注册的公司计划在境外上市，在股权激励工具选择方面，需要符合境外上市公司实践，股票期权和限制性股票是建议方案。\n' +
                          '境内架构下采用间接持股，设置有限合伙企业作为股权激励平台，可以有效保障实际控制人对公司的控制权，也便于在专有平台上更方便管理股权激励，因此是推荐的持股方式。\n' +
                          '境内注册公司未来在境外上市，极有可能需要在上市前搭建VIE架构，在搭建VIE架构的过程中，可将在境内架构下授予的，以有限合伙企业做为激励平台的股票期权/限制性股票平移至VIE架构中的境外公司，方案延续性不受影响。\n' +
                          '\n'
                      optData = [[true, true, false], [false, false, true], [true, true]]
                      break;
                  case 3:
                      this.desc = '未明确未来上市地的公司，所选择的激励工具需要在未来能够灵活转变，适应不同上市地的监管规则。股票期权是境外上市地流行的上市前激励工具，同时股票期权在上市前行权，可转变为员工持股，满足境内上市监管要求。\n' +
                          '境内架构下采用间接持股，设置有限合伙企业作为股权激励平台，可以有效保障实际控制人对公司的控制权，也便于在专有平台上更方便管理股权激励，因此是推荐的持股方式。'
                      optData = [[true, false, false], [false, false, true], [true, true]]
                      break;
                  case 4:
                      this.desc = '境内上市公司选择股权激励工具，需要符合中国证监会相关规定并符合市场一般实践，股票期权和限制性股票是符合监管规定且被市场长期接受的激励工具。\n' +
                          '中国证监会也允许A股上市公司采用员工持股计划（类似于员工入股），但这种方案激励对象或股东需要完全承担股票下跌的风险，不建议采用。\n' +
                          '直接持股是上市公司普遍采用的持股方式，因为激励股份具有较好的流动性，激励感知度强。'
                      optData = [[true, true, false], [true, false, false], [true, true]]
                      break;
                  case 5:
                      this.desc = '受监管机构对“境内注册公司在境外资本市场流通股占比”的指导原则限制，此类公司实施股权激励的政策门槛较高，建议采用基于现金的长期激励。该系统暂不支持基于现金的长期激励方案设计。'
                      optData = [[false, false, false], [false, false, false], [false, false]]
                      break;
              }
          }else if(areaId === 2){
              optData = [[true, true, false], [false, true, false], [true, true]]
              switch (stockZoneId){
                  case 1:
                      this.desc = '在当前架构下，建议采用境外架构常用的股票期权或限制性股票做为激励工具。\n' +
                          '但公司如果计划在境内上市，未来需要拆除红筹架构。在拆除红筹架构的过程中，可将员工直接持有的境外公司的股票期权/限制性股票转移至境内，通过有限合伙企业作为境内股权激励持股平台，间接持有境内实体公司股权。并在上市前通过期权行权或限制性股票解除限制条款，使股权结构符合境内上市要求。'
                      break;
                  case 2:
                      this.desc = '在当前架构下，建议采用境外架构常用的股票期权或限制性股票做为激励工具。'
                      break;
                  case 3:
                      this.desc = '在尚无明确上市计划的情形下，建议参照计划在境外上市的公司的普遍实践选择激励工具，采用股票期权或限制性股票，这两种工具在必要时可平移至境内，并转变为符合境内上市规则的员工入股。'
                      break;
                  case 4:
                      this.desc = '目前中国境外注册的公司尚不允许在中国境内上市。请重新选择您的公司信息。'
                      optData = [[false, false, false], [false, false, false], [false, false]]
                      break;
                  case 5:
                      this.desc = '建议参照境外上市的公司的普遍实践选择激励工具，采用股票期权或限制性股票。'
                      break;
              }
          }
          this.$refs.rsiderfunc.changeOption(optData)
      },
      chooseRound(areaId, stockZoneId, roundId){
          areaId = parseInt(areaId)
          stockZoneId = parseInt(stockZoneId)
          roundId = parseInt(roundId)
          let optData = []
          if(areaId === 1){
              switch (stockZoneId){
                  case 1:
                      this.desc = '公司处于相对早期阶段，距上市仍有一定距离，建议采用逐年滚动的授予频率，在公司发展的过程中逐步释放激励资源，有利于延续激励时效。'
                      optData = [[true, false, true], [false, false, true], [false, true]]
                      if(roundId > 3){
                          this.desc = '公司所处的发展阶段已经距上市目标较为接近，这时推出的股权激励方案需要立即符合境内上市监管要求，员工入股是目前监管环境下，唯一可行的激励工具。\n' +
                              '因为公司距上市目标较近，所以建议对适合的激励对象尽早实施授予，使其能够享有上市溢价，获得激励。因此建议一次性实施授予。'
                          optData = [[false, false, true], [false, false, true], [true, false]]
                      }
                      break;
                  case 2:
                      this.desc = '公司处于相对早期阶段，估值仍有较高上升潜力，用股票期权能够更好地激励员工拉升估值。\n' +
                          '公司处于相对早期阶段，距上市仍有一定距离，建议采用逐年滚动的授予频率，在公司发展的过程中逐步释放激励资源，有利于延续激励时效。'
                      optData = [[true, false, false], [false, false, true], [false, true]]
                      if(roundId > 4){
                          this.desc = '因为公司距上市目标较近，所以建议对适合的激励对象尽早实施授予，使其能够享有上市溢价，获得激励。因此建议一次性实施授予。'
                          optData = [[true, true, false], [false, false, true], [true, false]]
                      }
                      break;
                  case 3:
                      this.desc = '公司处于相对早期阶段，距上市仍有一定距离，建议采用逐年滚动的授予频率，在公司发展的过程中逐步释放激励资源，有利于延续激励时效。'
                      optData = [[true, false, false], [false, false, true], [false, true]]
                      if(roundId > 4){
                          this.desc = '因为公司距上市目标较近，所以建议对适合的激励对象尽早实施授予，使其能够享有上市溢价，获得激励。因此建议一次性实施授予。'
                          optData = [[true, false, false], [false, false, true], [true, false]]
                      }
                      break;
                  case 4:
                      this.desc = '公司股价仍有较高上升潜力，用股票期权能够更好地激励员工拉升股价。\n' +
                          '已上市公司需要保持股权激励的延续性，以便持续激励员工为上市公司创造价值，因此建议采用逐年滚动授予的模式。'
                      optData = [[true, false, false], [true, false, false], [false, true]]
                      if(roundId > 11){
                          this.desc = '公司股价趋于平稳，限制性股票的保值特性更适合这个阶段的公司。\n' +
                              '已上市公司需要保持股权激励的延续性，以便持续激励员工为上市公司创造价值，因此建议采用逐年滚动授予的模式。'
                          optData = [[false, true, false], [true, false, false], [false, true]]
                      }
                      break;
                  case 5:
                      this.desc = '受监管机构对“境内注册公司在境外资本市场流通股占比”的指导原则限制，此类公司实施股权激励的政策门槛较高，建议采用基于现金的长期激励。该系统暂不支持基于现金的长期激励方案设计。'
                      optData = [[false, false, false], [false, false, false], [false, false]]
                      break;
              }
          }else if(areaId === 2){
              optData = [[true, true, false], [false, true, false], [true, true]]
              switch (stockZoneId){
                  case 1:
                      this.desc = '公司处于相对早期阶段，估值仍有较高上升潜力，用股票期权能够更好地激励员工拉升估值。\n' +
                          '公司处于相对早期阶段，距上市仍有一定距离，建议采用逐年滚动的授予频率，在公司发展的过程中逐步释放激励资源，有利于延续激励时效。'
                      optData = [[true, false, false], [false, true, false], [false, true]]
                      if(roundId > 3){
                          this.desc = '股票期权和限制性股票是境外架构下常见的激励工具，两者都可采用。但境外架构的公司计划在境内上市，未来需要拆除红筹架构，在拆除红筹架构的过程中，限制性股票更容易平移至境内满足境内上市监管要求，因此更建议采用限制性股票。\n' +
                              '因为公司距上市目标较近，所以建议对适合的激励对象尽早实施授予，使其能够享有上市溢价，获得激励。因此建议一次性实施授予。'
                          optData = [[true, true, false], [false, true, false], [true, false]]
                      }
                      break;
                  case 2:
                      this.desc = '公司处于相对早期阶段，估值仍有较高上升潜力，用股票期权能够更好地激励员工拉升估值。\n' +
                          '公司处于相对早期阶段，距上市仍有一定距离，建议采用逐年滚动的授予频率，在公司发展的过程中逐步释放激励资源，有利于延续激励时效。'
                      optData = [[true, false, false], [false, true, false], [false, true]]
                      if(roundId > 4){
                          this.desc = '股票期权和限制性股票是境外架构下常见的激励工具，两者都可采用。但公司未来在境外上市，股票获得流通性后流动性溢价会得以释放，股价仍有较大上涨空间，所以更建议采用股票期权。'
                          optData = [[true, true, false], [false, true, false], [true, false]]
                      }
                      break;
                  case 3:
                      this.desc = '公司处于相对早期阶段，估值仍有较高上升潜力，用股票期权能够更好地激励员工拉升估值。\n' +
                          '公司处于相对早期阶段，距上市仍有一定距离，建议采用逐年滚动的授予频率，在公司发展的过程中逐步释放激励资源，有利于延续激励时效。'
                      optData = [[true, false, false], [false, true, false], [false, true]]
                      if(roundId > 4){
                          this.desc = '股票期权和限制性股票是境外架构下常见的激励工具，两者都可采用。如公司未来拆除红筹架构，两者都可在拆除红筹架构的过程中平移为境内架构中的员工持股。如果公司未来在境外上市，股票获得流通性后流动性溢价会得以释放，股价仍有较大上涨空间，所以更建议采用股票期权。\n' +
                              '因为公司距上市目标较近，所以建议对适合的激励对象尽早实施授予，使其能够享有上市溢价，获得激励。因此建议一次性实施授予。\n' +
                              '\n'
                          optData = [[true, true, false], [false, true, false], [true, false]]
                      }
                      break;
                  case 4:
                      this.desc = '目前中国境外注册的公司尚不允许在中国境内上市。请重新选择您的公司信息。'
                      optData = [[false, false, false], [false, false, false], [false, false]]
                      break;
                  case 5:
                      this.desc = '公司股价仍有较高上升潜力，用股票期权能够更好地激励员工拉升股价。\n' +
                          '已上市公司需要保持股权激励的延续性，以便持续激励员工为上市公司创造价值，因此建议采用逐年滚动授予的模式。\n' +
                          '\n'
                      optData = [[true, false, false], [false, true, false], [false, true]]
                      if(roundId > 11){
                          this.desc = '公司股价趋于平稳，限制性股票的保值特性更适合这个阶段的公司。\n' +
                              '已上市公司需要保持股权激励的延续性，以便持续激励员工为上市公司创造价值，因此建议采用逐年滚动授予的模式。'
                          optData = [[false, true, false], [false, true, false], [false, true]]
                      }
                      break;
              }
          }
          this.$refs.rsiderfunc.changeOption(optData)
      },
  }
}
</script>

<style lang="less">
</style>
