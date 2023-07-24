<template>
  <q-layout view="hHr LpR lfr">
    <q-header>
      <q-toolbar class="top-bar">
        <div class="header-left cursor-pointer">
          <CAvatar
            size="32px"
            :avatar="detailWorkspace?.avatar?.url"
            :text="detailWorkspace?.name?.split('')[0] || ''"
          />
          <span class="header-truncate text-truncate"
            >{{ detailWorkspace?.name || '' }}
          </span>
          <q-icon
            name="bi-caret-down-fill"
            size="16px"
          ></q-icon>
          <menuWorkspace class="menu-workspace" />
        </div>
        <div class="header-right">
          <div class="back-ws flex items-center">
            <q-icon
              name="bi-grid"
              size="16px"
            />
            <span
              class="back-tows"
              @click="signOutWorkspace"
              >{{ $t('workspace.layout.backWorkspace') }}</span
            >
          </div>
          <div class="header-user flex items-center">
            <CAvatar
              size="32px"
              @click="showDrawerRightProfile"
              :avatar="infoUser?.avatar?.url"
              :text="
                infoUser?.full_name?.split('')[0] || infoUser?.email?.split('')[0] || ''
              "
            />
            <span class="user-name">{{ infoUser?.full_name || '' }}</span>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <div class="relative-position">
        <router-view />
        <q-inner-loading :showing="loadingPage">
          <q-spinner-facebook
            color="green"
            size="2rem"
          />
        </q-inner-loading>
      </div>
    </q-page-container>
    <CDrawer />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, computed, watch, defineAsyncComponent } from 'vue';

import menuWorkspace from 'components/layouts/menuWorkspace.vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';
import { RoleWs } from 'src/constants/ConstantUser';

export default defineComponent({
  name: 'LayoutDashboard',
  components: {
    menuWorkspace,
    CDrawer: defineAsyncComponent(() => import('components/common/CDrawer.vue')),
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();

    const workspaceStore = useWorkspaceStore();

    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const loadingPage = computed(() => mainStore.loadingPage);

    const getDetailWorkspace = () => {
      if (!route?.params?.workspaceId) {
        router.push({ name: 'home' });
      }
      workspaceStore.getAllWorkspaceOwned();
      workspaceStore
        .getDetailWorkspace()
        .then((res: any) => {
          if (![RoleWs['OWNER'], RoleWs['ADMIN']].includes(res.role)) {
            router.push({ name: 'home' });
          }
        })
        .catch((err) => {
          if (err.status_code === 404 || err.status_code === 406) {
            router.push({
              name: 'home',
            });
          }
        });
    };

    getDetailWorkspace();
    watch(route, () => {
      if (
        route?.params?.workspaceId &&
        Number(route?.params?.workspaceId) !== detailWorkspace?.value?.id
      ) {
        getDetailWorkspace();
      }
    });
    // const state = reactive<{
    // }>({
    // });
    const signOutWorkspace = () => {
      router.push({
        name: 'workspace-detail',
        params: {
          workspaceId: detailWorkspace?.value?.id,
        },
      });
    };

    const showDrawerRightProfile = () => {
      workspaceStore.showDrawerRightProfile(true);
      workspaceStore.setDrawerRightProfileValue(infoUser.value);
    };
    return {
      // ...toRefs(state),
      loadingPage,
      detailWorkspace,
      infoUser,
      signOutWorkspace,
      showDrawerRightProfile,
    };
  },
});
</script>

<style scoped lang="scss">
.top-bar {
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  color: #2f2f2f;
  .header-left {
    padding-left: 32px;

    .header-truncate {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      padding: 0 8px;
    }

    i {
      margin-bottom: 2px;
    }
  }

  .header-right {
    display: flex;
    padding-right: 32px;

    .back-ws {
      padding: 8px;
      margin-right: 16px;
      cursor: pointer;

      i {
        margin-right: 6px;
        margin-bottom: 2px;
      }

      span {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #565656;
      }
    }

    .header-user {
      .user-name {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #2f2f2f;
      }
    }
  }
}
</style>
