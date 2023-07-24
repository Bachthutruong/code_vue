<template>
  <div class="body-task">
    <div
      v-if="listTask?.length && isShowArrange"
      class="box-action-wiki"
    >
      <span>{{ $t('workspace.wiki.arrangeMode.content') }}</span>
      <span
        class="text-primary cursor-pointer"
        @click="showArrange"
        >{{ $t('workspace.wiki.arrangeMode.click') }}</span
      >
      <span>{{ $t('workspace.wiki.arrangeMode.lastContent') }}</span>
    </div>
    <div
      id="dataTask"
      class="data-task"
      ref="scrollTargetRef"
    >
      <noData
        v-if="!listTask.length && !loading"
        type-data="wiki"
      >
        <template #bottom>
          <div class="bottom-title">
            <div class="text-body">
              {{ $t('workspace.wiki.noData.title') }}
            </div>
            <div class="text-body-regular">
              {{ $t('workspace.wiki.noData.content') }}
            </div>
          </div>
        </template>
      </noData>
      <q-infinite-scroll
        @load="onLoad"
        :offset="100"
        :scroll-target="scrollTargetRef"
      >
        <draggable
          v-model="listTask"
          :key="isShowArrange"
          item-key="id"
          group="items"
          handle=".handle"
          @start="onDrag"
          @end="setNewIndexWiki"
        >
          <template #item="{ element, index }">
            <div>
              <add-or-remove-member
                v-if="['JOIN', 'LEAVE'].includes(<string>element?.type)"
                :id="`task#${index}`"
                :info-task="element"
              />
              <CardChannel
                v-if="!element?.is_activity"
                :id="`task#${index}`"
                :formChannelInfo="element"
                type-data="wiki"
                @detailTask="detailTask(element.id, 'detail')"
                @editTask="detailTask(element.id, 'edit')"
                @deleteTask="showPopupDelete(element)"
                :class="{ dragging: element.id === dragId }"
              >
                <template
                  v-if="isShowArrange"
                  #right-action
                >
                  <c-btn
                    class="handle"
                    color="primary"
                    flat
                    icon="mdi-arrow-up-down"
                    fontSizeIcon="40"
                  >
                  </c-btn>
                </template>
              </CardChannel>
            </div>
          </template>
        </draggable>

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
        <div
          v-if="permissionChannel?.createWiki"
          class="box-fixed-button"
        >
          <c-btn
            :label="''"
            color="primary"
            icon="bi-pencil-square"
            :round="true"
            @click="showModalTask"
          />
          <q-tooltip
            anchor="center start"
            self="center end"
            :offset="[10, 10]"
            class="tool-tip bg-green-1"
            max-width="400px"
            max-height="36px"
          >
            <span class="text-title">{{ $t('workspace.wiki.addPost') }}</span>
          </q-tooltip>
        </div>
        <div
          v-if="listTask.length"
          class="box-fixed-scroll"
        >
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
                :name="'bi-chevron-double-up'"
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
  </div>

  <modalWiki
    ref="refTaskChannel"
    @reload="getAllWiki()"
    @createTask="createWiki()"
  ></modalWiki>
  <c-confirm
    v-model="showModalConfirm"
    :title="infoModalConfirm.title"
    :text-ok="infoModalConfirm.textOk"
    :text-cancel="infoModalConfirm.textCancel"
    :disabled="infoModalConfirm.disabled"
    :alignFooter="infoModalConfirm.alignFooter"
    @on-ok="onOk"
  >
    <div>{{ infoModalConfirm.desc }}</div>
  </c-confirm>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, ref, watch, onMounted } from 'vue';
// import modalTaskCalendar from 'components/calendar/modalTaskCalendar.vue';
import modalWiki from 'components/wiki/modalWiki.vue';

import noData from 'components/general/noData.vue';
import { useChannelStore } from 'stores/channel';
import { useMainStore } from 'stores/main';
import { useRoute } from 'vue-router';
import CardChannel from 'components/common/CardChannel.vue';
import NotifyServices from 'src/plugins/NotifyServices';
import { formChannel, TaskStatusType } from 'src/interface/cardChannel';
import { convertArrayToString, debounceCustom, scrollToId } from 'src/helper/global';
import WikiService from 'src/services/wiki';
import { useI18n } from 'vue-i18n';
import { bodyArrange, paramsWiki, TypePositionsWiki } from 'src/services/wiki/model';
import draggable from 'vuedraggable';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
import CConfirm from 'components/common/CConfirm.vue';
import AddOrRemoveMember from 'components/common/addOrRemoveMember.vue';
import TabFixedChannel from 'components/channel/TabFixedChannel.vue';

export default defineComponent({
  name: 'wikiPage',
  components: {
    TabFixedChannel,
    AddOrRemoveMember,
    CConfirm,
    CardChannel,
    noData,
    modalWiki,
    draggable,
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const refTaskChannel = ref();

    const state = reactive<{
      loading: boolean;
      loadingPopup: boolean;
      IsShowPopup: boolean;
      listTask: Array<formChannel>;
      taskStatus: any;
      filter: paramsWiki;
      total: number;
      totalActivity: number;
      renderOnLoad: number;
      infoPopup: any;
      showModalConfirm: boolean;
      infoModalConfirm: typeInfoModalConfirm;
    }>({
      loading: false,
      loadingPopup: false,
      IsShowPopup: false,
      listTask: [],
      taskStatus: TaskStatusType,
      filter: {
        page: 1,
        page_size: 12,
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        is_read: undefined,
      },
      total: 0,
      totalActivity: 0,
      renderOnLoad: 0,
      infoPopup: null,
      showModalConfirm: false,
      infoModalConfirm: {
        type: 'confirm',
        title: '',
        textOk: '',
        textCancel: '',
        alignFooter: '',
        desc: '',
        disabled: false,
      },
    });

    const checkPositionView = ref('top');

    const closeModal = () => {
      state.IsShowPopup = false;
      state.infoPopup = null;
      state.showModalConfirm = false;
    };

    const channelStore = useChannelStore();
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });

    const resetPage = () => {
      state.renderOnLoad = 0;
      state.filter = {
        page: 1,
        page_size: 12,
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        is_read: undefined,
      };
      state.infoPopup = null;
      state.showModalConfirm = false;
      state.infoModalConfirm = {
        type: 'confirm',
        title: '',
        textOk: '',
        textCancel: '',
        alignFooter: '',
        desc: '',
        disabled: false,
      };
      checkPositionView.value = 'flexible';
      channelStore.isShowArrange = false;
    };

    const refactorItems = (arrayData: any) => {
      const listTask = arrayData.map((item: any) => {
        if (item.is_activity) {
          let dataTask: formChannel = {
            ...item,
            id: item.id,
            other: item,
          };
          return dataTask;
        } else {
          const status = item?.type;
          const statusSent =
            item?.creator?.id === infoUser?.value?.id ? 'sent' : 'received';
          let dataTask: formChannel = {
            // ...item,
            id: item.id,
            statusBackground: state.taskStatus[statusSent],
            statusTask: status,
            radio: '',
            date: {
              status: statusSent,
              time: item.released_at || '',
            },
            content: item.topic || '',
            due: {
              status: 'due',
              date: '',
            },
            creator: {
              email: item?.creator?.email || '',
              full_name: item?.creator?.full_name || '',
              avatar: item?.creator?.avatar?.url || '',
              name: item.creator?.full_name || item.creator?.email || '',
            },
            priority: '',
            attachment: convertArrayToString(item.attachments, 'originalname'),
            markDone: 0,
            comment: item?.comment_count || 0,
            flag: item.flags?.[0]?.is_flag || false,
            reads: item.read_count === item.member_count || false,
            updated: item?.status?.[0]?.updated_at,
            due_time: item?.due_at,
            is_read: item?.reads?.[0]?.is_read || false,
            is_mute: false,
            can_mark: false,
            type: item.type || '',
            other: item,
            channel: item.channel,
            can_access: true,
            attachments: item?.attachments?.length || '',
          };

          if (status === 'DONE') {
            dataTask.doneTask = true;
          }
          dataTask.warning = dataTask?.due?.status === 'overdue';
          return dataTask;
        }
      });
      return listTask;
    };
    const getAllWiki = () => {
      mainStore.loadingPage = true;
      const paramsBody: paramsWiki = {
        ...state.filter,
        type: ['IMMEDIATE'],
        page: 1,
        page_size: state.filter?.page_size || 12,
        workspace_id: Number(route?.params?.workspaceId),
      };
      return new Promise((resolve, reject) => {
        WikiService.getAllWiki(paramsBody)
          .then((res: any) => {
            console.log(res);
            if (res?.status_code === 200) {
              const responsive = res?.data;
              state.listTask = refactorItems(responsive.data);
              state.total = responsive?.total || 0;
              state.totalActivity = responsive?.total_activity || 0;
              state.renderOnLoad = 1;
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
    getAllWiki();

    const createWiki = () => {
      getAllWiki();
    };
    onMounted(() => {
      if (route.query?.wikiId) {
        detailTask(Number(route.query?.wikiId), 'detail');
      }
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
    watch(reloadAllPage, () => {
      getAllWiki();
    });
    const channelDetail = computed(() => channelStore.detailChanel);

    watch(route, () => {
      if (
        route.params.channelId &&
        channelDetail.value?.id !== Number(route.params.channelId)
      ) {
        mainStore.loadingPage = true;
        resetPage();
        getAllWiki();
      }
    });
    const changeArrangeWiki = () => {
      const positions: TypePositionsWiki[] = state.listTask.map(
        (item: formChannel, index: number) => {
          return {
            wiki_id: item.id,
            index,
          };
        },
      );

      const body: bodyArrange = {
        channel_id: Number(route.params.channelId),
        positions,
      };
      WikiService.arrangeWiki(body).then((res: any) => {
        if (res?.status_code === 200) {
          console.log('arrangeWiki');
          // getAllWiki()
        }
      });
    };

    const setNewIndexWiki = () => {
      console.log('setNewIndexWiki');
      return debounceCustom(changeArrangeWiki, 500);
    };
    const showModalTask = () => {
      channelStore.IsShowModalPost = true;
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
      state.loading = true;
      state.filter = {
        ...state.filter,
        page_size: (state.filter.page_size || 12) + 6,
      };
      await getAllWiki()
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
      scrollToId('task#0');
    };
    const markAsRead = (task_ids?: number[]) => {
      WikiService.markReadWiki({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        wiki_ids: task_ids || [],
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            if (!task_ids) {
              NotifyServices.showMessageSuccess(
                t('workspace.unread.notify.markAsReadSuccess'),
              );
            }
            getAllWiki();
            mainStore.actionReloadSideBar();
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

    const detailTask = (id: string | number, type?: string) => {
      refTaskChannel.value.setInfoModal(id, type);
    };
    const scrollTargetRef = ref();
    const permissionChannel = computed(() => channelStore.getRolePermissionChannel);

    const isShowArrange = computed(() => channelStore.isShowArrange);
    const showArrange = () => {
      channelStore.isShowArrange = !channelStore.isShowArrange;
    };

    const removePost = (item: formChannel) => {
      WikiService.deleteWiki(item.id)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.wiki.notify.removePostSuccess'),
            );
            getAllWiki();
            closeModal();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(t('workspace.wiki.notify.removePostFailed'));
        });
    };

    const showPopupDelete = (item: formChannel) => {
      state.showModalConfirm = true;
      state.infoModalConfirm = {
        type: 'confirm',
        title: t('workspace.wiki.popupDelete.title'),
        textOk: t('workspace.wiki.popupDelete.textOk'),
        textCancel: t('global.no'),
        alignFooter: 'right',
        desc: t('workspace.wiki.popupDelete.desc'),
        disabled: false,
        action: () => {
          removePost(item);
        },
      };
    };

    const onOk = () => {
      if (state.infoModalConfirm.type === 'confirm') {
        state.infoModalConfirm.action();
      }
    };
    const dragId = ref(0);
    const onDrag = (value: any) => {
      const item = state.listTask[value?.oldIndex as number] as formChannel;
      dragId.value = Number(item.id);
    };
    return {
      ...toRefs(state),
      onDrag,
      dragId,
      refTaskChannel,
      showModalTask,
      onLoad,
      scrollTargetRef,
      getAllWiki,
      scrollToBottom,
      actionScroll,
      markAsRead,
      closeModal,
      detailTask,
      permissionChannel,
      isShowArrange,
      showArrange,
      showPopupDelete,
      onOk,
      setNewIndexWiki,
      checkPositionView,
      createWiki,
    };
  },
});
</script>

<style lang="scss" scoped>
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

.title-top {
  margin-bottom: 5px;

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

    .q-icon {
      color: #1c8c44;
    }
  }
}

.data-add-task {
  width: 168px;
}

.box-action-wiki {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;

  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #3c3c3c;
    margin-right: 4px;
  }

  .text-primary {
    font-weight: 500;
  }
}

.body-task {
  padding-top: 32px;
}

.tool-tip .text-title {
  font-size: 12px;
  color: #2f2f2f;
}
:deep(.dragging) {
  .my-card {
    border: 2px solid #1c8c44;
  }
}
</style>
