import { refreshToken } from 'src/api/index.js';
import { PcCookie, PcLockr, enums } from '../../utils/';
const state = {
  loginName: '',
  rememberMe: false,
  menuList: [],
  redirectUri: '',
  authToken: {
    access_token: '',
    expires_in: '',
    timestamp: ''
  },
  refreshToken: {
    refresh_token: ''
  }
};

const getters = {
  getRememberMe: (state) => {
    if (!state.rememberMe) {
      state.rememberMe = !!PcCookie.get(enums.USER.REMEMBER_ME);
    }
    return state.rememberMe;
  },
  getRefreshToken: (state) => {
    if (!state.refreshToken) {
      state.refreshToken = PcCookie.get(enums.USER.REFRESH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.REFRESH_TOKEN)) : {};
    }
    return state.refreshToken.refresh_token;
  },
  getAccessToken: (state) => {
    if (!state.authToken) {
      state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
    }
    return state.authToken.access_token;
  },
  getAuthToken: (state) => {
    if (!state.authToken || state.authToken.access_token === '') {
      state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
    }
    return state.authToken;
  },
  getRedirectUri: (state) => {
    if (!state.redirectUri) {
      state.redirectUri = PcCookie.get(enums.USER.REDIRECT_URI) ? PcCookie.get(enums.USER.REDIRECT_URI) : 'http://mall.paascloud.net';
    }
    return state.redirectUri;
  }
};

const mutations = {
  updateRememberMe (state) {
    state.rememberMe = !state.rememberMe;
    console.info('state.rememberMe', state.rememberMe);
    if (state.rememberMe) {
      PcCookie.set({
        key: enums.USER.REMEMBER_ME,
        value: state.rememberMe
      });
    } else {
      PcCookie.delete({
        key: enums.USER.REMEMBER_ME
      });
    }
  },
  updateUserInfo (state, loginName) {
    state.loginName = loginName;
    PcCookie.set({
      key: enums.USER.LOGIN_NAME,
      value: loginName
    });
  },
  updateUserMenu (state, menuList) {
    state.menuList = menuList;
    PcLockr.set(enums.USER.MENU_LIST, menuList);
  },
  updateAuthToken (state, authToken) {
    state.authToken = authToken;
    // https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
    let expires = 2 / 24;
    let isRemember = !!PcCookie.get(enums.USER.REMEMBER_ME);
    if (isRemember) {
      expires = 7;
    }
    // debugger;
    delete authToken['jti'];
    delete authToken['token_type'];
    let refreshToken = {};
    Object.assign(refreshToken, authToken);
    // delete authToken['scope'];
    delete authToken['refresh_token'];
    delete refreshToken['access_token'];
    state.refreshToken = refreshToken;
    console.info('token:', authToken);
    PcCookie.set({
      key: enums.USER.AUTH_TOKEN,
      value: authToken,
      expires: expires
    });
    PcCookie.set({
      key: enums.USER.REFRESH_TOKEN,
      value: refreshToken,
      expires: expires
    });
  },
  deleteUserInfo (state) {
    PcCookie.delete({
      key: enums.USER.LOGIN_NAME
    });
    state.loginName = '';
    PcCookie.delete({
      key: enums.USER.REMEMBER_ME
    });
    state.rememberMe = false;
  },
  deleteUserMenuToken (state) {
    state.menuList = [];
    PcCookie.delete({
      key: enums.USER.MENU_LIST
    });
  },
  deleteAuthToken (state) {
    state.authToken = {};
    PcCookie.delete({
      key: enums.USER.AUTH_TOKEN
    });
  },
  deleteMenuList (state) {
    PcLockr.delete(enums.USER.MENU_LIST);
    state.menuList = {};
  },
  deleteRememberMe (state) {
    PcLockr.delete(enums.USER.REMEMBER_ME);
    state.rememberMe = '';
  },
  updateRedirectUri (state, redirectUri) {
    state.redirectUri = redirectUri;
    PcCookie.set({
      key: enums.USER.REDIRECT_URI,
      value: redirectUri
    });
  }
};

const actions = {
  get_access_token({commit}, cb) {
    if (!state.authToken || state.authToken.access_token === '') {
      state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
    }
    console.info('refresh_token:', state.authToken.refresh_token);
    if (state.authToken.access_token) {
      // 判断是否需要续租
      if ((new Date().getTime() - state.authToken.timestamp) > 100 * 60 * 1000) {
        refreshToken().then(res => {
          console.info('res:', res);
          if (res.data.code === 200) {
            commit('updateAuthToken', res.data.result);
          } else {
            commit('deleteUserInfo');
            commit('deleteAuthToken');
            commit('deleteMenuList');
            commit('deleteRememberMe');
            jumpLoginPage();
          }
        });
      }
    }
    cb && cb(state.authToken.access_token);
  },
  update_remember_me ({commit}) {
    commit('updateRememberMe');
  },
  update_user_info ({commit}, loginName) {
    commit('updateUserInfo', loginName);
  },
  update_user_menu ({commit}, menuList) {
    commit('updateUserMenu', menuList);
  },
  delete_user_info ({commit}, loginName) {
    commit('deleteUserInfo', loginName);
    commit('deleteAuthToken');
    commit('deleteUserMenuToken');
    commit('deleteRememberMe');
  },
  update_auth_token ({commit}, authToken) {
    commit('updateAuthToken', authToken);
  },
  update_redirect_uri ({commit}, redirectUri) {
    commit('updateRedirectUri', redirectUri);
  }
};

function jumpLoginPage () {
  if (process.env.NODE_ENV === 'production') {
    window.location.href = 'http://login.paascloud.net/login';
  } else {
    window.location.href = 'http://dev-login.paascloud.net/login';
  }
}

export default {
  state,
  getters,
  actions,
  mutations
};
