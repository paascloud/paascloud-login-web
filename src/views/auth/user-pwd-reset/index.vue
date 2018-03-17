<template>
  <div class="reset-pwd">
    <div class="reset-pwd-2">
      <form class="reset-pwd-form">
        <header class="send-header">
          <div class="send-title">重置密码</div>
        </header>
        <div class="send-content">
          <div class="send-password">
            <input type="password" @blur="checkPwd" v-model="resetPwdForm.newPassword" placeholder="新密码">
          </div>
          <div class="send-password">
            <input type="password" @blur="checkPwd" v-model="resetPwdForm.confirmPwd" placeholder="确认密码">
          </div>
          <input type="button" :class="activeSubmitButton ? 'active-reset-submit' : 'inactive-reset-submit'" @click="restPwdFn" value="提交">
        </div>
      </form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        deviceId: '',
        activeSubmitButton: false,
        resetPwdForm: {
          newPassword: '',
          confirmPwd: '',
          resetPwdKey: ''
        }
      };
    },
    created () {
      this.checkParam();
    },
    mounted () {
    },
    methods: {
      checkParam() {
        let resetPwdKey = this.getUrlParam('resetPwdKey');
        let resetPwdKeyFlag = Boolean(resetPwdKey);
        if (!resetPwdKeyFlag) {
          this.goBack();
        }
        this.resetPwdForm.resetPwdKey = resetPwdKey;
        // 校验token是否超时(以后在做 超时跳到上一次请求页面)
      },
      checkPwd() {
        this.activeSubmitButton = false;
        let newPassword = this.resetPwdForm.newPassword;
        let confirmPwd = this.resetPwdForm.confirmPwd;
        if (!newPassword || !confirmPwd || newPassword !== confirmPwd) {
          return false;
        }
        this.activeSubmitButton = true;
      },
      restPwdFn() {
        let that = this;
        console.info('that.resetPwdForm,', that.resetPwdForm);
        this.checkPwd();
        that.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: `/uac/auth/resetLoginPwd`,
          params: that.resetPwdForm
        }).then((res) => {
          if (res && res.code === 200) {
            that.successTips('重置密码成功');
            that.loadPage('Login');
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .reset-pwd {
    height: 360px;
    position: relative;
    margin-top: 100px;
  }

  .reset-pwd-2 {
    width: 480px;
    height: 360px;
    position: absolute;
    left: 50%;
    margin-left: -240px;
  }

  .reset-pwd-form {
    display: block;
    padding: 23px 30px 55px 30px;
    height: 297px;
    border: 1px solid #E3E9ED;
    background-color: #fff;
    position: relative;
    overflow: hidden;

  }

  .send-header {
    height: 25px;
    width: 418px;
    margin: 2px 0 25px 0;
    overflow: hidden;
  }

  .send-title {
    padding-left: 40px;
    font-size: 19px;
    float: left;
    color: #40485b;
  }

  .send-content{
    width: 298px;
    height: 146px;
    position: relative;
    left: 50%;
    margin-left: -149px;
  }

 .send-password {
    width: 298px;
    height: 40px;
    background: #F3F6F8;
    line-height: 18px;
    font-size: 16px;
    margin-bottom: 14px;

  }
  .send-password input {
    font-size: 16px;
    width: 298px;
    height: 40px;
    background: #F3F6F8;
    padding: 10px 12px;
    border: 1px solid #dce3e8;
    outline: none;
  }

  .inactive-reset-submit {
    width: 298px;
    height: 40px;
    font-size: 18px;
    line-height: 22px;
    padding: 8px 26px;
    font-weight: 500;
    cursor: default;
    background-color: #dcddde !important;
    color: rgba(0, 0, 0, 0.4) !important;
    box-shadow: none !important;
    opacity: 0.3 !important;
    pointer-events: none;
  }

  .active-reset-submit {
    background-color: #fe7300;
    opacity: 1 !important;
    color: #fff;
    width: 298px;
    height: 40px;
    font-size: 18px;
    line-height: 22px;
    padding: 8px 26px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: none !important;
  }

</style>
