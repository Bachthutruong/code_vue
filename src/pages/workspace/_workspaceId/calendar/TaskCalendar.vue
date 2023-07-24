<template>
  <div
    id="dataTask"
    class="data-task"
    @scroll="handleScroll"
    ref="scrollTargetRef"
  >
    <noData
      v-if="!listTask.length"
      :title="$t('workspace.channel.channelNodata')"
    >
    </noData>
    <!--      <div >-->
    <q-infinite-scroll
      @load="onLoad"
      :offset="50"
      :scroll-target="scrollTargetRef"
    >
      <template v-for="(cardItem, index) in listTask">
        <showDateTask
          v-if="cardItem?.type === 'dateTime'"
          :key="index"
          :date-time="cardItem"
          :id="`task#${index}`"
        ></showDateTask>
        <CardChannel
          v-if="cardItem?.type !== 'dateTime'"
          :key="index"
          :id="`task#${index}`"
          :formChannelInfo="cardItem"
          @detailTask="detailTask(cardItem.id, 'detail')"
          @setFlag="setFlag(cardItem, index)"
          @forwardTask="detailTask(cardItem.id, 'forward')"
          @editTask="detailTask(cardItem.id, 'edit')"
          @reminderTask="showReminderModal(cardItem)"
          hiddenPin
        >
          <template #card-top>
            <div class="title-top flex items-center">
              <p class="text-body q-mb-none">
                {{ cardItem?.channel?.type === 'ONE_TO_ONE' ? 'One to one' : 'Channel' }}:
              </p>
              <span
                >{{ cardItem?.channel?.type === 'ONE_TO_ONE' ? '' : '#' }}
                {{ cardItem?.channel?.name }}</span
              >
            </div>
          </template>
          <template #left-radio>
            <q-checkbox
              v-if="cardItem.statusTask !== 'CANCEL'"
              checked-icon="bi-check-circle-fill"
              unchecked-icon="bi-circle"
              :model-value="cardItem.statusTask === 'DONE'"
              class="mark-done-check-box"
              :class="!cardItem.can_mark ? 'none-checkbox' : ''"
              @click="markDoneTask(cardItem, index)"
            />
            <q-checkbox
              v-if="cardItem.statusTask === 'CANCEL'"
              checked-icon="bi-x-circle-fill"
              :model-value="cardItem.statusTask === 'CANCEL'"
              class="mark-done-check-box"
              :class="!cardItem.can_mark ? 'none-checkbox' : ''"
              @click="cancelTask(cardItem, index)"
            />
            <q-tooltip
              v-if="!cardItem.is_read"
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              max-width="210px"
              max-height="100px"
              class="tool-tip bg-green-1"
            >
              <h1>{{ $t('workspace.channel.toolTip.unRead') }}</h1>
            </q-tooltip>
            <p
              v-if="cardItem?.statusTask === 'DONE' || cardItem?.statusTask === 'CANCEL'"
              class="day-date"
              :class="!cardItem.can_mark ? 'none-checkbox' : ''"
            >
              {{ formatDate(cardItem?.updated || '') }}
            </p>
          </template>
        </CardChannel>
      </template>

      <template v-slot:loading>
        <div class="row justify-center q-my-md">
          <q-spinner-dots
            color="primary"
            size="40px"
          />
        </div>
      </template>
    </q-infinite-scroll>
    <!--      </div>-->

    <div
      v-if="listTask.length"
      class="box-fixed"
    >
      <div class="box-fixed-scroll">
        <c-btn
          v-if="checkPositionView != 'top'"
          color="primary"
          outline
          size="small"
          class="box-fixed__btn"
          @click="actionScroll"
        >
          <template #default>
            <q-icon
              size="16px"
              name="bi-chevron-double-up"
            />
            <q-tooltip
              :offset="[10, 10]"
              max-width="300px"
              max-height="50px"
              anchor="center start"
              self="center end"
              class="tool-tip bg-green-1 text-black shadow-9"
            >
              <span class="text-title">{{ $t('workspace.channel.toolTip.top') }}</span>
            </q-tooltip>
          </template>
        </c-btn>
      </div>
    </div>
  </div>

  <modalTaskCalendar
    ref="refTaskChannel"
    @reload="getAllTaskChannel()"
  ></modalTaskCalendar>
  <c-confirm
    v-model="IsShowPopup"
    :title="infoPopup?.title || ''"
    :sub-title="infoPopup?.desc"
    :text-ok="infoPopup?.textAction || ''"
    :text-cancel="$t('global.no')"
    :loading="loadingPopup"
    @on-ok="infoPopup?.action"
    @close="closeModal"
  />
  <modalReminder
    ref="refModalReminder"
    v-model="isShowModalReminder"
    :info-popup="infoPopup"
    @onOk="
      (time) => {
        infoPopup.action(time);
      }
    "
    @close="closeReminderModal"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  ref,
  nextTick,
  watch,
  onMounted,
} from 'vue';

import noData from 'components/general/noData.vue';
import modalTaskCalendar from 'components/calendar/modalTaskCalendar.vue';
import showDateTask from 'components/common/showDateTask.vue';
import { useMainStore } from 'stores/main';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import CardChannel from 'components/common/CardChannel.vue';
import NotifyServices from 'src/plugins/NotifyServices';
import { formChannel, TaskStatusType } from 'src/interface/cardChannel';
import {
  capitalizeFirstLetter,
  checkDue,
  convertArrayToString,
  formatDateDisplay,
  scrollToId,
  showCheckDue,
  formatIosStringToDate,
  formatDateToIosString,
} from 'src/helper/global';
import { useI18n } from 'vue-i18n';
import { paramsCalendar } from 'src/services/calendar/model';
import { useCalendarStore } from 'stores/calendar';
import TaskService from 'src/services/task';
import modalReminder from 'components/task/modalReminderTask.vue';
import { useChannelStore } from 'stores/channel';

export default defineComponent({
  name: 'TaskCalendar',

  components: {
    CardChannel,
    noData,
    modalTaskCalendar,
    showDateTask,
    modalReminder,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const refTaskChannel = ref();
    const refModalReminder = ref();

    const state = reactive<{
      loading: boolean;
      IsFilter: boolean;
      IsShowPopup: boolean;
      loadingPopup: boolean;
      listTask: Array<formChannel>;
      isShowModalReminder: boolean;
      taskStatus: any;
      filter: paramsCalendar;
      total: number;
      selected: any;
      showSelected: boolean;
      selectedAll: boolean;
      render: number;
      totalCountDate: number;
      timeline: any;
      infoPopup: any;
    }>({
      loading: false,
      listTask: [],
      loadingPopup: false,
      taskStatus: TaskStatusType,
      isShowModalReminder: false,
      IsShowPopup: false,
      filter: {
        page: 1,
        page_size: 12,
      },
      total: 0,
      IsFilter: false,
      selected: [],
      showSelected: false,
      selectedAll: false,
      render: 0,
      totalCountDate: 0,
      timeline: null,
      infoPopup: null,
    });
    const resetPage = () => {
      state.render += 1;
      state.selectedAll = false;
      state.showSelected = false;
      state.IsFilter = false;
      state.selected = [];
      state.filter = {
        page: 1,
        page_size: 12,
      };
    };

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const channelStore = useChannelStore();

    const calendarStore = useCalendarStore();
    const checkPositionView = ref('flexible');

    const refactorItem = (item: any) => {
      const status = item.status?.[0]?.type || 'INDUE';
      const statusSent = item?.creator?.id === infoUser?.value?.id ? 'sent' : 'received';
      let dataTask: formChannel = {
        // ...item,
        id: item.id,
        statusBackground:
          status === 'CANCEL' ? state.taskStatus[status] : state.taskStatus[statusSent],
        statusTask: status,
        radio: '',
        date: {
          status: status === 'DRAFT' ? 'draft' : statusSent,
          time: item.released_at || '',
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
        reminder: item?.reminders?.[0],
        is_read: item?.reads?.[0]?.is_read || false,
        is_mute: item?.mute_comments?.[0]?.is_mute || false,
        can_mark: item?.can_mark || false,
        type: item.type || '',
        other: item,
        channel: item.channel,
        can_access: item?.can_access || false,
        attachments: item?.attachments?.length || '',
      };

      if (status === 'DONE') {
        dataTask.doneTask = true;
      }
      dataTask.warning = dataTask?.due?.status === 'overdue';
      return dataTask;
    };

    const checkDateFilter = (
      start_date?: string | null | LocationQueryValue[] | undefined,
      end_date?: string | null | LocationQueryValue[] | undefined,
    ) => {
      if (start_date && !end_date) {
        // state.date = start_date;
        return true;
      } else if (start_date && end_date) {
        // @ts-ignore
        if (Math.abs(checkDue(start_date, 'days', end_date)) === 0) {
          // state.date = start_date;
          return true;
        } else {
          // state.date = {
          //   from: start_date,
          //   to: end_date,
          // };
          return false;
        }
      } else return false;
    };
    const checkDateSingle = computed(() => {
      return checkDateFilter(route?.query?.start_date, route?.query?.end_date);
    });
    const getTotalGroup = (time: string) => {
      if (checkDateSingle.value) {
        const dateTime = Object.keys(state.timeline)[0] as string;
        return state.timeline[dateTime][time.toLowerCase()];
      } else {
        return state.timeline[time]?.total;
      }
    };
    const groupDateTime = (data: any, time: string, dataTask: any) => {
      let result = { ...data } as any;
      let dateItem = {
        type: 'dateTime',
        time: checkDateSingle.value ? time : formatDateDisplay(time),
        total: getTotalGroup(time),
      } as any;
      if (!result[time]) {
        result[time] = [dateItem, dataTask];
      } else {
        result[time] = [dateItem, ...result?.[time].slice(1), dataTask];
      }
      return result;
    };

    const refactorListItem = (data: any): Array<formChannel> => {
      let result = {} as any;
      const formatDate = checkDateSingle.value ? 'A' : 'YYYY-MM-DD';
      data.forEach((item: any) => {
        const status = item.status?.[0]?.type || 'INDUE';
        const dataTask = refactorItem(item) as any;
        if (['INDUE', 'OVERDUE'].includes(status)) {
          const due_time = formatDateDisplay(item?.due_at, formatDate);
          result = groupDateTime(result, due_time, dataTask);
        } else {
          const updated = formatDateDisplay(item?.status?.[0]?.updated_at, formatDate);
          result = groupDateTime(result, updated, dataTask);
        }
      });
      let arrayResult = [] as Array<formChannel>;
      for (const key in result) {
        arrayResult = [...arrayResult, ...result[key]];
      }
      state.totalCountDate = Object.keys(result)?.length || 0;
      return arrayResult;
    };
    const getAllTaskChannel = () => {
      mainStore.loadingPage = true;
      const status = route.query.status as string;
      const paramsBody: paramsCalendar = {
        page: 1,
        page_size: state.filter?.page_size || 12,
        status: status?.toUpperCase() || 'INDUE',
      };
      return new Promise((resolve, reject) => {
        calendarStore
          .getAllTaskCalendar(paramsBody)
          .then((res: any) => {
            console.log(res);
            if (res?.status_code === 200) {
              // calendarStore.actionReloadFilter();
              const responsive = res?.data;
              state.timeline = responsive.timeline;
              state.total = responsive?.total || 0;
              state.listTask = refactorListItem(responsive.data);
              // responsive.data.forEach((item: any) => {
              //   state.listTask.push(refactorItem(item));
              // });
              if (state.selectedAll) {
                state.selected = state.listTask.map((item) => item.id);
              }
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
            }
          })
          .catch((err) => {
            NotifyServices.showMessageError(`${err.message}`);
            reject(false);
          })
          .finally(() => {
            state.loading = false;
            mainStore.loadingPage = false;
          });
      });
    };
    getAllTaskChannel();
    const reloadPage = computed(() => {
      return calendarStore.reloadPage;
    });
    watch(reloadPage, () => {
      if (reloadPage.value) {
        setTimeout(() => {
          getAllTaskChannel();
        }, 50);
      }
    });

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        setTimeout(() => {
          getAllTaskChannel();
        }, 50);
      }
    });
    const onLoad = async (index: number, done: any) => {
      if (state.loading || state.total === state.listTask.length - state.totalCountDate) {
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

    const actionScroll = () => {
      scrollToId('task#1');
    };

    const detailTask = (id: number | string, type?: string) => {
      refTaskChannel.value.setInfoModal(id, type);
    };

    const scrollBot = ref(false);
    const handleScroll = () => {
      nextTick(() => {
        if (document) {
          const myElement = document.getElementById('dataTask') as any;
          const scrollY = myElement.scrollTop;
          scrollBot.value = scrollY > 50;
        }
      });
    };
    const scrollTargetRef = ref();
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
    const cancelTask = (item: formChannel, index: number) => {
      if (!item.can_mark) {
        return;
      }
      console.log('cancelTask', item, index);
      if (item.statusTask === 'CANCEL') {
        unMarkTask([item.id])
          .then((res) => {
            if (res) {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.markUnCancelTaskSuccess'),
              );
            }
          })
          .catch(() => {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.markUnCancelTaskFailed'),
            );
          });
        return;
      }
      TaskService.markTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        task_ids: [item.id],
        type: 'CANCEL',
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.markCancelTaskSuccess'),
            );
            mainStore.actionReloadSideBar();
            getAllTaskChannel().then(() => {
              // scrollToId(`task#${index}`);
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.channel.notify.markCancelTaskFailed'),
          );
        });
    };
    const markDoneTask = (item: formChannel, index: number) => {
      if (!item.can_mark) {
        return;
      }
      if (item.statusTask === 'DONE') {
        unMarkTask([item.id])
          .then((res) => {
            if (res) {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.markUnDoneTaskSuccess'),
              );
            }
          })
          .catch(() => {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.markUnDoneTaskFailed'),
            );
          });
        return;
      }
      TaskService.markTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        task_ids: [item.id],
        type: 'DONE',
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.markDoneTaskSuccess'),
            );
            mainStore.actionReloadSideBar();
            getAllTaskChannel().then(() => {
              // scrollToId(`task#${index}`);
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.channel.notify.markDoneTaskFailed'),
          );
        });
    };
    const unMarkTask = (task_ids = state.selectedAll ? [] : [...state.selected]) => {
      return new Promise((resolve, reject) => {
        TaskService.unmarkTask({
          workspace_id: Number(route?.params?.workspaceId),
          channel_id: Number(route?.params?.channelId),
          task_ids: task_ids,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              mainStore.actionReloadSideBar();
              getAllTaskChannel();
              resolve(true);
            } else {
              NotifyServices.showMessageError(res?.errors.message);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      });
    };
    const formatDate = (dateTime: any) => {
      return formatDateDisplay(dateTime, 'D/MM/YYYY');
    };

    const setFlag = (item: formChannel, index: number) => {
      TaskService.setFlagTask({
        task_id: item.id,
        is_flag: !item.flag,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            if (item.flag) {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.unsetFlagTaskSuccess'),
              );
            } else {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.setFlagTaskSuccess'),
              );
            }
            getAllTaskChannel().then(() => {
              // scrollToId(`task#${index}`);
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.channel.notify.setFlagTaskFailed'),
          );
        });
    };

    const reminderTask = (item: formChannel, time: string) => {
      TaskService.setReminderTask({
        channel_id: Number(item?.channel?.id),
        task_id: item.id,
        remind_at: formatDateToIosString(time),
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.reminderTaskSuccess'),
            );
            closeReminderModal();
            getAllTaskChannel().then(() => {
              // scrollToId(`task#${index - 1 || 0}`);
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.channel.notify.reminderTaskFailed'),
          );
        });
    };
    const closeReminderModal = () => {
      state.isShowModalReminder = false;
    };

    const showReminderModal = (item: formChannel) => {
      refModalReminder.value.setDefault(
        formatIosStringToDate(`${item.reminder?.remind_at || item.due_time || ''}`),
      );
      state.isShowModalReminder = true;
      state.infoPopup = {
        action: (time: string) => {
          reminderTask(item, time);
        },
      };
    };
    const closeModal = () => {
      state.IsShowPopup = false;
      state.infoPopup = null;
    };
    return {
      ...toRefs(state),
      refTaskChannel,
      scrollBot,
      scrollTargetRef,
      onLoad,
      getAllTaskChannel,
      actionScroll,
      resetPage,
      //
      detailTask,
      // popup
      handleScroll,
      cancelTask,
      markDoneTask,
      unMarkTask,
      formatDate,
      checkPositionView,
      setFlag,
      reminderTask,
      closeReminderModal,
      showReminderModal,
      refModalReminder,
      closeModal,
    };
  },
});
</script>
<style lang="scss" scoped>
.data-task {
  height: calc(100vh - 240px);
  max-height: calc(100vh - 240px);
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

    .q-icon {
      color: #1c8c44;
    }
  }
}

.data-add-task {
  width: 168px;
}

.title-top {
  margin-bottom: 5px;
  font-weight: 500;

  span {
    color: #1c8c44;
    margin-left: 5px;
  }
}

.mark-done-check-box {
  padding-bottom: 10px;
  padding-left: 15px;
}

.data-task {
  margin-top: 80px;
}

.none-checkbox {
  display: none;
}

.tool-tip .text-title {
  font-size: 12px;
  color: #2f2f2f;
}
</style>
