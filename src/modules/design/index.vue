<template>
  <ld-page>
    <ld-header :active="2"></ld-header>
    <ld-stepbar :step="1"></ld-stepbar>
    <router-view></router-view>
    <ld-footer></ld-footer>
  </ld-page>
</template>

<script>
import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
import LdStepbar from '../../components/stepbar'
import user from '../../services/user'

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter,
    LdStepbar
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
