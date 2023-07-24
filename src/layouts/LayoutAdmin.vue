<template>
  <div class="table">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';

import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';

export default defineComponent({
  name: 'LayoutAdmin',
  components: {},
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

    const getDetailWorkspace = () => {
      if (!route?.params?.workspaceId) {
        router.push({ name: 'home' });
      }
      workspaceStore.getAllWorkspaceOwned();
      workspaceStore
        .getDetailWorkspace()
        .then((res: any) => {
          if (res.owner.id !== infoUser.value.id) {
            router.push({ name: 'home' });
          }
        })
        .catch((err) => {
          if (err.status_code === 404 && err.status_code === 406) {
            router.push({
              name: 'home',
            });
          }
        });
    };

    // getDetailWorkspace();
    // watch(route, () => {
    //   if (
    //     route?.params?.workspaceId &&
    //     Number(route?.params?.workspaceId) !== detailWorkspace?.value?.id
    //   ) {
    //     getDetailWorkspace();
    //   }
    // });
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

    return {
      // ...toRefs(state),
      detailWorkspace,
      infoUser,
      signOutWorkspace,
    };
  },
});
</script>

<style scoped lang="scss">
.table {
  .table-header {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8f8f8;

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

  .table-filter {
    justify-content: space-between;
    padding: 20px 32px 0;

    .header-text {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      padding-bottom: 20px;
    }

    .choose-date {
      padding-left: 16px;
      min-width: 376px;

      .q-icon {
        font-size: 16px;
        color: #878b87;
      }

      .block {
        font-size: 14px;
        line-height: 20px;
        color: #565656;
        text-transform: none;
        padding-right: 37px;
      }
    }

    .search-name {
      width: 400px;
    }
  }
}
</style>
