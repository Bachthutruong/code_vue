<template>
  <div class="body-task">
    <div
      v-show="isShowPin"
      class="body-task-pin"
    >
      <title-pin
        :countPin="listTaskPin.length"
        @action="backToListTask()"
      ></title-pin>
      <template
        v-for="(cardItem, index) in listTaskPin"
        :key="cardItem.id"
      >
        <CardChannel
          :id="`task#${index}`"
          :formChannelInfo="cardItem"
          @setFlag="setFlag(cardItem, index)"
          @forwardTask="detailTask(cardItem.id, 'forward')"
          @editTask="detailTask(cardItem.id, 'edit')"
          @markAsRead="markAsRead(true, cardItem)"
          @detailTask="detailTask(cardItem.id, 'detail')"
          @reminderTask="showReminderModal(cardItem)"
          @pinTask="pinTask(cardItem)"
        >
        </CardChannel>
      </template>
    </div>
    <div
      v-show="!isShowPin"
      class="body-task-list"
      :class="{
        'body-welcome-channel': total === 0 && !loading,
      }"
    >
      <WelcomeChannel
        v-if="total === 0 && !loading && listTask.length > 0"
        class="welcome-channel"
      />
      <div
        id="dataTask"
        class="data-task"
        :class="IsFilter ? 'filter-tag' : ''"
        @scroll="handleScroll"
        ref="scrollTargetRef"
      >
        <q-infinite-scroll
          @load="onLoad"
          :offset="50"
          :scroll-target="scrollTargetRef"
          :reverse="!IsFilter"
        >
          <template
            v-for="(cardItem, index) in listTask"
            :key="cardItem.id"
          >
            <add-or-remove-member
              v-if="['JOIN'].includes(<string>cardItem?.type)"
              :id="`task#${index}`"
              :info-task="cardItem"
            />
            <title-pin
              v-if="['PIN_TASK','UNPIN_TASK'].includes(<string>cardItem?.type)"
              :info-task="cardItem"
              :id="`task#${index}`"
            ></title-pin>
            <CardChannel
              v-if="!cardItem?.is_activity"
              :id="`task#${index}`"
              :formChannelInfo="cardItem"
              @setFlag="setFlag(cardItem)"
              @forwardTask="detailTask(cardItem.id, 'forward')"
              @editTask="detailTask(cardItem.id, 'edit')"
              @cancelTask="handleCancelTask(cardItem, index)"
              @markAsRead="markAsRead(true, cardItem)"
              @detailTask="detailTask(cardItem.id, 'detail')"
              @reminderTask="showReminderModal(cardItem)"
              @pinTask="pinTask(cardItem)"
            >
              <template #left-radio>
                <q-checkbox
                  v-if="showSelected"
                  v-model="selected"
                  checked-icon="bi-check-circle-fill"
                  unchecked-icon="bi-circle"
                  :val="cardItem.id"
                  class="selected-check-box"
                />
                <q-checkbox
                  v-if="!showSelected && cardItem.statusTask !== 'CANCEL'"
                  checked-icon="bi-check-circle-fill"
                  unchecked-icon="bi-circle"
                  :model-value="cardItem.statusTask === 'DONE'"
                  class="mark-done-check-box"
                  :class="!cardItem.can_mark ? 'disabled' : ''"
                  @click="markDoneTask(cardItem)"
                />
                <q-checkbox
                  v-if="!showSelected && cardItem.statusTask === 'CANCEL'"
                  checked-icon="bi-x-circle-fill"
                  :model-value="cardItem.statusTask === 'CANCEL'"
                  class="mark-done-check-box"
                  :class="!cardItem.can_mark ? 'disabled' : ''"
                  @click="cancelTask(cardItem, index)"
                />
                <q-tooltip
                  v-if="!cardItem.can_mark"
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
                  v-if="
                    cardItem?.statusTask === 'DONE' || cardItem?.statusTask === 'CANCEL'
                  "
                  class="day-date"
                >
                  {{ formatDate(cardItem?.updated || '') }}
                </p>
              </template>
            </CardChannel>
          </template>

          <template
            v-if="loading"
            v-slot:loading
          >
            <div class="row justify-center q-my-md">
              <q-spinner-dots
                color="primary"
                size="40px"
              />
            </div>
          </template>
        </q-infinite-scroll>
        <noData
          v-if="!loading && total === 0"
          :title="$t('workspace.channel.channelNodata')"
        >
          <template #action>
            <c-btn
              :label="$t('workspace.channel.addTask')"
              color="primary"
              class="btn-addTask"
              icon="bi-plus-lg"
              @click="showModalTask"
            />
          </template>
        </noData>
        <div
          v-if="total > 0"
          class="box-fixed"
        >
          <TabFixedChannel />
          <div class="box-fixed-button">
            <c-btn
              :label="isHovered ? '' : $t('workspace.channel.addTask')"
              color="primary"
              icon="bi-plus-lg"
              :round="isHovered"
              @click="showModalTask"
              @mousemove="handleMouse(false)"
              @mouseleave="handleMouse(true)"
            />
          </div>
          <div class="box-fixed-scroll">
            <c-btn
              v-if="
                (!IsFilter && checkPositionView !== 'bottom') ||
                (IsFilter && checkPositionView !== 'top')
              "
              color="primary"
              outline
              size="small"
              class="box-fixed__btn"
              @click="actionScroll"
            >
              <template #default>
                <q-icon
                  size="16px"
                  :name="IsFilter ? 'bi-chevron-double-up' : 'bi-chevron-double-down'"
                />
                <q-tooltip
                  :offset="[10, 10]"
                  max-width="300px"
                  max-height="50px"
                  anchor="center start"
                  self="center end"
                  class="tool-tip bg-green-1 text-black shadow-9"
                >
                  <span
                    v-if="!IsFilter"
                    class="text-title"
                    >{{ $t('workspace.channel.toolTip.bottom') }}</span
                  >
                  <span
                    v-else
                    class="text-title"
                    >{{ $t('workspace.channel.toolTip.top') }}</span
                  >
                </q-tooltip>
              </template>
            </c-btn>
          </div>
        </div>
      </div>
    </div>
  </div>

  <modalTaskOneToOne
    ref="refTaskChannel"
    @createTask="createTask()"
    @reload="getAllTaskChannel()"
  ></modalTaskOneToOne>

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
  watch,
  toRefs,
  computed,
  ref,
  nextTick,
  onMounted,
} from 'vue';

// import HeaderFilterOneToOne from 'src/components/oneToone/HeaderFilterOneToOne.vue';
import noData from 'components/general/noData.vue';
import modalTaskOneToOne from 'components/oneToone/modalTaskOneToOne.vue';
import { useChannelStore } from 'stores/channel';
import { useMainStore } from 'stores/main';
import { useRoute, useRouter } from 'vue-router';
import { paramsTask } from 'src/services/task/model';
import CardChannel from 'components/common/CardChannel.vue';
import NotifyServices from 'src/plugins/NotifyServices';
import { formChannel, TaskStatusType } from 'src/interface/cardChannel';
import {
  capitalizeFirstLetter,
  checkDue,
  checkObjectIsNotDefine,
  convertArrayToString,
  formatDateDisplay,
  formatDateToIosString,
  formatIosStringToDate,
  scrollToBottom,
  scrollToId,
  showCheckDue,
  showElement,
} from 'src/helper/global';
import TaskService from 'src/services/task';
import { useI18n } from 'vue-i18n';
import AddOrRemoveMember from 'components/common/addOrRemoveMember.vue';
import WelcomeChannel from 'components/general/WelcomeChannel.vue';
import TitlePin from 'components/task/TitlePin.vue';
import modalReminder from 'components/task/modalReminderTask.vue';
import TabFixedChannel from 'components/channel/TabFixedChannel.vue';

export default defineComponent({
  name: 'oneToOneTaskPage',

  components: {
    TabFixedChannel,
    modalReminder,
    TitlePin,
    WelcomeChannel,
    AddOrRemoveMember,
    CardChannel,
    // HeaderFilterOneToOne,
    noData,
    modalTaskOneToOne,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const refTaskChannel = ref();
    const refModalReminder = ref();
    const state = reactive<{
      loading: boolean;
      loadingPopup: boolean;
      IsShowPopup: boolean;
      isShowModalReminder: boolean;
      listTask: Array<formChannel>;
      listTaskPin: Array<formChannel>;
      taskStatus: any;
      total: number;
      totalActivity: number;
      showModalDetail: boolean;
      infoPopup: any;
      selected: any;
      showSelected: boolean;
      selectedAll: boolean;
      render: number;
      renderOnLoad: number;
    }>({
      loading: false,
      loadingPopup: false,
      IsShowPopup: false,
      isShowModalReminder: false,
      listTask: [],
      listTaskPin: [],
      taskStatus: TaskStatusType,
      total: 0,
      totalActivity: 0,
      showModalDetail: false,
      infoPopup: null,
      selected: [],
      showSelected: false,
      selectedAll: false,
      render: 0,
      renderOnLoad: 0,
    });

    const closeModal = () => {
      state.IsShowPopup = false;
      state.infoPopup = null;
    };
    const resetPage = () => {
      closeModal();
      state.render += 1;
      state.selectedAll = false;
      state.showSelected = false;
      channelStore.IsFilter = false;
      state.showModalDetail = false;
      state.selected = [];
      channelStore.filter = {
        page_size: 12,
        status: undefined,
        is_flag: undefined,
        priority: undefined,
        start_date: undefined,
        end_date: undefined,
      };
    };
    const channelStore = useChannelStore();

    const IsFilter = computed(() => channelStore.IsFilter);
    const checkPositionView = ref('flexible');
    const channelDetail = computed(() => channelStore.detailChanel);
    watch(route, () => {
      if (channelDetail.value?.id !== Number(route.params.channelId)) {
        resetPage();
        getFilterDefault();
        getAllTaskChannel().then(() => {
          if (IsFilter.value) {
            scrollToId('task#0');
            showElement('dataTask');
          } else {
            scrollToBottom('dataTask');
          }
          getAllTaskPinChannel();
        });
      }
    });

    onMounted(async () => {
      if (route.query?.taskId) {
        detailTask(Number(route.query?.taskId), 'detail');
      }
      await getFilterDefault();
      await getAllTaskChannel().then(() => {
        if (IsFilter.value) {
          scrollToId('task#0');
          showElement('dataTask');
        } else {
          scrollToBottom('dataTask');
        }
        getAllTaskPinChannel();
      });
    });

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        reloadTask();
      }
    });
    const reloadTask = () => {
      getFilterDefault();
      getAllTaskChannel();
      getAllTaskPinChannel();
    };
    onMounted(async () => {
      if (route.query?.taskId) {
        detailTask(Number(route.query?.taskId), 'detail');
      }
      await getFilterDefault();
      await getAllTaskChannel().then(() => {
        if (channelStore.IsFilter) {
          scrollToId('task#0');
          showElement('dataTask');
        } else {
          scrollToBottom('dataTask');
        }
        getAllTaskPinChannel();
      });
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
    const setReadTask = (params?: paramsTask) => {
      let readTask = undefined;
      let is_flag = undefined;
      if (
        (typeof params?.readTask === 'object' && params?.readTask?.includes('UNREAD')) ||
        params?.readTask === 'UNREAD'
      ) {
        readTask = false;
      }
      if (
        (typeof params?.readTask === 'object' && params?.readTask?.includes('READ')) ||
        params?.readTask === 'READ'
      ) {
        readTask = true;
      }
      if (params?.readTask?.length === 2 || params?.readTask?.length === 0) {
        readTask = undefined;
      }
      if (params?.is_flag || typeof params?.is_flag === 'boolean') {
        is_flag = params?.is_flag === 'true' || params?.is_flag === true;
      }
      channelStore.filter = {
        ...channelStore.filter,
        is_read: readTask,
        is_flag,
      };

      const query = {
        ...route.query,
        ...channelStore.filter,
      } as any;

      const { taskId, commentId } = route.query;
      delete query.is_read;
      delete channelStore.filter.readTask;
      router.replace({
        ...route,
        query: channelStore.IsFilter
          ? query
          : {
              taskId,
              commentId,
            },
      });
    };

    const getFilterDefault = () => {
      if (!route?.params?.channelId) {
        router.push({ name: 'home' });
      }
      channelStore.filter = {
        ...channelStore.filter,
        ...route.query,
      };
      const { status, priority, is_flag, readTask, is_read, start_date, end_date } =
        route.query as any;
      const query = {
        status,
        priority,
        is_flag,
        readTask,
        is_read,
        start_date,
        end_date,
      };
      channelStore.IsFilter = checkObjectIsNotDefine(query);
      setReadTask(channelStore.filter);
    };
    const refactorItems = (arrayData: any) => {
      const listTask = arrayData.map((item: any) => {
        if (item.is_activity) {
          let dataTask: formChannel = {
            ...item,
            id: item.id,
            other: item,
          };
          if (dataTask.type === 'JOIN') {
            dataTask.other.user = {
              full_name: channelDetail.value?.name || '',
              email: '',
            };
          }
          return dataTask;
        } else {
          const status = item.status?.[0]?.type || 'INDUE';
          const statusSent =
            item?.creator?.id === infoUser?.value?.id ? 'sent' : 'received';
          let dataTask: formChannel = {
            // ...item,
            id: item.id,
            statusBackground:
              status === 'CANCEL'
                ? state.taskStatus[status]
                : state.taskStatus[statusSent],
            statusTask: status,
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
              name: item.creator.full_name || item.creator.email || '',
              avatar: item?.creator?.avatar?.url || '',
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
            is_pin: item?.is_pin || false,
            type: item.type || '',
            other: item,
            channel: item.channel,
            can_access: item?.can_access || false,
            attachments: item?.attachments?.length || '',
            typeTask: item?.status?.[0]?.type || '',
          };

          if (status === 'DONE') {
            dataTask.doneTask = true;
          }
          dataTask.warning = dataTask?.due?.status === 'overdue';
          return dataTask;
        }
      });
      if (IsFilter.value) {
        return listTask;
      } else {
        return listTask.reverse();
      }
    };
    const getAllTaskChannel = () => {
      mainStore.loadingPage = true;
      const paramsBody: paramsTask = {
        ...channelStore.filter,
        type: ['IMMEDIATE'],
        page: 1,
        page_size: channelStore.filter?.page_size || 12,
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        sort_by: 'released_at',
        order_by: 'DESC',
      };
      if (typeof paramsBody?.is_flag !== 'boolean') {
        delete paramsBody?.is_flag;
      }
      return new Promise((resolve, reject) => {
        TaskService.getAllTask(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data;
              state.listTask = refactorItems(responsive.data);
              state.total = responsive?.total || 0;
              channelStore.totalTask = state.total;
              state.totalActivity = responsive?.total_activity || 0;
              state.renderOnLoad = 1;
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
              reject(false);
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
    const getAllTaskPinChannel = () => {
      const paramsBody: paramsTask = {
        type: ['IMMEDIATE'],
        order_by: 'DESC',
        sort_by: 'released_at',
        is_pin: true,
        page: 1,
        page_size: 3,
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
      };
      return new Promise((resolve, reject) => {
        TaskService.getAllTask(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data;
              state.listTaskPin = refactorItems(responsive.data);
              channelStore.totalPin = state.listTaskPin.length || 0;
              resolve(true);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
              reject(false);
            }
          })
          .catch((err) => {
            console.log('err', err);
            NotifyServices.showMessageError(`${err}`);
            reject(false);
          });
      });
    };
    const showModalTask = () => {
      channelStore.showModalAddTask(true);
    };

    const onLoad = async (index: number, done: any) => {
      if (
        state.renderOnLoad < 1 ||
        state.loading ||
        state.total === Math.abs(state.listTask.length - state.totalActivity)
      ) {
        done();
        return;
      }
      console.log('onLoad');
      state.loading = true;
      channelStore.filter = {
        ...channelStore.filter,
        page_size: Number(channelStore.filter?.page_size || 12) + 6,
      };
      await getAllTaskChannel()
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          done();
        });
    };
    const createTask = () => {
      getAllTaskChannel().then(() => {
        if (IsFilter.value) {
          scrollToId('task#0');
          showElement('dataTask');
        } else {
          scrollToBottom('dataTask');
        }
      });
    };

    const reloadPage = computed(() => channelStore.reloadPageTask);
    watch(reloadPage, () => {
      if (reloadPage.value > 0) {
        filterTask();
      }
    });
    const filterTask = () => {
      setReadTask(channelStore.filter);
      getAllTaskChannel().then(() => {
        if (IsFilter.value) {
          scrollToId('task#0');
          showElement('dataTask');
        } else {
          scrollToBottom('dataTask');
        }
      });
    };

    const actionScroll = () => {
      if (IsFilter.value) {
        scrollToId('task#0');
        showElement('dataTask');
      } else {
        scrollToId(`task#${state.listTask.length - 1}`);
      }
    };

    const setFlag = (item: formChannel) => {
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
              checkUpdateTaskPin(item.id);
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
    const detailTask = (id: number | string, type?: string) => {
      refTaskChannel.value.setInfoModal(id, type);
    };

    const handleCancelTask = (item: formChannel, index: number) => {
      state.infoPopup = {
        action: () => cancelTask(item, index),
        title: t('workspace.task.popupCancel.title'),
        desc: t('workspace.task.popupCancel.desc'),
        textAction: t('workspace.task.popupCancel.textAction'),
        textCancel: t('workspace.task.popupCancel.textCancel'),
      };
      state.IsShowPopup = true;
    };
    const cancelTask = (item: formChannel, index: number) => {
      if (!item.can_mark) {
        return;
      }
      if (item.statusTask === 'CANCEL') {
        unMarkTask(item)
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
            closeModal();
            mainStore.actionReloadSideBar();
            getAllTaskChannel().then(() => {
              checkUpdateTaskPin(item.id);
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
        unMarkTask(item)
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
            closeModal();
            mainStore.actionReloadSideBar();
            getAllTaskChannel().then(() => {
              checkUpdateTaskPin(item.id);
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
    const unMarkTask = (item: formChannel) => {
      return new Promise((resolve, reject) => {
        TaskService.unmarkTask({
          workspace_id: Number(route?.params?.workspaceId),
          channel_id: Number(route?.params?.channelId),
          task_ids: [item.id],
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              mainStore.actionReloadSideBar();
              getAllTaskChannel();
              checkUpdateTaskPin(item.id);
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

    const markAsRead = (value: boolean, item: formChannel) => {
      let task_ids: Array<number> = [item.id];

      TaskService.markReadTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        task_ids,
        is_read: value,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            // if (!item) {
            NotifyServices.showMessageSuccess(
              value
                ? t('workspace.channel.notify.markReadTaskSuccess')
                : t('workspace.channel.notify.markUnReadTaskSuccess'),
            );
            // }
            mainStore.actionReloadSideBar();
            getAllTaskChannel();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // if (!item) {
          NotifyServices.showMessageError(
            value
              ? t('workspace.channel.notify.markReadTaskFailed')
              : t('workspace.channel.notify.markUnReadTaskFailed'),
          );
          // }
        });
    };

    const onEditChannel = () => {
      state.showModalDetail = true;
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

    const formatDate = (dateTime: any) => {
      return formatDateDisplay(dateTime, 'D/MM/YYYY');
    };

    const reminderTask = (item: formChannel, time: string) => {
      console.log('item', item);
      TaskService.setReminderTask({
        channel_id: Number(route?.params?.channelId),
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
              checkUpdateTaskPin(item.id);
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
    const pinTask = (item: formChannel) => {
      console.log('item', item.is_pin);

      TaskService[item.is_pin ? 'unpinTask' : 'pinTask']({
        channel_id: Number(route?.params?.channelId),
        task_id: item.id,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t(
                item.is_pin
                  ? 'workspace.channel.notify.unpinTaskSuccess'
                  : 'workspace.channel.notify.pinTaskSuccess',
              ),
            );
            closeModal();
            getAllTaskChannel().then(() => {
              getAllTaskPinChannel();
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            item.is_pin
              ? 'workspace.channel.notify.unpinTaskFailed'
              : t('workspace.channel.notify.pinTaskFailed'),
          );
        });
    };

    const isShowPin = computed(() => channelStore.isShowPin);

    const backToListTask = () => {
      channelStore.isShowPin = false;
    };

    const isHovered = ref(true);

    const handleMouse = (isBoolean: boolean) => {
      isHovered.value = isBoolean;
    };

    const checkUpdateTaskPin = (taskId: number) => {
      const indexItem = state.listTaskPin.findIndex(
        (itemPin: formChannel) => itemPin.id === taskId,
      );
      if (indexItem >= 0) {
        getAllTaskPinChannel();
      }
    };

    return {
      ...toRefs(state),
      isHovered,
      handleMouse,
      refTaskChannel,
      scrollBot,
      scrollTargetRef,
      refModalReminder,
      IsFilter,
      showModalTask,
      onLoad,
      getAllTaskChannel,
      createTask,
      scrollToId,
      actionScroll,
      //
      setFlag,
      detailTask,
      cancelTask,
      markDoneTask,
      // popup
      closeModal,
      handleCancelTask,
      filterTask,
      onEditChannel,
      markAsRead,
      handleScroll,
      formatDate,
      pinTask,
      reminderTask,
      isShowPin,
      backToListTask,
      closeReminderModal,
      showReminderModal,
      checkPositionView,
      reloadTask,
    };
  },
});
</script>
<style lang="scss" scoped>
.data-task {
  .btn-addTask {
    width: 168px;
  }
}

.box-fixed {
  position: fixed;
  right: 48px;
  bottom: 40px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

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

.mark-done-check-box {
  padding-bottom: 10px;
  padding-left: 15px;
}

.tool-tip {
  background: #e7f6e9 !important;

  h1 {
    font-size: 16px;
    line-height: 24px;
    color: #2f2f2f;
    font-weight: 400;
    margin-left: 16px;
  }
}

#dataTask {
  height: 100%;
  max-height: 100%;
  overflow-anchor: none;
  opacity: 0;
  margin-top: auto;
  display: flex;
  flex-direction: column;

  .q-infinite-scroll {
    width: 100%;
    overflow-anchor: auto;
  }
}

.none-checkbox {
  display: none;
}

.filter-tag {
  margin-top: 60px !important;
}

.body-task {
  &-pin {
    padding: 25px 32px;
  }
  &-list {
    padding-top: 60px;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    &.body-welcome-channel {
      padding-top: 0;
    }
  }
}

.tool-tip .text-title {
  font-size: 12px;
  color: #2f2f2f;
}
</style>
