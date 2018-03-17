<template>
  <div>
    {{message}}
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        message: '请稍候...',
        activeToken: ''
      };
    },
    created () {
      this.activeToken = this.$route.query.activeToken;
      console.info(this.activeToken);
      this.activeUserFn(this.activeToken);
    },
    methods: {
      activeUserFn (activeToken) {
        let that = this;
        this.ajax({
          url: `/uac/auth/activeUser/${activeToken}`,
          success: (res) => {
            if (res.status === 200) {
              that.message = '激活用户成功, 请重新登录';
              that.$store.dispatch('new_notice', {
                autoClose: true,
                content: that.message
              });
            }
            that.loadPage('Login');
          }
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
</style>
