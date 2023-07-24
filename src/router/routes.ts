import { RouteRecordRaw } from 'vue-router';
import routesWorkspace from 'src/router/workspace';
import { RoleUSer } from 'src/constants/ConstantUser';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: {
      name: 'home-workspace',
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'home-workspace',
        component: () => import('pages/home/HomeWorkspace.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: '/components',
        name: 'components',
        component: () => import('pages/ComponentsPage.vue'),
      },
    ],
  },
  {
    path: '/workspace/:workspaceId/invite',
    component: () => import('layouts/MainSecond.vue'),
    children: [
      {
        path: '',
        name: 'invite',
        component: () => import('pages/home/InviteWs.vue'),
        meta: {
          requireAuth: false,
        },
      },
    ],
  },
  {
    path: '/preview',
    redirect: {
      name: 'create-workspace',
    },
    component: () => import('layouts/MainSecond.vue'),
    children: [
      {
        path: 'create-workspace',
        name: 'create-workspace',
        component: () => import('pages/home/CreateWorkspace.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'list-workspace',
        name: 'list-workspace',
        component: () => import('pages/home/ListWorkSpace.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: '/auth',
    redirect: {
      name: 'login',
    },
    component: () => import('layouts/LayoutLogin.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('src/pages/auth/LoginHome.vue'),
      },
      {
        path: 'create-account',
        name: 'create-account',
        component: () => import('src/pages/auth/CreateAccount.vue'),
      },
      {
        path: 'verify',
        name: 'verify',
        component: () => import('src/pages/auth/VerifyLogin.vue'),
      },
    ],
  },
  ...routesWorkspace,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
  {
    path: '/workspace/:workspaceId/dashboard',
    name: 'admin',
    redirect: {
      name: 'dashboard',
    },
    component: () => import('layouts/LayoutDashboard.vue'),
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () =>
          import('src/pages/workspace/_workspaceId/admin/adminDashboard.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: ':memberId/statistic',
        name: 'statistic',
        component: () => import('src/pages/workspace/_workspaceId/admin/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
  {
    path: '/admin',
    name: 'adminOwner',
    redirect: {
      name: 'owned',
    },
    component: () => import('layouts/LayoutAdmin.vue'),
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: 'owned',
        name: 'owned',
        component: () => import('src/pages/workspace/_workspaceId/admin/ownedWeb.vue'),
        meta: {
          requireAuth: true,
          role: RoleUSer['ADMIN'],
        },
      },
    ],
  },
  {
    path: '/workspace/:workspaceId/search',
    redirect: {
      name: 'searchAll',
    },
    component: () => import('layouts/LayoutWorkSpace.vue'),
    children: [
      {
        path: '',
        name: 'searchAll',
        component: () => import('pages/workspace/_workspaceId/searchAll.vue'),
        meta: {
          requireAuth: true,
        },
      },
    ],
  },
];

export default routes;
