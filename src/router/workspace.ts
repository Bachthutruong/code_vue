import { RouteRecordRaw } from 'vue-router';

const routesWorkspace: RouteRecordRaw[] = [
  {
    path: '/workspace/:workspaceId',
    name: 'workspace',
    redirect: {
      name: 'workspace-detail',
    },
    component: () => import('layouts/LayoutWorkSpace.vue'),
    children: [
      {
        path: '',
        name: 'workspace-detail',
        component: () => import('pages/workspace/_workspaceId/index.vue'),
        meta: {
          requireAuth: true,
        },
      },
      {
        path: 'draft',
        name: 'draft',
        redirect: {
          name: 'draft-task',
          query: {
            tab: 'DRAFT',
          },
        },
        component: () =>
          import('pages/workspace/_workspaceId/draftScheduleSent/index.vue'),
        meta: {
          requireAuth: true,
          icon: 'file-earmark-spreadsheet',
          type: 'draft',
          separator: true,
          showMenu: true,
        },
        children: [
          {
            path: 'task',
            name: 'draft-task',
            component: () =>
              import('pages/workspace/_workspaceId/draftScheduleSent/task.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'task',
            },
          },
          {
            path: 'wiki',
            name: 'draft-wiki',
            component: () =>
              import('pages/workspace/_workspaceId/draftScheduleSent/wiki.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'wiki',
            },
          },
        ],
      },
      {
        path: 'people',
        name: 'people',
        component: () => import('pages/workspace/_workspaceId/people.vue'),
        meta: {
          requireAuth: true,
          title: 'People',
          icon: 'people',
          type: 'people',
          showMenu: false,
          typeChildren: 'chat',
        },
      },
      {
        path: 'chart',
        name: 'chart',
        component: () => import('pages/workspace/_workspaceId/statistic.vue'),
        meta: {
          requireAuth: true,
          icon: 'bar-chart',
          separator: true,
          type: 'statistic',
          showMenu: false,
          typeChildren: 'chat',
        },
      },
      {
        path: 'C:channelId',
        name: 'channel-detail',
        redirect: {
          name: 'channel-chat',
        },
        component: () => import('pages/workspace/_workspaceId/_channelId/index.vue'),
        meta: {
          requireAuth: true,
          icon: 'journal-richtext',
          dynamicRouter: true,
          separator: true,
          type: 'channel',
          params: 'channelId',
          showMenu: true,
        },
        children: [
          {
            path: 'chat',
            name: 'channel-chat',
            component: () => import('pages/workspace/_workspaceId/_channelId/chat.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'chat',
            },
          },
          {
            path: 'task',
            name: 'channel-task',
            component: () => import('pages/workspace/_workspaceId/_channelId/task.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'task',
            },
          },
          {
            path: 'wiki',
            name: 'channel-wiki',
            component: () => import('pages/workspace/_workspaceId/_channelId/wiki.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'wiki',
            },
          },
        ],
      },
      {
        path: 'D:channelId',
        name: 'one-to-one',
        redirect: {
          name: 'one-to-one-chat',
        },
        component: () => import('pages/workspace/_workspaceId/_oneToOneId/index.vue'),
        meta: {
          requireAuth: true,
          icon: 'person-up',
          dynamicRouter: true,
          separator: true,
          type: 'oneToOne',
          params: 'channelId',
          showMenu: true,
        },
        children: [
          {
            path: 'chat',
            name: 'one-to-one-chat',
            component: () => import('pages/workspace/_workspaceId/_oneToOneId/chat.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'chat',
            },
          },
          {
            path: 'task',
            name: 'one-to-one-task',
            component: () => import('pages/workspace/_workspaceId/_oneToOneId/task.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'task',
            },
          },
        ],
      },
      {
        path: 'notification',
        name: 'comment',
        component: () => import('pages/workspace/_workspaceId/comment.vue'),
        meta: {
          requireAuth: true,
          icon: 'bell',
          type: 'comment',
          separator: true,
          showMenu: true,
        },
      },
      {
        path: 'calendar',
        name: 'calendar',
        redirect: {
          name: 'calendar-view',
        },
        component: () => import('pages/workspace/_workspaceId/calendar/index.vue'),
        meta: {
          requireAuth: true,
          icon: 'calendar-event',
          type: 'calendar',
          showMenu: true,
        },
        children: [
          {
            path: 'view',
            name: 'calendar-view',
            component: () => import('pages/workspace/_workspaceId/calendar/calendar.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'task',
            },
          },
          {
            path: 'year',
            name: 'calendar-year',
            component: () =>
              import('pages/workspace/_workspaceId/calendar/YearCalendarPage.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'task',
            },
          },
          {
            path: 'list',
            name: 'calendar-list',
            component: () =>
              import('pages/workspace/_workspaceId/calendar/TaskCalendar.vue'),
            meta: {
              requireAuth: true,
              typeChildren: 'task',
            },
          },
        ],
      },
    ],
  },
];

export default routesWorkspace;
