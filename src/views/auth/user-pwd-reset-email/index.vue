<template>
  <div class="reset-outer w">
    <div class="reset-pwd-phone">
      <form class="send-form">
        <header class="send-header">
          <div class="send-title">发送重置密码邮件</div>
          <div class="no-send"><a href="#" @click="loadPage('Login')">返回登录</a></div>
        </header>
        <div class="send-content">
          <div class="send-email">
            <input type="text" @blur="validateEmail" v-model="resetPwdEmailForm.email" placeholder="Email">
          </div>
          <div class="reset-check">
            <input type="text" v-model="resetPwdEmailForm.imageCode" class="input-ma" placeholder="验证码">
            <img v-lazy="imageCode" @click="getImage" class="captcha-code"/>
          </div>
          <input type="button" @click="submitRestPwdWithEmail" value="提交" :class="activeSubmitButton ? 'active-reset-submit-email' : 'inactive-reset-submit-email'">
        </div>
        <footer class="reset-email"><a @click="loadPage('ResetPwdPhone')">其他方式重置密码</a></footer>
      </form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        imageCode: '',
        checkEmailResult: false,
        resetPwdEmailForm: {
          imageCode: '',
          email: ''
        }
      };
    },
    created () {
      this.getImage();
    },
    mounted () {
    },
    methods: {
      submitRestPwdWithEmail() {
        let that = this;
        that.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: `/uac/auth/submitResetPwdEmail`,
          params: this.resetPwdEmailForm
        }).then((res) => {
          if (res.code === 200) {
            that.$store.dispatch('new_notice', {
              autoClose: true,
              content: '重置密码邮件已发送，请按邮件提示重置密码'
            });
            that.loadPage('Login');
          } else {
            that.getImage();
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      validateEmail() {
        this.checkEmailResult = false;
        let email = this.resetPwdEmailForm.email;
        if (!email) {
          console.info('邮箱不能为空');
          return;
        }
        let that = this;
        let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        let result = reg.test(email);
        if (!result) {
          console.info('未通过正则校验');
        } else {
          this.$http({
            method: 'POST',
            url: '/uac/auth/checkEmailActive/' + email,
            data: ''
          }).then((res) => {
            that.checkEmailResult = res.result;
          });
        }
      },
      getImage () {
        let that = this;
        that.deviceId = new Date().getTime();
        this.$http({
          method: 'POST',
          url: '/uac/auth/code/image',
          headers: {
            'deviceId': that.deviceId
          },
          data: ''
        }).then((res) => {
          that.imageCode = 'data:image/jpg;base64,' + res.result;
        });
      }
    },
    computed: {
      activeSubmitButton() {
        return this.checkEmailResult;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .reset-outer {
    height: 360px;
    position: relative;
    margin-top: 100px;
  }

  .reset-pwd-email {
    width: 480px;
    height: 297px;
    position: absolute;
    left: 50%;
    margin-left: -240px;
  }

  .reset-pwd-phone {
    width: 480px;
    height: 360px;
    position: absolute;
    left: 50%;
    margin-left: -240px;
  }

  .send-form {
    display: block;
    padding: 23px 30px 55px 30px;
    height: 297px;
    border: 1px solid #E3E9ED;
    background-color: #fff;
    position: relative;
    overflow: hidden;

  }
  .reset-form{
    display: block;
    padding: 23px 30px 55px 30px;
    height: 360px;
    border: 1px solid #E3E9ED;
    background-color: #fff;
    position: relative;
    overflow: hidden;
  }

  .reset-header,.send-header {

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

  .no-reset,.no-send {
    height: 25px;
  }

  .no-reset a,.no-send a{
    font-size: 14px;
    color: #fe7300;
    float: right;
  }

  .reset-content{
    width: 298px;
    height: 200px;
    position: relative;
    left: 50%;
    margin-left: -149px;
  }
  .send-content{
    width: 298px;
    height: 146px;
    position: relative;
    left: 50%;
    margin-left: -149px;
  }

  .reset-phone,.send-email {
    width: 298px;
    height: 40px;
    background: #F3F6F8;
    line-height: 18px;
    font-size: 16px;
    margin-bottom: 14px;

  }
  .send-email input {
    font-size: 16px;
    width: 298px;
    height: 40px;
    background: #F3F6F8;
    padding: 10px 12px;
    border: 1px solid #dce3e8;
    outline: none;
  }

  .reset-phone input{
    padding: 10px 12px;
    box-shadow: none;
    border-radius: 2px;
    border: 1px solid #dce3e8;
    outline: none;
  }

  .reset-check {
    width: 298px;
    height: 40px;
    margin-bottom: 14px;

  }

  .reset-check input {
    float: left;
    width: 185px;
    height: 40px;
    padding-right: 7px;
    border-radius: 2px;
    border: 1px solid #dce3e8;
    outline: none;
    background: #F3F6F8;
    padding-left: 10px;
    line-height: 18px;
    font-size: 16px;
  }

  .captcha-code {
    width: 106px !important;
    height: 40px;
    border: 1px solid #DCE4E6;
    padding-left: 0;
    float: right;
  }

  .reset-msg {
    width: 298px;
    height: 40px;
    margin-bottom: 14px;
  }

  .input-msg {
    float: left;
    width: 185px;
    height: 40px;
    padding-right: 7px;
    border-radius: 2px;
    border: 1px solid #dce3e8;
    outline: none;
    background: #F3F6F8;
    padding-left: 10px;
    line-height: 18px;
    font-size: 16px;
  }

  .check-msg {
    width: 106px !important;
    height: 40px;
    border: 1px solid #DCE4E6;
    float: right;
    padding: .5em .92857em;
    font-weight: normal;
    border-radius: 2px;
    cursor: default;
    background-color: #dcddde !important;
    color: rgba(0, 0, 0, 0.4) !important;
    opacity: 0.3 !important;
    box-shadow: none !important;
    pointer-events: none;
  }

  .reset-submit {
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

  .inactive-reset-submit-email {
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

  .active-reset-submit-email {
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

  .reset-email {
    width: 298px;
    height: 18px;
    line-height: 18px;
    margin-top: 14px;
    overflow: hidden;
    text-align: center;
    position: absolute;
    left: 50%;
    margin-left: -149px;
    font-size: 14px !important;
    color: #8c92a4;
  }
</style>
