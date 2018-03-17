<template>
  <div>
    <img class="main-img" src="http://img.paascloud.net/login/paascloud/paascloud.png" alt="">
    <div class="res">
      <div class="main-top">
        <i class="fa fa-user-o" aria-hidden="true"></i>
        <p class="login">登录</p>
        <a href="#" @click="loadPage('Register')" class="login-register">注册</a>
      </div>
      <div class="main-bot">
        <i @keyup.13="doLogin">
          <input class="login-input" @keyup.13="doLogin" v-model="loginForm.loginName" type="text" placeholder="请输入帐号"/>
          <input class="login-input" @keyup.13="doLogin" v-model="loginForm.loginPwd" type="password" placeholder="密码不少于6位"/>
        </i>
        <div class="image-code-div">
          <input type="text" v-model="loginForm.captchaCode" placeholder="验证码">
          <img v-lazy="imageCode" @click="getImage" class="login-image-code"/>
        </div>
        <div class="main-password">
          <div class="rem">
            <input type="checkbox" class="button" @click="rememberMeFn" :checked="rememberMe" value="Bike"/>
            <a href="#" class="rememberMe">&nbsp;记住我</a>
          </div>
          <div class="fog">
            <a @click="loadPage('ResetPwdEmail')">忘记密码?</a>
          </div>
        </div>
        <div class="error-item" v-show="showError">
          <i class="fa fa-minus-circle error-icon"></i>
          <p class="err-msg">{{errMsg}}</p>
        </div>
        <button class="login" @click="doLogin">登录</button>
        <div class="other">
          <ul>
            <li>
              <hr/>
            </li>
            <li><p>其他方式登录</p></li>
            <li>
              <hr/>
            </li>
          </ul>
        </div>
        <div class="last">
          <ul>
            <li><a href="#"><img src="../../../assets/images/login/git1.png" alt=""></a></li>
            <li><a href="#"><img src="../../../assets/images/login/git2.png" alt=""></a></li>
            <li><a href="#"><img src="../../../assets/images/login/git3.png" alt=""></a></li>
            <li><a href="/uac/auth/qq"><img src="../../../assets/images/login/git4.png" alt=""></a></li>
            <li><a href="/auth/weixin"><img src="../../../assets/images/login/git5.png" alt=""></a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        showError: false,
        errMsg: '',
        imageCode: '',
        deviceId: '',
        loginForm: {
          loginName: '',
          loginPwd: '',
          captchaCode: ''
        }
      };
    },
    mounted () {
      this.getImage();
    },
    methods: {
      doLogin () {
        let validateResult = this.formValidate();
        if (!validateResult.status) {
          this.$store.dispatch('new_notice', {
            autoClose: true,
            content: validateResult.msg
          });
          return;
        }
        this.login();
      },
      login () {
        let loginName = this.loginForm.loginName;
        let loginPwd = this.loginForm.loginPwd;
        this.$http({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'deviceId': this.deviceId
          },
          url: '/uac/auth/form',
          auth: {
            username: 'paascloud-client-uac',
            password: 'paascloudClientSecret'
          },
          params: {
            username: loginName,
            password: loginPwd,
            imageCode: this.loginForm.captchaCode
          }
        }).then((res) => {
          this.getImage();
          if (res && res.code === 200) {
            this.$store.dispatch('update_auth_token', res.result);
            window.location.href = this.redirectUri;
          }
        }).catch((err) => {
          console.log(err);
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
      },
      rememberMeFn() {
        this.$store.dispatch('update_remember_me');
      },
      formValidate () {
        let result = {
          status: false,
          msg: ''
        };
        if (!this.validate(this.loginForm.loginName, 'require')) {
          result.msg = '用户名不能为空';
          return result;
        }
        if (!this.validate(this.loginForm.loginPwd, 'require')) {
          result.msg = '密码不能为空';
          return result;
        }
        if (!this.validate(this.loginForm.captchaCode, 'require')) {
          result.msg = '验证码不能为空';
          return result;
        }
        // 通过验证，返回正确提示
        result.status = true;
        result.msg = '验证通过';
        return result;
      }
    },
    computed: {
      rememberMe() {
        return this.$store.getters.getRememberMe;
      },
      redirectUri() {
        return this.$store.getters.getRedirectUri;
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .image-code-div {
    width: 320px;
    height: 40px;
    margin-bottom: 14px;
  }
  .login-image-code {
    width: 106px !important;
    height: 40px;
    border: 1px solid #DCE4E6;
    padding-left: 0;
    float: right;
  }
  .image-code-div input {
    float: left;
    width: 210px;
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
  .main-img {
    width: 375px;
    height: 300px;
    margin: 80px 0 140px 120px;
    float: left;
  }

  .main .res {
    width: 480px;
    background-color: #ffffff;
    float: left;
    margin: 60px 0 174px 0;
    height: 450px;
  }

  .main-top {
    width: 420px;
    height: 25px;
    margin: 10px 20px;
  }

  .main-top .login {
    float: left;
    color: #40485b;
    font-size: 20px;
  }

  .main-top .login-register {
    float: right;
    color: #e97b21;
    font-size: 14px;
  }

  .res .main-bot {
    width: 320px;
    height: 260px;
    margin: 30px 80px 30px 80px;
  }

  .main-bot .login-input {
    width: 320px;
    height: 40px;
    margin-bottom: 20px;
    outline: 0;
    font-size: 16px;
    color: #a1a1a2;
    text-indent: 1em;
    background-color: #f3f6f8;
    border: 1px solid #dce3e8;
  }

  .main-bot .button {
    width: 15px;
    height: 15px;
    border: 1px solid #9b9b9b;
  }

  .rem .rememberMe {
    color: #333333;
  }

  .rem {
    float: left;
  }

  .fog {
    float: right;
  }

  .main-bot .main-password {
    margin-bottom: 20px;
  }

  .main-bot .login {
    width: 320px;
    height: 40px;
    margin-bottom: 20px;
    outline: 0;
    font-size: 16px;
    background-color: #fe7300;
    border: 0;
    color: #ffffff;
    cursor: pointer;
  }

  .other {
    width: 320px;
    height: 20px;
    margin-bottom: 20px;
  }

  .other hr {
    width: 80px;
    margin-top: 10px;
    border: 1px solid #e5e6e6;

  }

  .other li {
    height: 40px;
    float: left;
  }

  .other p {
    display: inline-block;
    color: #9b9b9b;
    margin: 0 30px 0 30px;
  }

  .last {
    width: 320px;
    height: 40px;
  }

  .main-bot .last img {
    width: 40px;
    height: 40px;
    margin: 0 12px;
    float: left;
  }
</style>
