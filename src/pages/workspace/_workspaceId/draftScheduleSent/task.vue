<template>
  <div class="tab-list">
    <q-tabs
      v-model="tab"
      @update:model-value="changeTab"
      dense
      indicator-color="primary"
      align="left"
      narrow-indicator
      class="q-tabs__custom"
    >
      <q-tab
        v-for="item in tabList"
        :key="item.value"
        :name="item.value"
        :label="item.label"
      />
    </q-tabs>
  </div>
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
      <CardChannel
        v-for="(cardItem, index) in listTask"
        :key="index"
        :id="`task#${index}`"
        hidden-menu
        :formChannelInfo="cardItem"
        @deleteTask="handleDelete(cardItem?.id)"
        @editTask="detailTask(cardItem, 'edit')"
        @detailTask="detailTask(cardItem, 'detail')"
      >
        <template #card-top>
          <div class="title-top flex items-center">
            <p class="text-body-bold q-mb-none">
              {{ cardItem?.channel?.type === 'ONE_TO_ONE' ? 'One to one' : 'Channel' }}:
            </p>
            <span
              >{{ cardItem?.channel?.type === 'ONE_TO_ONE' ? '' : '#' }}
              {{ cardItem?.channel?.name }}</span
            >
          </div>
        </template>
      </CardChannel>
      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>

    <div class="box-fixed">
      <TabFixedChannel />
      <div class="box-fixed-scroll">
        <c-btn
          v-if="checkPositionView != 'top'"
          color="primary"
          class="box-fixed__btn"
          outline
          size="small"
          @click="actionScroll"
        >
          <template #default>
            <q-icon
              size="16px"
              class="box-fixed__icon"
              name="bi-chevron-double-up"
            />
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              class="tool-tip bg-green-1"
              max-width="400px"
              max-height="36px"
            >
              <span class="item-title">{{ $t('workspace.channel.toolTip.top') }}</span>
            </q-tooltip>
          </template>
        </c-btn>
      </div>
    </div>
  </div>
  <CConfirm
    v-model="showPopup"
    :title="infoPopup?.title"
    :sub-title="infoPopup?.subTitle"
    :textOk="infoPopup?.textOk"
    :textCancel="infoPopup?.textCancel"
    @onOk="infoPopup?.onOk"
    @close="infoPopup?.close"
  />
  <modalTaskChannelDraft
    v-if="tab !== 'SENT'"
    ref="refTaskChannelDraft"
    @reload="getAllTaskChannel()"
  />
  <modalTaskChannel
    v-if="tab === 'SENT'"
    ref="refTaskChannel"
    @reload="getAllTaskChannel()"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, watch, toRefs, ref, computed, onMounted } from 'vue';

import noData from 'components/general/noData.vue';
import { useChannelStore } from 'stores/channel';
import { useRoute, useRouter } from 'vue-router';
import { paramsTask } from 'src/services/task/model';
import CardChannel from 'components/common/CardChannel.vue';
import NotifyServices from 'src/plugins/NotifyServices';
import { formChannel, TaskStatusType } from 'src/interface/cardChannel';
import {
  capitalizeFirstLetter,
  checkDue,
  convertArrayToString,
  formatDateDisplay,
  showCheckDue,
} from 'src/helper/global';
import TaskService from 'src/services/task';
import { useI18n } from 'vue-i18n';
import modalTaskChannelDraft from 'components/draft/modalTaskChannelDraft.vue';
import modalTaskChannel from 'components/channel/modalTaskChannel.vue';
import { useMainStore } from 'stores/main';
import { listRepeat, typeRepeat } from 'src/constants/ConstantTask';
import TabFixedChannel from 'components/channel/TabFixedChannel.vue';

export default defineComponent({
  name: 'draftTaskPage',
  components: {
    TabFixedChannel,
    CardChannel,
    noData,
    modalTaskChannelDraft,
    modalTaskChannel,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const refTaskChannelDraft = ref();
    const refTaskChannel = ref();

    const state = reactive<{
      loading: boolean;
      loadingPopup: boolean;
      showPopup: boolean;
      IsFilter: boolean;
      listTask: Array<formChannel>;
      taskStatus: any;
      filter?: paramsTask;
      total: number;
      infoPopup: any;
      tab: string;
      tabList: Array<{ label: string; value: string }>;
      deleteId: number[];
    }>({
      loading: false,
      loadingPopup: false,
      showPopup: false,
      listTask: [],
      taskStatus: TaskStatusType,
      filter: {
        page: 1,
        page_size: 12,
        workspace_id: Number(route?.params?.workspaceId),
        status: undefined,
        is_flag: undefined,
        priority: undefined,
        // order_by: 'ASC',
        // sort_by: 'id',
      },
      total: 0,
      infoPopup: null,
      IsFilter: false,
      tab: 'DRAFT',
      tabList: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Schedule', value: 'SCHEDULE' },
        { label: 'Sent', value: 'SENT' },
      ],
      deleteId: [],
    });

    const channelStore = useChannelStore();
    const getChannelDetail = () => {
      if (route?.query?.tab) {
        state.tab = `${route?.query?.tab}`;
      }
      getAllTaskChannel();
    };
    const handleDelete = (id?: number) => {
      state.deleteId = id ? [id] : [];
      state.showPopup = true;
      if (state.tab === 'DRAFT') {
        state.infoPopup = {
          title: t('workspace.draft.popupConfirm.draft.title'),
          subTitle: t('workspace.draft.popupConfirm.draft.subTitle'),
          textOk: t('workspace.draft.popupConfirm.textOk'),
          textCancel: t('workspace.draft.popupConfirm.textCancel'),
          onOk: () => deleteDraft(),
          close: () => closeModal(),
        };
      }
      if (state.tab === 'SCHEDULE') {
        state.infoPopup = {
          title: t('workspace.draft.popupConfirm.schedule.title'),
          subTitle: t('workspace.draft.popupConfirm.schedule.subTitle'),
          textOk: t('workspace.draft.popupConfirm.textOk'),
          textCancel: t('workspace.draft.popupConfirm.textCancel'),
          onOk: () => deleteScheduled(),
          close: () => closeModal(),
        };
      }
    };
    const checkPositionView = ref('flexible');
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const getAllTaskChannel = () => {
      mainStore.loadingPage = true;
      state.deleteId = [];
      const paramsBody: paramsTask = {
        ...state.filter,
        tab: state.tab,
        page: 1,
        page_size: state.filter?.page_size || 12,
        workspace_id: Number(route?.params?.workspaceId),
      };
      if (typeof paramsBody?.is_flag !== 'boolean') {
        delete paramsBody?.is_flag;
      }
      return new Promise((resolve, reject) => {
        TaskService.getAllTask(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data;
              state.listTask = [];
              state.total = responsive?.total || 0;
              responsive.data.map((item: any) => {
                const status =
                  state.tab === 'SENT' ? item.status?.[0]?.type : state.tab || 'INDUE';
                const statusSent =
                  item?.creator?.id === infoUser?.value?.id ? 'sent' : 'received';
                let dateTime = '';
                if (state.tab === 'DRAFT') {
                  dateTime = item.created_at;
                } else if (state.tab === 'SCHEDULE') {
                  dateTime = item.scheduled_at;
                } else {
                  dateTime = item.released_at;
                }
                let dataTask: formChannel = {
                  id: item.id,
                  statusBackground: ['DRAFT', 'SCHEDULE'].includes(state.tab)
                    ? state.taskStatus[status]
                    : state.taskStatus[statusSent],
                  statusTask: status,
                  radio: '',
                  date: {
                    status: ['DRAFT', 'SCHEDULE'].includes(state.tab)
                      ? status.toLowerCase()
                      : statusSent,
                    time: dateTime,
                  },
                  content: item.content || '',
                  due: {
                    status: checkDue(item.due_at, 'minutes') > 0 ? 'due' : 'overdue',
                    date: showCheckDue(item.due_at),
                  },
                  creator: {
                    email: item?.creator?.email || '',
                    full_name: item?.creator?.full_name || '',
                    avatar: item?.creator?.avatar?.url || '',
                    name: item.creator.full_name || item.creator.email || '',
                  },
                  priority: capitalizeFirstLetter(item.priority),
                  attachment: convertArrayToString(item.attachments, 'originalname'),
                  markDone: item.mark_done_count || 0,
                  comment: item.comment_count || 0,
                  flag: item.flags?.[0]?.is_flag || false,
                  reads: item.read_count === item.member_count || false,
                  updated: item?.status?.[0]?.updated_at,
                  due_time: item?.due_at,
                  is_read: item?.reads?.[0]?.is_read || false,
                  is_mute: item?.mute_comments?.[0]?.is_mute || false,
                  can_mark: item?.can_mark || false,
                  type: item.type || '',
                  other: item,
                  can_access: item?.can_access || false,
                  attachments: item?.attachments?.length || '',
                  channel: item.channel,
                  repeat: item?.repeat || undefined,
                };

                // if (dataTask?.date?.status === 'sent') {
                //   dataTask.creator = {
                //     ...item.creator,
                //     name: item.creator.full_name || item.email || '',
                //   };
                // }
                if (dataTask?.repeat) {
                  const repeatLabelType = listRepeat.find(
                    (itemRepeat: typeRepeat) =>
                      itemRepeat.type === dataTask?.repeat?.type,
                  )?.label as string;
                  let repeatContent = `${t(
                    'workspace.channel.repeat',
                  )} ${repeatLabelType.toLowerCase()}`;
                  if (dataTask?.repeat?.end_at) {
                    repeatContent = `${repeatContent} ${t('workspace.draft.repeat.until')}
                    ${formatDateDisplay(dataTask?.repeat?.end_at, 'HH:mm, MMM Do YYYY')}`;
                  }
                  dataTask.repeatContent = repeatContent;
                }
                if (['DRAFT', 'SCHEDULE'].includes(state.tab)) {
                  dataTask.action = ['edit', 'delete'];
                }
                if (status === 'DONE') {
                  dataTask.doneTask = true;
                }
                dataTask.warning = dataTask?.due?.status === 'overdue';
                state.listTask.push(dataTask);
              });
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
          });
      });
    };
    getChannelDetail();

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        getChannelDetail();
      }
    });

    onMounted(async () => {
      const element = document.querySelector('#dataTask') as any;
      element.addEventListener(
        'scroll',
        () => {
          if (element.scrollTop + element.offsetHeight + 10 >= element.scrollHeight) {
            checkPositionView.value = 'bottom';
          } else if (element.scrollTop === 0) {
            checkPositionView.value = 'top';
          } else {
            checkPositionView.value = 'flexible';
          }
        },
        { passive: true },
      );
    });
    const showModalTask = () => {
      channelStore.showModalAddTask(true);
    };
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
    const filterTask = (params?: paramsTask, clearFilter?: boolean) => {
      state.filter = {
        ...state.filter,
        ...params,
      };
      state.IsFilter = !clearFilter;

      getAllTaskChannel();
    };

    const scrollToBottom = (id: string) => {
      const element = document.getElementById(id) as any;
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    };

    const actionScroll = () => {
      scrollToBottom('task#0');
      // state.filter = {
      //   ...state.filter,
      //   page_size: state.total + 1,
      // };
      // getAllTaskChannel().then(() => {
      //   scrollToBottom(`task#0`);
      // });
    };

    const closeModal = () => {
      state.showPopup = false;
      state.deleteId = [];
    };

    const deleteDraft = () => {
      TaskService.deleteDraft({
        task_ids: state.deleteId,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.draft.notify.removeDraftSuccess'),
            );
            closeModal();
            // mainStore.actionReloadSideBar();
            channelStore.totalCountDraftTask =
              channelStore.totalCountDraftTask > 1
                ? channelStore.totalCountDraftTask - 1
                : 0;
            getAllTaskChannel().then((res: any) => {
              console.log(res);
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.draft.notify.removeDraftFailed'));
        });
    };
    const deleteScheduled = () => {
      TaskService.deleteScheduled({
        task_ids: state.deleteId,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.draft.notify.removeScheduleSuccess'),
            );
            closeModal();
            channelStore.totalCountDraftTask =
              channelStore.totalCountDraftTask > 1
                ? channelStore.totalCountDraftTask - 1
                : 0;

            getAllTaskChannel().then((res: any) => {
              console.log(res);
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(
            t('workspace.draft.notify.removeScheduleFailed'),
          );
        });
    };

    const detailTask = (item: formChannel, type?: string) => {
      if (type === 'detail' && state.tab === 'SENT') {
        refTaskChannel.value.setInfoModal(item.id, type);
      }
      if (type !== 'detail' && state.tab !== 'SENT') {
        refTaskChannelDraft.value.setInfoModal(item, type);
      }
    };
    const markAsRead = (task_ids?: number[]) => {
      TaskService.markReadTask({
        workspace_id: Number(route?.params?.workspaceId),
        task_ids: task_ids || [],
        is_read: true,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            if (!task_ids) {
              NotifyServices.showMessageSuccess(
                t('workspace.unread.notify.markAsReadSuccess'),
              );
            }
            mainStore.actionReloadSideBar();
            getAllTaskChannel();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          if (!task_ids) {
            NotifyServices.showMessageError(
              t('workspace.unread.notify.markAsReadSuccess'),
            );
          }
        });
    };

    watch(route, () => {
      if (route?.params?.channelId && route?.params?.workspaceId) {
        getChannelDetail();
      }
    });
    const scrollTargetRef = ref();
    const changeTab = () => {
      router.replace({
        ...route,
        query: {
          tab: state.tab,
        },
      });
      getAllTaskChannel();
    };
    return {
      ...toRefs(state),
      refTaskChannel,
      refTaskChannelDraft,
      scrollTargetRef,
      showModalTask,
      onLoad,
      getAllTaskChannel,
      scrollToBottom,
      actionScroll,
      deleteDraft,
      // popup
      handleDelete,
      filterTask,
      detailTask,
      changeTab,
      checkPositionView,
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

.data-task {
  height: calc(100vh - 260px);
  margin-top: 25px;
}

.title-top {
  margin-bottom: 5px;
  font-weight: 500;
  span {
    color: #1c8c44;
    margin-left: 5px;
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
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e7f6e9 !important;
  }

  .box-fixed__icon {
    color: #1c8c44;
  }

  .box-fixed__icon .item-title {
    font-size: 14px;
  }
}

.tool-tip .text-title {
  font-size: 12px;
  color: #2f2f2f;
}
</style>
