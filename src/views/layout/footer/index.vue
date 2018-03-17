<template>
  <div class="footer-big">
    <div class="footer-inner w">
      <a href="http://paascloud.net" target="_blank" class="footer-l">© 2016 - 2017 paascloud.net 版权所有</a>
      <a href="http://paascloud.net" target="_blank" class="footer-r">京ICP备17045502号</a>
    </div>
  </div>
</template>

<style rel="stylesheet/scss" lang="scss">
  .footer-big {
    width: 100%;
    overflow: hidden;
    background: #333;
    position: fixed;
    bottom:0;
    left:0;
  }

  .footer-inner {
    height: 46px;
    width: 1000px;
  }

  .footer-inner .footer-l {
    float: left;
    line-height: 46px;
    color: #9a9a9a;
  }

  .footer-inner .footer-r {
    float: right;
    color: #9a9a9a;
    line-height: 46px;
  }
</style>
