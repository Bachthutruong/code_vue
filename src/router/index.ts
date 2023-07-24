import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router';

import routes from './routes';
import { getToken, returnLogin } from 'src/helper/auth';
import { useMainStore } from 'stores/main';
import { RoleUSer } from 'src/constants/ConstantUser';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ({ store, ssrContext }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    // history: createHistory(process.env.VUE_ROUTER_BASE),
    history: createHistory(process.env.VUE_ROUTER_BASE),
    // history: createWebHistory(),
  });

  Router.beforeEach(
    async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      const mainStore = useMainStore(store);
      const accessToken = getToken();

      let infoUser = mainStore.getUser || null;
      let roleUser = mainStore.getRole || (RoleUSer['USER'] as string);

      if (!!accessToken && !infoUser) {
        infoUser = await mainStore.getInfoUser();
        if (!!infoUser) {
          roleUser = mainStore.getRole;
        }
      }
      console.log('roleUser', roleUser);
      console.log('to.meta?.role', to.meta?.role);
      if (to.meta.requireAuth && !accessToken) {
        // next({ name: 'login' })
        returnLogin({ router: Router, urlPath: to.fullPath });
      } else if (to.name == 'login' && accessToken) {
        next({ name: 'home' });
      } else {
        next();
      }
    },
  );
  return Router;
});
