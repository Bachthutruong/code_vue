<template>
  <div class="list-workspace">
    <q-list
      bordered
      separator
      class="rounded-borders"
      scroll
    >
      <q-item-label
        class="list-header"
        header
      >
        Workspace for
        <strong>{{ infoUser?.email || '' }}</strong>
      </q-item-label>

      <div class="list-item">
        <q-item
          :class="item?.is_deactive ? 'cursor-not-allowed' : ''"
          v-for="item in getAllWorkspace"
          :key="item.id"
        >
          <q-item-section
            avatar
            top
          >
            <q-avatar v-if="item?.thumbnail?.url">
              <img :src="item?.thumbnail?.url" />
            </q-avatar>
            <q-avatar
              v-else
              size="56px"
              color="purple-1"
              text-color="white"
            >
              <span class="text-uppercase">{{ item.name.split('')[0] }}</span>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1">{{ item.name }}</q-item-label>
            <q-item-label
              caption
              class="overlapping"
            >
              <template v-for="(member, index) in item.members">
                <CAvatar
                  v-if="index < 10"
                  :key="index"
                  size="24px"
                  :avatar="member?.avatar?.url"
                  :text="
                    member?.full_name?.split('')[0] || member?.email?.split('')[0] || ''
                  "
                  :style="`left: ${index * -8}px`"
                />
                <q-avatar
                  v-if="index === 10"
                  :key="index"
                  size="24px"
                  color="purple-1"
                  text-color="white"
                  :style="`left: ${index * -8}px`"
                >
                  +{{ item?.members.length - 10 }}
                </q-avatar>
                <div
                  v-if="index === item?.members.length - 1"
                  :key="index"
                  :style="`left: ${(item?.members.length > 10 ? 9 : index - 1) * -8}px`"
                  class="count-member"
                >
                  {{ item?.members.length }} people
                </div>
              </template>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              v-if="item?.type === 'INVITE'"
              outline
              :disable="loading"
              label="Join workspace"
              @click="inviteWs(item)"
            />
            <div
              v-else-if="item?.is_deactive"
              class="deactive-icon"
            >
              <img :src="emojiLocked" />
            </div>
            <q-btn
              v-else
              outline
              label="Open workspace"
              @click="joinWorkspace(item.id)"
            />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
  </div>
  <modalSwitchAccount />
</template>

<script lang="ts">
import { defineComponent, computed, ref, defineAsyncComponent } from 'vue';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import { useRoute, useRouter } from 'vue-router';
import { getToken, returnLogin } from 'src/helper/auth';
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import { useI18n } from 'vue-i18n';
import emojiLocked from 'assets/emoji/emoji_locked.svg';
export default defineComponent({
  name: 'ListWorkSpace',
  components: {
    modalSwitchAccount: defineAsyncComponent(
      () => import('components/people/modalSwitchAccount.vue'),
    ),
  },
  setup() {
    const mainStore = useMainStore();
    const workspaceStore = useWorkspaceStore();
    const loading = ref(false);
    const router = useRouter();
    const { t } = useI18n();

    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const route = useRoute();

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

    const getWorkspace = () => {
      workspaceStore.getAllWorkspace();
      workspaceStore.getAllWorkspaceInvites();
    };
    getWorkspace();
    const joinWorkspace = (id: string) => {
      router.push({
        name: 'workspace',
        params: {
          workspaceId: id,
        },
      });
    };
    const inviteWs = (item: any) => {
      if (!item?.infoInvite?.code) {
        return;
      }
      if (!getToken()) {
        returnLogin({
          router,
          urlPath: route.fullPath,
        });
        return;
      }
      loading.value = true;
      WorkspaceService.joinWorkspace({
        invite_code: `${item?.infoInvite?.code}`,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.joinWsSuccess'));
            joinWorkspace(item.id);
          } else if (res?.status_code === 401) {
            returnLogin({
              router,
              urlPath: route.fullPath,
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.notify.joinWsFailed'));
        })
        .finally(() => {
          loading.value = false;
        });
    };
    return {
      infoUser,
      getAllWorkspace,
      joinWorkspace,
      loading,
      inviteWs,
    };
  },
  data() {
    return {
      emojiLocked,
    };
  },
});
</script>

<style lang="scss" scoped>
.list-workspace {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 16px;

  .q-list {
    max-width: 906px;
  }

  .open-list {
    padding: 16px 0 46px;
    font-size: 20px;
    font-weight: 500;
  }

  .list-header {
    font-size: 16px;
    color: #2f2f2f;
    font-weight: 400;
    height: 56px;
    background: #f8f8f8;

    strong {
      font-weight: 500;
    }
  }

  .list-item {
    overflow-y: auto;
    max-height: 291px;
    max-width: 906px;
  }

  .q-list {
    .q-item {
      width: 890px;
      padding: 20px 16px;

      &:hover {
        background: #e7f6e9;

        .q-btn {
          background: #fff !important;
        }
      }

      img {
        object-fit: cover;
      }

      :deep(.q-item__section) {
        width: auto;
        height: 56px;
      }

      .q-item__label {
        font-size: 16px;
        font-weight: 500;
      }

      .q-item__section--side > .q-avatar {
        font-size: 56px;
      }

      .q-btn {
        color: #1c8c44;
        text-transform: none;
        padding: 0;
        width: 120px;

        span {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          padding: 10.5px 6px;
        }
      }

      .overlapping {
        //padding-left: 8px;
        .count-member {
          color: #878b87;
          font-weight: 400;
          font-size: 14px;
          position: relative;
          display: inline-block;
          //right: 60px;
        }
      }
    }
  }
}
.deactive-icon {
  min-width: 120px;
  display: flex;
  justify-content: center;
}
</style>
