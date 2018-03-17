import Vue from 'vue';
import App from './App';
import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import axios from 'axios';
import Vuex from 'vuex';
import store from './store/';
import VueLazyload from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import 'font-awesome/css/font-awesome.css';
import Mixin from './mixins';
import Bus from 'src/vueBus';
import filters from './filters';
import { enums, PcCookie, PcLockr, PcEncrypt } from 'utils/';
import 'element-ui/lib/theme-chalk/index.css';
import './style.less';
import {
  Dialog,
  MessageBox,
  Message,
  Loading
} from 'element-ui';

const components = [
  Dialog
];
components.map(component => {
  Vue.component(component.name, component);
});
Vue.prototype.$ELEMENT = { size: 'small' };
Vue.use(Loading.directive);
Vue.prototype.$pcLoading = Loading.service;
Vue.prototype.$pcMessageBox = MessageBox;
Vue.prototype.$pcMessage = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$pcNProgress = NProgress;
Vue.prototype.$pcBus = Bus;
Vue.prototype.$pcEnum = enums;
Vue.prototype.$pcEncrypt = PcEncrypt;
Vue.prototype.$pcLockr = PcLockr;
Vue.prototype.$pcCookie = PcCookie;

Vue.prototype.$http = axios.create({
  timeout: 60000
});

if (process.env.NODE_ENV === 'production') {
  Vue.prototype.$http.defaults.baseURL = 'http://api.paascloud.net/';
}

Vue.prototype.$http.interceptors.response.use((res) => {
  if (res.data.code === 200) {
    if (res.data) {
      return res.data;
    }
  }
  if (res.data.code === 10011039 || res.data.code === 10011040 || res.data.code === 10011041) {
    console.info('登录超时', res.data);
    // 验证token失败 || 解析header失败 || 页面已过期,请重新登录
    // store.dispatch('delete_user_info');
    // window.location.href = '/';
    return Promise.reject(res);
  } else {
    store.dispatch('new_notice', {
      autoClose: true,
      content: res.data.message
    });
    return Promise.reject(res);
  }
}, (error) => {
  let options = {
    autoClose: true,
    content: error.response.data.message
  };
  if (error.response) {
    console.error('error: ', error.response);
    if (error.response.status === 500) {
      options.content = error.response.data.message;
    } else if (error.response.status === 401) {
      store.dispatch('delete_user_info');
      options.content = '登录超时, 请重新登录';
      window.location.href = '/';
    } else {
      console.log('Error', error.message);
      options.content = '接口请求失败或超时！请刷新重试';
    }
  } else {
    options.content = '接口请求失败或超时！请刷新重试';
  }
  store.dispatch('new_notice', options);
});

router.beforeEach((to, from, next) => {
  store.dispatch('get_access_token', (res) => {
    if (res) {
      window.location.href = store.getters.getRedirectUri;
    } else {
      NProgress.start();
      next();
    }
  });
});
router.afterEach(transition => {
  NProgress.done();
});

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/static/loading-svg/loading-bars.svg',
  loading: '/static/loading-svg/loading-spinning-bubbles.svg',
  attempt: 2
});
Vue.use(infiniteScroll);
Vue.mixin(Mixin);

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
