import { defineStore } from 'pinia';
import UserService from 'src/services/user';
import AuthService from 'src/services/auth';
import {
  getFcmToken,
  getListUser,
  removeFcmToken,
  removeToken,
  setListUser,
  setToken,
} from 'src/helper/auth';
import { formNotify } from 'src/interface/notify';
import { RoleUSer } from 'src/constants/ConstantUser';
import { InitializeFireBaseMessaging } from 'boot/firebase';

export interface State {
  lang: string;
  user?: any;
  IsRefreshToken: boolean;
  listNotify: Array<formNotify>;
  reloadAllPage: number;
  reloadSideBar: number;
  listUser: any;
  loadingPage: boolean;
  isPageActive: boolean;
  countNotifyIsPageNotActive: number;
}

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () =>
    ({
      lang: 'en',
      user: null,
      IsRefreshToken: false,
      listNotify: [],
      reloadAllPage: 0,
      reloadSideBar: 0,
      listUser: null,
      loadingPage: false,
      isPageActive: true,
      countNotifyIsPageNotActive: 0,
    } as State),

  getters: {
    getLang: (state) => {
      return state.lang;
    },
    getUser: (state) => {
      return state.user;
    },
    getRole: (state) => {
      return state.user?.roles?.[0].name;
    },
    roleAdminWeb: (state) => {
      return state.user?.roles?.[0].name === RoleUSer['ADMIN'];
    },
  },

  actions: {
    async changeLanguages(languages: string, that: any) {
      this.lang = languages;
      that.$i18n.locale = languages;
    },
    updateUser(user: any) {
      this.user = user;
      setListUser(user);
      setTimeout(() => {
        // console.log(getListUser())
        this.listUser = Object.values(getListUser().data);
      }, 50);
    },
    getInfoUser() {
      return new Promise((resolve, reject) => {
        UserService.profile()
          .then((res: any) => {
            if (res?.status_code === 200) {
              this.updateUser(res.data);
              resolve(res.data);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      });
    },
    setInfoFcmToken() {
      return new Promise((resolve, reject) => {
        removeFcmToken();
        console.log('getTokenFcm', getFcmToken());
        InitializeFireBaseMessaging()
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            console.log('InitializeFireBaseMessaging failed');
            reject(false);
          });
      });
    },
    refreshToken(refresh_token: string) {
      return new Promise((resolve, reject) => {
        AuthService.refreshToken({
          refresh_token,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              setToken(JSON.stringify(res.data));
              this.setInfoFcmToken().then();
              resolve(res.data);
            } else {
              reject(false);
            }
          })
          .catch((err) => {
            reject(false);
          });
      });
    },
    logout() {
      removeToken();
      removeFcmToken();
      // AuthService.logout({})
      //   .then((res) => {
      //     console.log(res);
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    },

    // notify
    addListNotify(data: formNotify) {
      this.listNotify.push(data);
      // if (!this.isPageActive) {
      // this.countNotifyIsPageNotActive += 1
      //   if (document) {
      //     document.title = `(${this.countNotifyIsPageNotActive}) ${process.env.VUE_APP_TITLE}`
      //   }
      // }
    },
    actionReloadAllPage() {
      this.reloadAllPage += 1;
    },
    actionReloadSideBar() {
      this.reloadSideBar += 1;
    },
  },
});
