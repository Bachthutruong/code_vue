import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import interceptors from 'src/core/api/interceptors';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://54.169.186.147',
});

const axiosNoAuth = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://54.169.186.147',
});

export default boot(({ app, router, redirect, store, urlPath }) => {
  const context = { app, router, redirect, store, urlPath };
  // for use inside Vue files (Options API) through this.$axios and this.$api
  // interceptors.configRequest(axios, context);
  interceptors.configRequestNoAuth(axiosNoAuth, context);
  interceptors.configResponse(axiosNoAuth, context);

  app.config.globalProperties.$axios = axiosNoAuth;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file
  interceptors.configRequest(api, context);
  interceptors.configResponse(api, context);
  // api.interceptors.request.use(async function (config: any) {
  //   config.headers.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Saigon';
  // })
  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, axiosNoAuth };
