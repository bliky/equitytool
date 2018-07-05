<template>
  <ld-page>
    <ld-header></ld-header>
    <div class="welcome"></div>
    <router-view></router-view>
  </ld-page>
</template>

<script>
import LdPage from '../../components/page'
import LdHeader from '../../components/header'
import LdFooter from '../../components/footer'
import user from '../../services/user'

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter
  },
  data () {
    return {}
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="less">
  .welcome{
    height: 60px;
    background:#ebf3fc;
  }
</style>
