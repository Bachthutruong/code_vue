<template>
  <div
    class="review-ctrl column items-center justify-center"
    id="invitePage"
  >
    <div class="review-top">
      <img
        alt="logo"
        src="/logo-beta.svg"
      />
    </div>

    <div class="review-bottom items-center">
      <div class="review-title text-center">
        {{ $t('workspace.workspace.invite.welcome') }}
        <span>{{ detailWorkspace?.name || '' }}</span>
      </div>
      <div class="review-desc">{{ $t('workspace.workspace.invite.invited') }}</div>
      <div class="review-avatar">
        <CAvatar
          size="128px"
          :avatar="detailWorkspace?.thumbnail?.url"
          :text="detailWorkspace?.name.split('')[0] || ''"
        />
      </div>
      <div class="review-people">
        {{ detailWorkspace?.members?.length || 0 }}
        {{ $t('workspace.workspace.invite.joined') }}
      </div>
      <q-btn
        class="review-btn"
        :loading="loading"
        @click="joinWs"
        >{{ $t('workspace.workspace.invite.btnJoin') }}
      </q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  nextTick,
  onBeforeUnmount,
} from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';
import { useRoute, useRouter } from 'vue-router';
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import { useI18n } from 'vue-i18n';
import { getToken, returnLogin } from 'src/helper/auth';

export default defineComponent({
  name: 'ReviewProject',
  setup() {
    const state = reactive<{
      loading: boolean;
    }>({
      loading: false,
    });
    const workspaceStore = useWorkspaceStore();
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const getDetailWorkspace = () => {
      if (!route?.params?.workspaceId) return;
      workspaceStore.getDetailWorkspace(true);
    };
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    getDetailWorkspace();

    const joinWs = () => {
      if (!route?.query?.code) {
        return;
      }
      if (!getToken() || infoUser.value.email !== route.query.email) {
        mainStore.logout();
        returnLogin({
          router,
          urlPath: route.fullPath,
        });
        return;
      }
      state.loading = true;
      WorkspaceService.joinWorkspace({
        invite_code: `${route.query.code}`,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.joinWsSuccess'));
            router.push({
              name: 'workspace-detail',
              params: {
                workspaceId: detailWorkspace.value.id,
              },
            });
          } else if (res?.status_code === 401) {
            returnLogin({
              router,
              urlPath: route.fullPath,
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(t('workspace.notify.joinWsFailed'));
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const keyupEnter = (e: any) => {
      if (e.keyCode === 13) {
        joinWs();
      }
    };
    onMounted(() => {
      nextTick(() => {
        if (document) {
          document.addEventListener('keydown', keyupEnter);
        }
      });
    });
    onBeforeUnmount(() => {
      if (document) {
        document.removeEventListener('keydown', keyupEnter);
      }
    });
    return {
      ...toRefs(state),
      detailWorkspace,
      joinWs,
      keyupEnter,
    };
  },
});
</script>

<style scoped lang="scss">
.review-ctrl {
  height: 100vh;

  .review-top {
    padding-bottom: 48px;
  }

  .review-bottom {
    display: flex;
    flex-direction: column;

    .review-title {
      font-size: 30px;
      font-weight: 500;
      line-height: 40px;
      color: #2f2f2f;

      span {
        color: #1c8c44;
      }
    }

    .review-desc {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #878b87;
      padding-bottom: 40px;
    }

    .review-avatar {
      width: 128px;
      height: 128px;
      margin-bottom: 8px;
    }

    .review-people {
      color: #878b87;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 40px;
    }

    .review-btn {
      background-color: #1c8c44;
      color: #fff;
      border: none;
      height: 48px;
      width: 437px;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
    }
  }

  .q-btn {
    text-transform: none;
  }
}
</style>
