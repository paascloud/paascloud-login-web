import { Error, Auth } from '../views/';
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: resolve => require(['views/layout/index.vue'], resolve),
      redirect: {name: 'Login'},
      children: [{
        meta: {
          name: '用户登录',
          noRequiredAuth: true
        },
        path: 'login',
        name: 'Login',
        component: Auth.Login
      }, {
        meta: {
          name: '用户注册',
          noRequiredAuth: true
        },
        path: 'register',
        name: 'Register',
        component: Auth.Register
      }, {
        meta: {
          name: '忘记密码',
          noRequiredAuth: true
        },
        path: 'resetPwdEmail',
        name: 'ResetPwdEmail',
        component: Auth.ResetPwdEmail
      }, {
        meta: {
          name: '忘记密码',
          noRequiredAuth: true
        },
        path: 'resetPwdPhone',
        name: 'ResetPwdPhone',
        component: Auth.ResetPwdPhone
      }, {
        meta: {
          name: '重置密码',
          noRequiredAuth: true
        },
        path: 'resetPwd',
        name: 'ResetPwd',
        component: Auth.ResetPwd
      }, {
        meta: {
          name: '激活用户',
          noRequiredAuth: true
        },
        path: 'activeUser',
        name: 'ActiveUser',
        component: Auth.ActiveUser
      }]
    },
    {
      path: '*',
      component: Error.NotFoundPage
    }
  ]
});
