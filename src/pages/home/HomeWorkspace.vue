<template>
  <div class="create-content">
    <div class="create-background column items-center">
      <div class="create-top">
        <div class="create-head">
          <div class="create-img text-center">
            <img
              alt="logo"
              src="/logo-beta.svg"
            />
          </div>
          <div class="create-change">
            <div class="change-content">
              {{ $t('workspace.workspace.confirm') }}
              <span>{{ infoUser?.email || '' }}. </span>
              {{ $t('workspace.workspace.useAccount') }}
              <a
                href="javascript:void(0)"
                @click="showModalSwitchAccount"
                >{{ $t('workspace.workspace.switch') }}</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="workspace-banner">
        <q-page-container class="row">
          <div class="box-left col-6">
            <div class="box-left__title">
              <span>{{ $t('workspace.workspace.banner.create') }}</span>
            </div>

            <div class="box-left__short q-pt-md q-pb-xl">
              <span>
                {{ $t('workspace.workspace.banner.tmessDesc') }}
              </span>
            </div>

            <div class="box-left__btn">
              <q-btn
                @click="$router.push({ name: 'create-workspace' })"
                class="block-btn"
                >{{ $t('workspace.workspace.banner.btnCreate') }}</q-btn
              >
            </div>

            <div class="box-left__desc">
              <span>{{ $t('workspace.workspace.banner.btnDesc') }}</span>
            </div>
          </div>

          <div class="box-right col-6">
            <img
              src="~assets/create-workspace.svg"
              alt="#"
              class="img-cover"
            />
          </div>
        </q-page-container>
      </div>
      <div
        v-show="getAllWorkspace?.length"
        class="divider text-center"
      >
        <span>{{ $t('workspace.workspace.or') }}</span>
      </div>
    </div>

    <div
      v-show="getAllWorkspace?.length"
      class="list-workspace"
    >
      <div class="open-list">{{ $t('workspace.workspace.open') }}</div>
      <ListRoom class="list-room" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import ListRoom from 'src/components/general/ListRoom.vue';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    ListRoom,
  },
  setup() {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const workspaceStore = useWorkspaceStore();

    const getAllWorkspace = computed(() => {
      const getListWorkspace = workspaceStore.getListWorkspace;
      const listWorkspaceInvites = workspaceStore.listWorkspaceInvites.map(
        (item: any) => {
          return {
            ...item.workspace,
            type: 'INVITE',
            infoInvite: {
              code: item.code,
              id: item.id,
            },
          };
        },
      );
      return [...listWorkspaceInvites, ...getListWorkspace];
    });

    const router = useRouter();
    const changeLogin = () => {
      mainStore.logout();
      router.push({
        name: 'login',
      });
    };
    const showModalSwitchAccount = () => {
      workspaceStore.showModalSwitchAccount(true);
    };
    return {
      ListRoom,
      infoUser,
      getAllWorkspace,
      changeLogin,
      showModalSwitchAccount,
    };
  },
});
</script>

<style scoped lang="scss">
.column {
  width: auto;
  height: 756px;
}

.create-background {
  background-color: #fffcf9;
}
.create-top {
  padding-top: 85px;

  .create-head {
    .create-img {
      padding-bottom: 24px;
      img {
        width: 64px;
        height: 64px;
      }
    }

    .create-change {
      background-color: #e7f6e9;
      border-radius: 100px;

      .change-content {
        font-size: 14px;
        padding: 8px 16px;
        color: #000;
        span {
          font-weight: 500;
          //padding-right: 24px;
        }
        a {
          text-decoration: none;
          color: #1c8c44;
        }

        a:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.workspace-banner {
  width: 903px;
  padding-top: 80px;
  .box-left {
    padding: 24px 15.5px 24px 0;

    &__title {
      font-style: normal;
      font-weight: 600;
      font-size: 40px;
      line-height: 50px;
      span {
        color: #3c3c3c;
      }
    }

    &__short {
      font-style: normal;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      span {
        color: #2f2f2f;
      }
    }
    &__btn {
      :deep(.q-btn) {
        height: 48px;
        width: 100%;
        background-color: #1c8c44;
        color: #ffffff;
        font-weight: 500;
        font-size: 16px;
        text-transform: none;
      }
    }

    &__desc {
      padding-top: 12px;
      span {
        color: #878b87;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }

  .box-right {
    padding-left: 15.5px;
    .img-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.divider {
  position: relative;
  width: 437px;
  top: 53px;

  &:before {
    content: '';
    width: 100%;
    height: 1px;
    background: #d3d3d3;
    position: absolute;
    top: 50%;
    left: 0;
  }

  span {
    position: relative;
    display: inline-block;
    padding: 0 7px;
    background: #fff;
    font-size: 16px;
    color: #565656;
  }
}

.list-workspace {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .open-list {
    padding: 28px 0 30px;
    font-size: 20px;
    font-weight: 500;
  }

  .list-room {
    :deep(.list-item) {
      width: 923px;
    }
  }
}
</style>
