import { getToken, removeToken, returnLogin } from 'src/helper/auth';
import { useMainStore } from 'stores/main';

function configRequestNoAuth(instance: any, context: any) {
  instance.interceptors.request.use(
    async function (config: any) {
      config.headers.timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon';
      if (context?.router?.currentRoute?.value?.params?.workspaceId) {
        config.headers['workspace-id'] =
          context.router.currentRoute.value.params.workspaceId;
      }
      return config;
    },
    function (err: any) {
      return Promise.reject(err);
    },
  );
}

function configRequest(instance: any, context: any) {
  const mainStore = useMainStore(context.store);
  instance.interceptors.request.use(
    async function (config: any) {
      if (getToken()) {
        const token = getToken();
        if (token && token.expired_time - 60 * 1000 <= Date.now()) {
          const res = (await mainStore.refreshToken(token.refresh_token).catch((e) => {
            mainStore.logout();
            returnLogin(context);
            return;
          })) as any;
          if (res) {
            config.headers.Authorization = 'Bearer ' + res?.token || '';
            config.headers['Accept-Language'] = mainStore.lang || 'en';
            if (context?.router?.currentRoute?.value?.params?.workspaceId) {
              config.headers['workspace-id'] =
                context.router.currentRoute.value.params.workspaceId;
            }
            config.headers.timezone =
              Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon';
            return instance(config);
          }
        }
        if (token) {
          config.headers.Authorization = 'Bearer ' + token?.token || '';
          if (context?.router?.currentRoute?.value?.params?.workspaceId) {
            config.headers['workspace-id'] =
              context.router.currentRoute.value.params.workspaceId;
          }
          config.headers['Accept-Language'] = mainStore.lang || 'en';
          config.headers.timezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon';
        }
        return config;
      } else {
        mainStore.logout();
        returnLogin(context);
        return;
      }
    },
    function (err: any) {
      return Promise.reject(err);
    },
  );
}

function configResponse(instance: any, context: any) {
  const mainStore = useMainStore(context.store);
  instance.interceptors.response.use(
    (response: any) => {
      if (
        response.data.status_code === 401 &&
        context.router.currentRoute.value.name !== 'login'
      ) {
        mainStore.logout();
        returnLogin(context);
      }
      if (response?.data?.status_code === 421) {
        context.router.push({
          name: 'list-workspace',
        });
      }
      return response.data as any;
    },
    (error: any) => {
      if (error.response) {
        if (
          (error.response.status === 401 || error.response.status === 403) &&
          !window.location.pathname.includes('login')
        ) {
          mainStore.logout();
          returnLogin(context);
        }
        const errorData = error.response.data;
        return Promise.reject({
          ...errorData,
        });
      }
    },
  );
}

export default {
  configRequest,
  configResponse,
  configRequestNoAuth,
};

// Thành công:
// {
//   "data": {},
//   "message" : "", -> tự xử lý FE. mapping theo file message. -> Phương sẽ xử lý
//   "status_code": 200 -> thành công
// }
//
// Thất bại:
// {
//   "errors" : {
//
//   "username" : "Username error",
//     ""
// }, -> form, query nhiều trường.
//   "status_code": 406 (!=  200),
//   "message": ""
// }
