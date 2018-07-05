<template>
  <ld-page>
    <ld-header></ld-header>
      <p style="margin:160px auto; width:300px; height:300px; line-height:100px; font-size: 50px; background-color:#fff; text-align:center; color:#0074f1; padding:100px;">首页</p>
    <ld-footer></ld-footer>
  </ld-page>
</template>

<script>
import LdPage from '../components/page'
import LdHeader from '../components/header'
import LdFooter from '../components/footer'

export default {
  components: {
    LdPage,
    LdHeader,
    LdFooter
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
