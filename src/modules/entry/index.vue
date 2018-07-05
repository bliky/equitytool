<template>
  <ld-page>
    <ld-header :active="2"></ld-header>
    <router-view></router-view>
    <ld-footer></ld-footer>
  </ld-page>
</template>

<script>
import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'


export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter,
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  methods: {
  }
}
</script>

<style lang="less">
</style>
