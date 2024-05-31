<template>
  <footer class="center">
    <p class="midFont light-grey" id="footItem1"></p>
    <p class="midFont light-grey" id="footItem">{{$t('login.footer')}}</p>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
footer {
  padding-top: 12px;
  .footerWrap {
    ul {
      li {
        display: inline-block;
        a {
          color: white;
        }
      }
    }
  }
  p {
    margin-top: 10px;
    color: white !important;
    line-height: 24px;
    img {
      vertical-align: middle;
      position: relative;
      top: -2px;
    }
  }
}
</style>
