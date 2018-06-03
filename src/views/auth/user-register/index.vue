<template>
  <div  style="display: inline-block; margin-bottom: 70px;">
    <img class="main-img" src="http://img.paascloud.net/login/paascloud/paascloud.png" alt="">
    <div class="res">
      <div class="main-top">
        <i class="fa fa-user-o fa-lg" aria-hidden="true"></i>
        <span class="register">注册</span>
        <a href="#" class="zhu" @click="loadPage('Login')">登录</a>
      </div>
      <div class="main-bot">
        <div class="field-inline">
          <p>登录名</p>
          <input class='main-input' type="text" v-model="registerForm.loginName"/>
        </div>
        <div class="field-inline">
          <p>邮箱</p>
          <input class='main-input' type="text" v-model="registerForm.email"/>
        </div>
        <div class="field-inline">
          <p>密码</p>
          <input class='main-input' type="password" v-model="registerForm.loginPwd"/>
        </div>
        <div class="field-inline">
          <p>确认密码</p>
          <input class='main-input' type="password" v-model="registerForm.confirmPwd"/>
        </div>
        <div class="field-inline">
          <p>手机号</p>
          <input class='main-input' type="text" v-model="registerForm.mobileNo"/>
        </div>
        <div class="register-check-dev">
          <p>验证码</p>
          <input type="text" v-model="registerForm.imageCode" class="inputMa" placeholder="验证码">
          <img v-lazy="imageCode" @click="getImage" class="check-ma"/>
        </div>
        <button class="register-btn" @click="submit">注册</button>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import PcTimerButton from 'components/form/timer-button/index.vue';
  export default {
    data () {
      return {
        imageCode: '',
        registerForm: {
          loginName: '',
          mobileNo: '',
          loginPwd: '',
          email: '',
          confirmPwd: '',
          imageCode: '',
          registerSource: 'PC'
        }
      };
    },
    created () {
      this.getImage();
    },
    mounted () {
    },
    methods: {
      getImage () {
        this.deviceId = new Date().getTime();
        let that = this;
        that.$http({
          method: 'POST',
          url: '/uac/auth/code/image',
          headers: {
            'deviceId': that.deviceId
          }
        }).then((res) => {
          that.imageCode = 'data:image/jpg;base64,' + res.result;
        });
      },
      submit () {
        let validateResult = this.formValidate();
        // 验证成功
        if (validateResult.status) {
          this.register(() => {
            this.$store.dispatch('new_notice', {
              autoClose: true,
              content: '注册成功, 请登录邮箱激活用户'
            });
            this.loadPage('Login');
          });
        } else {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: validateResult.msg
          });
        }
      },
      register (resolve) {
        this.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: '/uac/auth/register',
          params: this.registerForm
        }).then((res) => {
          this.getImage();
          if (res) {
            resolve(res);
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      formValidate () {
        let result = {
          status: false,
          msg: ''
        };
        // 验证用户名是否为空
        if (!this.validate(this.registerForm.loginName, 'require')) {
          result.msg = '用户名不能为空';
          return result;
        }

        // 校验登录名是否存在
//        this.checkCount((res) => {
//          if (!res.result) {
//            result.status = false;
//            result.msg = '用户名已存在';
//            return result;
//          }
//        }, this.registerForm.loginName, 'loginName');
        // 验证邮箱
        if (!this.validate(this.registerForm.email, 'require')) {
          result.msg = '邮箱不能为空';
          return result;
        }

        // 验证邮箱正则
        if (!this.validate(this.registerForm.email, 'email')) {
          result.msg = '邮箱格式不正确';
          return result;
        }

        // 校验邮箱是否存在
//        this.checkCount((res) => {
//          if (!res.result) {
//            result.status = false;
//            result.msg = '邮箱已存在';
//            return result;
//          }
//        }, this.registerForm.email, 'email');
        // 验证 密码
        if (!this.validate(this.registerForm.loginPwd, 'require')) {
          result.msg = '密码不能为空';
          return result;
        }
        // 验证 密码
        if (!this.validate(this.registerForm.confirmPwd, 'require')) {
          result.msg = '确认密码不能为空';
          return result;
        }
        if (!this.validate(this.registerForm.loginPwd, 'pwd')) {
          result.msg = '密码格式不正确';
          return result;
        }
        if (!this.validate(this.registerForm.confirmPwd, 'pwd')) {
          result.msg = '确认密码格式不正确';
          return result;
        }
        // 验证两次输入的密码是否一致
        if (this.registerForm.loginPwd !== this.registerForm.confirmPwd) {
          result.msg = '两次输入的密码不一致';
          return result;
        }

        if (!this.validate(this.registerForm.mobileNo, 'require')) {
          result.msg = '手机号码不能为空';
          return result;
        }

        // 验证手机号
        if (!this.validate(this.registerForm.mobileNo, 'phone')) {
          result.msg = '手机号格式不正确';
          return result;
        }

//        this.checkCount((res) => {
//          if (!res.result) {
//            result.status = false;
//            result.msg = '手机号码已存在';
//            return result;
//          }
//        }, this.registerForm.mobileNo, 'mobileNo');

        if (!this.validate(this.registerForm.imageCode, 'require')) {
          result.msg = '验证码不能为空';
          return result;
        }

        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
      },
      checkCount(resolve, validValue, type) {
        this.ajax({
          url: `/uac/auth/checkValid`,
          isUnMusk: true,
          data: {
            validValue: validValue,
            type: type
          },
          success: resolve
        });
      }
    },
    components: {
      PcTimerButton
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .main-img {
    width: 375px;
    margin: 27px 52.5px;
    float: left;
  }

  .main .res {
    float: right;
    width: 420px;
    margin: 0 30px;
    background-color: #ffffff;
    .main-top {
      height: 25px;
      line-height: 25px;
      margin: 10px 20px;
      i {
        font-size: 14px;
        line-height: 1;
        vertical-align: baseline;
      }
      .register {
        display: inline-block;
        color: #40485b;
        font-size: 16px;
      }
      .zhu {
        float: right;
        color: #e97b21;
        font-size: 16px;
      }
    }
    .main-bot {
      width: 330px;
      margin: 20px auto;
      .check-ma {
        width: 106px !important;
        height: 40px;
        border: 1px solid #DCE4E6;
        padding-left: 0;
        float: right;
      }
      .field-inline {
        width: 330px;
        height: 40px;
        margin-bottom: 10px;
        p {
          float: left;
          font-size: 14px;
          height: 40px;
          line-height: 40px;
        }
        input {
          float: right;
        }
      }
      .main-input {
        width: 248px;
        height: 40px;
        margin-bottom: 10px;
        outline: 0;
        font-size: 16px;
        color: #a1a1a2;
        text-indent: 1em;
        background-color: #f3f6f8;
        border: 1px solid #dce3e8;
      }
      .register-btn {
        width: 330px;
        height: 40px;
        margin-bottom: 20px;
        outline: 0;
        font-size: 16px !important;
        background-color: #fe7300;
        border: 0;
        cursor: pointer;
        color: #ffffff;
      }
    }
  }

  .register-check-dev {
    width: 330px;
    height: 40px;
    margin-bottom: 14px;
  }
  .register-check-dev p {
    float: left;
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }

  .register-check-dev input {
    margin-left: 40px;
    float: left;
    width: 135px;
    height: 40px;
    padding-right: 7px;
    border-radius: 2px;
    border: 1px solid #dce3e8;
    outline: none;
    background: #F3F6F8;
    padding-left: 26px;
    line-height: 18px;
    font-size: 16px;
  }
</style>
