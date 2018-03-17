<template>
  <div class="reset-outer w">
    <div class="reset-pwd-phone">
      <form class="reset-form">
        <header class="reset-header">
          <div class="send-title">重置密码</div>
          <div class="no-reset"><a href="#" @click="loadPage('Login')">返回登录</a></div>
        </header>
        <div class="reset-content">
          <div class="reset-phone">
            <input class="reset-phone" v-model="resetPwdPhoneForm.mobileNo" type="text" @blur="validatePhone" placeholder="手机号码">
          </div>
          <div class="reset-check">
            <input type="text" v-model="resetPwdPhoneForm.imageCode" @blur="checkImageCode" class="inputMa" placeholder="验证码">
            <img v-lazy="imageCode" @click="getImage" class="check-ma"/>
          </div>
          <div class="reset-msg">
            <input class="input-msg" v-model="resetPwdPhoneForm.smsCode" @blur="checkSmsCode" placeholder="短信验证码">
            <pc-timer-button :class="activeSendSmsButton && isTimerStop ? 'active-send-sms-code' : 'inactive-send-sms-code'" ref="timerBtn" @on-run="sendPhoneCode" @on-stop="isTimerStop = true">发送验证码</pc-timer-button>
          </div>
          <input type="button" value="提交" @click="submitRestPwdWithPhone" :class="activeSubmitButton ? 'active-reset-submit-phone' : 'inactive-reset-submit-phone'">
        </div>
        <footer class="reset-email"><a @click="loadPage('ResetPwdEmail')">其他方式箱重置密码</a></footer>
      </form>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import PcTimerButton from 'components/form/timer-button/index.vue';
  import Cookies from 'js-cookie';
  export default {
    data () {
      return {
        imageCode: '',
        deviceId: '',
        checkSmsCodeResult: false,
        isTimerStop: true,
        checkKaptchaCodeResult: false,
        checkTelephoneResult: false,
        resetPwdPhoneForm: {
          imageCode: '',
          mobileNo: '',
          smsCode: ''
        }
      };
    },
    created () {
      this.getImage();
    },
    mounted () {
    },
    components: {
      PcTimerButton
    },
    methods: {
      submitRestPwdWithPhone() {
        if (!this.activeSendSmsButton) {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: '校验失败'
          });
          return;
        }
        let that = this;
        that.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: `/uac/auth/submitResetPwdPhone`,
          params: {
            mobile: that.resetPwdPhoneForm.mobileNo,
            smsCode: this.resetPwdPhoneForm.smsCode
          }
        }).then((res) => {
          if (res.code === 200) {
            // 从cookie获取resetPwdKey
            let resetPwdKey = Cookies.get('PASSCLOUD_PAAS_resetPwdKey');
            console.info('resetPwdKey:', resetPwdKey);
            that.loadPage('ResetPwd', {resetPwdKey: resetPwdKey});
          } else {
            this.getImage();
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      sendPhoneCode () {
        let mobileNo = this.resetPwdPhoneForm.mobileNo;
        this.isTimerStop = false;
        if (!mobileNo) {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: '手机号码不能为空'
          });
          return;
        }
        this.$refs.timerBtn.start();
        this.$http({
          method: 'POST',
          url: `/uac/auth/code/sms`,
          headers: {
            'deviceId': this.deviceId
          },
          params: {
            mobile: mobileNo,
            imageCode: this.resetPwdPhoneForm.imageCode
          }
        }).then((res) => {
          if (res.code === 200) {
            console.info('发送验证码成功');
          } else {
            alert(res.message);
            this.getImage();
            this.$refs.timerBtn.stop();
          }
        });
      },
      checkSmsCode () {
        let that = this;
        if (!this.activeSendSmsButton) {
          return;
        }
        let mobileNo = this.resetPwdPhoneForm.mobileNo;
        let smsCode = this.resetPwdPhoneForm.smsCode;
        if (!mobileNo) {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: '手机号码不能为空'
          });
          return;
        }
        if (!smsCode) {
          console.info('验证码不能为空', mobileNo);
          return;
        }
        this.$http({
          method: 'GET',
          url: `/uac/auth/code/sms`,
          headers: {
            'deviceId': that.deviceId
          },
          params: {
            smsCode: smsCode
          }
        }).then((res) => {
          if (!res.result) {
            this.$store.dispatch('new_notice', {
              autoClose: true,
              content: res.message
            });
            that.checkSmsCodeResult = res.result;
          }
          that.checkSmsCodeResult = res.result;
        });
      },
      validatePhone() {
        this.checkTelephoneResult = false;
        let mobileNo = this.resetPwdPhoneForm.mobileNo;
        if (!mobileNo) {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: '手机号码不能为空'
          });
          return;
        }
        let that = this;
        let reg = /^1\d{10}$/;
        let result = reg.test(mobileNo);
        if (!result) {
          that.$store.dispatch('new_notice', {
            autoClose: true,
            content: '手机号码格式不正确'
          });
        } else {
          this.$http({
            method: 'POST',
            url: '/uac/auth/checkPhoneActive/' + mobileNo,
            data: ''
          }).then((res) => {
            if (!res.result) {
              that.$store.dispatch('new_notice', {
                autoClose: true,
                content: '帐号没有激活'
              });
            }
            that.checkTelephoneResult = res.result;
          });
        }
      },
      checkImageCode () {
        let that = this;
        this.$http({
          method: 'GET',
          url: `/uac/auth/code/image`,
          headers: {
            'deviceId': that.deviceId
          },
          params: {
            imageCode: this.resetPwdPhoneForm.imageCode
          }
        }).then((res) => {
          that.checkKaptchaCodeResult = res.result;
        });
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
      activeSendSmsButton() {
        return this.checkKaptchaCodeResult && this.checkTelephoneResult;
      },
      activeSubmitButton() {
        return this.activeSendSmsButton && this.checkSmsCodeResult;
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

  .reset-form {
    display: block;
    padding: 23px 30px 55px 30px;
    height: 360px;
    border: 1px solid #E3E9ED;
    background-color: #fff;
    position: relative;
    overflow: hidden;
  }

  .reset-header, .send-header {

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

  .no-reset, .no-send {
    height: 25px;
  }

  .no-reset a, .no-send a {
    font-size: 14px;
    color: #fe7300;
    float: right;
  }

  .reset-content {
    width: 298px;
    height: 200px;
    position: relative;
    left: 50%;
    margin-left: -149px;
  }

  .send-content {
    width: 298px;
    height: 146px;
    position: relative;
    left: 50%;
    margin-left: -149px;
  }

  .reset-phone, .send-email {
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

  .reset-phone input {
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

  .check-ma {
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

  .inactive-send-sms-code {
    width: 106px !important;
    height: 40px;
    border: 1px solid #DCE4E6;
    float: right;
    padding: .5em .92857em;
    font-weight: normal;
    border-radius: 2px;
    box-shadow: none !important;
    background-color: #dcddde !important;
    color: rgba(0, 0, 0, 0.4) !important;
    opacity: 0.3 !important;
    pointer-events: none;
    cursor: default;
  }
  .active-send-sms-code {
    width: 106px !important;
    height: 40px;
    border: 1px solid #DCE4E6;
    float: right;
    padding: .5em .92857em;
    font-weight: normal;
    border-radius: 2px;
    box-shadow: none !important;
    cursor: pointer;
    color: #fff;
    background-color: #fe7300;
  }


  .inactive-reset-submit-phone {
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

  .active-reset-submit-phone {
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
