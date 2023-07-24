<template>
  <div class="h-100">
    <HeaderUnreadTask
      title="workspace.comment.title"
      :hasMark="false"
    >
      <template
        v-if="listTask?.length > 0"
        #filter-right
      >
        <c-btn
          label="Mark all as read"
          color="black"
          icon="bi-eye"
          flat
          @click="markAsRead()"
        />
      </template>
    </HeaderUnreadTask>
    <div class="body-task">
      <div class="body-task-list">
        <div
          id="dataTask"
          class="data-task"
          ref="scrollTargetRef"
        >
          <noData v-if="!listTask.length"></noData>
          <q-infinite-scroll
            @load="onLoad"
            :offset="120"
            :scroll-target="scrollTargetRef"
          >
            <CardStatus
              v-for="(cardItem, index) in listTask"
              :key="index"
              :id="`task#${index}`"
              class="cursor-pointer"
              hidden-menu
              :formStatus="cardItem"
              @click="cardItem.action"
            >
              <template #card-top="{ typeNotify }">
                <div class="title-top flex items-center">
                  <div
                    v-if="!cardItem?.other?.is_read"
                    class="icon-dot"
                  ></div>
                  <p class="text-body-bold q-mb-none">
                    {{
                      cardItem?.channel?.type === 'ONE_TO_ONE' ? 'One to one' : 'Channel'
                    }}:
                  </p>
                  <span
                    >{{ cardItem?.channel?.type === 'ONE_TO_ONE' ? '' : '#' }}
                    {{ cardItem?.channel?.name }}</span
                  >
                  <div class="dot"></div>
                  <template v-if="typeNotify === 'chat'">
                    <q-icon
                      class="icon-notify"
                      name="bi-chat-left-dots"
                      size="16px"
                    ></q-icon>
                    <span class="text-notify">{{ $t('workspace.notify.chat') }}</span>
                  </template>
                  <template v-if="typeNotify === 'task'">
                    <q-icon
                      class="icon-notify"
                      name="bi-card-list"
                      size="16px"
                    ></q-icon>
                    <span class="text-notify">{{ $t('workspace.notify.task') }}</span>
                  </template>
                  <template v-if="typeNotify === 'wiki'">
                    <q-icon
                      class="icon-notify"
                      name="bi-calendar3-week"
                      size="16px"
                    ></q-icon>
                    <span class="text-notify">{{ $t('workspace.notify.wiki') }}</span>
                  </template>
                </div>
              </template>
            </CardStatus>
            <template v-slot:loading>
              <div class="row justify-center q-my-md">
                <q-spinner-dots
                  color="primary"
                  size="40px"
                />
              </div>
            </template>
          </q-infinite-scroll>

          <!--    <div class="box-fixed">-->
          <!--      <div class="box-fixed-scroll">-->
          <!--        <c-btn-->
          <!--          color="primary"-->
          <!--          class="box-fixed__btn"-->
          <!--          outline-->
          <!--          size="small"-->
          <!--          @click="actionScroll"-->
          <!--        >-->
          <!--          <template #default>-->
          <!--            <q-icon-->
          <!--              size="16px"-->
          <!--              class="box-fixed__icon"-->
          <!--              name="bi-chevron-double-down"-->
          <!--            />-->
          <!--          </template>-->
          <!--        </c-btn>-->
          <!--      </div>-->
          <!--    </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, toRefs, ref, computed } from 'vue';

import HeaderUnreadTask from 'src/components/unread/HeaderUnreadTask.vue';
import noData from 'components/general/noData.vue';
import {
  useRoute,
  // useRouter
} from 'vue-router';
import { paramsNotify } from 'src/services/notify/model';

import NotifyServices from 'src/plugins/NotifyServices';
import { TaskStatusType } from 'src/interface/cardChannel';
import { formStatus } from 'src/interface/comment';
import { notifyType } from 'src/constants/ConstantNotify';
import NotifyApiService from 'src/services/notify';
import { useI18n } from 'vue-i18n';
import CardStatus from 'components/common/CardStatus.vue';
import { redirectNotify } from 'src/constants/ConstantNotify';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';

export default defineComponent({
  name: 'commentPage',
  components: {
    CardStatus,
    noData,
    HeaderUnreadTask,
  },
  setup() {
    const route = useRoute();
    // const router = useRouter();
    const { t } = useI18n();
    const refTaskChannel = ref();
    const workSpaceStore = useWorkspaceStore();
    const mainStore = useMainStore();

    const state = reactive<{
      loading: boolean;
      listTask: Array<formStatus>;
      taskStatus: any;
      filter: paramsNotify;
      total: number;
    }>({
      loading: false,
      listTask: [],
      taskStatus: TaskStatusType,
      filter: {
        order_by: 'DESC',
        sort_by: 'id',
        page: 1,
        page_size: 12,
        workspace_id: Number(route?.params?.workspaceId),
      },
      total: 0,
    });

    const IsLoadNotify = computed(() => {
      return workSpaceStore.IsLoadNotify;
    });
    const getChannelDetail = () => {
      getAllTaskChannel();
    };

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        getChannelDetail();
      }
    });
    const refactorItem = (item: any) => {
      let comment = item?.comment || item?.comment_wiki || null;
      const actor = item.actor;
      const contentStatus = [
        notifyType['MARK_DONE_TASK'],
        notifyType['MARK_CANCEL_TASK'],
        notifyType['NEW_COMMENT'],
      ].includes(item.type)
        ? item.task.content
        : item?.content;
      console.log('comment', comment);
      let dataTask: formStatus = {
        id: item.id,
        other: item,
        channel: item?.channel,
        type: item?.type,
        status: {
          user: {
            name: actor?.full_name || actor?.email || '',
            avatar: actor?.avatar?.url,
          },
          content: contentStatus || '',
        },
        comment: {
          user: {
            name: comment?.user?.full_name || comment?.user?.email || '',
            avatar: comment?.user?.avatar?.url || '',
          },
          content: comment?.content || '',
        },
        dateComment: item?.type !== notifyType['REMINDER_TASK'] ? item?.created_at : '',
        action: () => {
          window &&
            window.open(
              redirectNotify({
                data: {
                  type: item?.type || '',
                  channel_type: item?.channel?.type || '',
                  workspace_id: route.params.workspaceId,
                  channel_id: item?.channel?.id || '',
                  task_id: item?.task?.id || '',
                  comment_id: comment?.id || '',
                  wiki_id: item?.wiki?.id || '',
                  chat_id: item?.chat?.id || '',
                },
              }),
              '_blank',
            );
          mainStore.actionReloadAllPage();
          item.is_read = true;
          markAsReadNotify(item.session_id);
        },
      };
      if (
        [notifyType['REPLY_COMMENT'], notifyType['REPLY_COMMENT_WIKI']].includes(
          item.type,
        )
      ) {
        const commentParent = comment?.parent;
        dataTask = {
          ...dataTask,
          comment: {
            ...dataTask.comment,
            parent: {
              content: commentParent?.content || '',
              user: {
                name: commentParent?.user?.full_name || commentParent?.user?.email || '',
                avatar: commentParent?.user?.avatar?.url || '',
              },
            },
          },
        };
      }
      return dataTask;
    };

    const getAllTaskChannel = () => {
      mainStore.loadingPage = true;

      const paramsBody: paramsNotify = {
        ...state.filter,
        page: 1,
        page_size: state.filter?.page_size || 12,
        workspace_id: Number(route?.params?.workspaceId),
      };
      return new Promise((resolve, reject) => {
        NotifyApiService.findAllNotify(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data;
              state.listTask = [];
              state.total = responsive?.total || 0;
              responsive.data.map((item: any) => {
                state.listTask.push(refactorItem(item));
              });
              workSpaceStore.IsLoadNotify = false;
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
            }
          })
          .catch((err) => {
            console.log('err', err);
            NotifyServices.showMessageError(`${err}`);
            reject(false);
          })
          .finally(() => {
            state.loading = false;
            mainStore.loadingPage = false;
            workSpaceStore.IsLoadNotify = false;
          });
      });
    };
    getChannelDetail();
    const onLoad = async (index: number, done: any) => {
      if (state.loading || state.total === state.listTask.length) {
        done();
        return;
      }

      state.loading = true;
      state.filter = {
        ...state.filter,
        page_size: (state.filter?.page_size || 12) + 6,
      };
      await getAllTaskChannel()
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          done();
        });
    };

    const scrollToBottom = (id: string) => {
      const element = document.getElementById(id) as any;
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };

    const actionScroll = () => {
      state.filter = {
        ...state.filter,
        page_size: state.total + 1,
      };
      getAllTaskChannel().then(() => {
        scrollToBottom(`task#${state.total - 1}`);
      });
    };

    const markAsReadNotify = (session_id: string) => {
      workSpaceStore.readNotify(`${route?.params?.workspaceId}`, session_id);
    };

    const markAsRead = () => {
      NotifyApiService.readAll(Number(route?.params?.workspaceId))
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.comment.notify.markAsReadSuccess'),
            );
            mainStore.actionReloadSideBar();
            getAllTaskChannel();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.comment.notify.markAsReadSuccess'),
          );
        });
    };

    watch(route, () => {
      if (route?.params?.channelId && route?.params?.workspaceId) {
        getChannelDetail();
      }
    });
    watch(IsLoadNotify, () => {
      if (IsLoadNotify.value) {
        getAllTaskChannel();
      }
    });

    const scrollTargetRef = ref();
    return {
      ...toRefs(state),
      refTaskChannel,
      scrollTargetRef,
      onLoad,
      getAllTaskChannel,
      scrollToBottom,
      actionScroll,
      // popup
      markAsRead,
    };
  },
});
</script>

<style lang="scss" scoped>
.tab-list {
  margin-top: 5px;

  .q-tabs {
    padding: 0 32px;

    .q-tab {
      padding: 0;
      margin-right: 24px;
    }
  }
}

.q-infinite-scroll {
  div {
    &:first-child {
      padding-top: 0;
    }
  }
}

#dataTask {
  height: 100%;
  max-height: 100%;
  overflow-anchor: none;
  margin-top: auto;
  display: flex;
  flex-direction: column;

  .q-infinite-scroll {
    width: 100%;
    overflow-anchor: auto;
  }
}

.body-task {
  &-list {
    padding-top: 16px;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;

    &.body-welcome-channel {
      padding-top: 0;
    }
  }
}

.title-top {
  margin-bottom: 5px;
  color: #565656;
  font-weight: 500;

  .icon-dot {
    margin-right: 4px;
  }

  span {
    color: #1c8c44;
    margin-left: 5px;
  }
  .text-notify {
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
    color: #565656;
  }
  .icon-notify {
    margin-right: 4px;
    color: #3c3c3c;
  }
}

.box-fixed {
  position: fixed;
  right: 32px;
  bottom: 40px;
  z-index: 10;

  &-button {
    margin-bottom: 24px;
  }

  &-scroll {
    display: flex;
    justify-content: flex-end;
  }

  .box-fixed__btn {
    width: 32px;
    border-radius: 8px;
    background: #e7f6e9 !important;
  }

  .box-fixed__icon {
    color: #1c8c44;
  }
}

.dot {
  width: 6px;
  height: 6px;
  background: #565656;
  margin: 0 8px;
  border-radius: 50%;
}
</style>

<!--<style scoped></style>-->
