<template>
  <HeaderUnreadTask
    title="workspace.draft.title"
    :hasMark="false"
  >
    <template #filter-right>
      <c-btn
        v-if="tab !== 'SENT'"
        @click="handleDelete()"
        :label="labelDelete"
        color="black"
        icon="bi-trash3"
        flat
      />
    </template>
  </HeaderUnreadTask>
  <router-view />
  <CConfirm
    v-model="showPopup"
    :title="infoPopup?.title"
    :textOk="infoPopup?.textOk"
    :textCancel="infoPopup?.textCancel"
    @onOk="infoPopup?.onOk"
    @close="infoPopup?.close"
  >
    {{ infoPopup?.subTitle }}
  </CConfirm>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue';

import HeaderUnreadTask from 'src/components/unread/HeaderUnreadTask.vue';
import { useChannelStore } from 'stores/channel';
import { useRoute, useRouter } from 'vue-router';
import NotifyServices from 'src/plugins/NotifyServices';
import TaskService from 'src/services/task';
import { useI18n } from 'vue-i18n';
import { useMainStore } from 'stores/main';
import WikiService from 'src/services/wiki';

export default defineComponent({
  name: 'draftPage',
  components: {
    HeaderUnreadTask,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();

    const state = reactive<{
      loading: boolean;
      loadingPopup: boolean;
      showPopup: boolean;
      infoPopup: any;
      deleteId: number[];
    }>({
      loading: false,
      loadingPopup: false,
      showPopup: false,
      infoPopup: null,
      deleteId: [],
    });

    const tab = computed(() => route.query?.tab || 'DRAFT');

    const channelStore = useChannelStore();
    const handleDelete = () => {
      state.deleteId = [];
      state.showPopup = true;
      if (route.name === 'draft-task') {
        if (tab.value === 'DRAFT') {
          state.infoPopup = {
            title: t('workspace.draft.popupConfirm.draft.title2'),
            subTitle: t('workspace.draft.popupConfirm.draft.subTitle2'),
            textOk: t('workspace.draft.popupConfirm.textOk'),
            textCancel: t('workspace.draft.popupConfirm.textCancel'),
            onOk: () => deleteDraft(),
            close: () => closeModal(),
          };
        }
        if (tab.value === 'SCHEDULE') {
          state.infoPopup = {
            title: t('workspace.draft.popupConfirm.schedule.title2'),
            subTitle: t('workspace.draft.popupConfirm.schedule.subTitle2'),
            textOk: t('workspace.draft.popupConfirm.textOk'),
            textCancel: t('workspace.draft.popupConfirm.textCancel'),
            onOk: () => deleteScheduled(),
            close: () => closeModal(),
          };
        }
      } else {
        if (tab.value === 'DRAFT') {
          state.infoPopup = {
            title: t('workspace.draft.popupConfirm.draft.title2'),
            subTitle: t('workspace.draft.popupConfirm.draft.subTitle2'),
            textOk: t('workspace.draft.popupConfirm.textOk'),
            textCancel: t('workspace.draft.popupConfirm.textCancel'),
            onOk: () => deleteDraftWiki(),
            close: () => closeModal(),
          };
        }
        if (tab.value === 'SCHEDULE') {
          state.infoPopup = {
            title: t('workspace.draft.popupConfirm.schedule.titleWiki2'),
            subTitle: t('workspace.draft.popupConfirm.schedule.subTitle2Wiki'),
            textOk: t('workspace.draft.popupConfirm.textOk'),
            textCancel: t('workspace.draft.popupConfirm.textCancel'),
            onOk: () => deleteScheduledWiki(),
            close: () => closeModal(),
          };
        }
      }
    };
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });

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
            mainStore.actionReloadSideBar();
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
            mainStore.actionReloadSideBar();
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

    const deleteDraftWiki = () => {
      WikiService.deleteDraft({
        wiki_ids: state.deleteId,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.draft.notify.removeDraftSuccess'),
            );
            closeModal();
            // mainStore.actionReloadSideBar();
            channelStore.totalCountDraftWiki = 0;
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.draft.notify.removeDraftFailed'));
        });
    };
    const deleteScheduledWiki = () => {
      WikiService.deleteScheduled({
        wiki_ids: state.deleteId,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.draft.notify.removeScheduleSuccess'),
            );
            closeModal();
            channelStore.totalCountDraftWiki = 0;
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

    const labelDelete = computed(() => {
      if (route.name === 'draft-task') {
        if (tab.value === 'DRAFT') {
          return t('workspace.draft.popupConfirm.btnDeleteAllDraft');
        } else {
          return t('workspace.draft.popupConfirm.btnDeleteAllSchedule');
        }
      }

      if (route.name === 'draft-wiki') {
        if (tab.value === 'DRAFT') {
          return t('workspace.draft.popupConfirm.btnDeleteAllDraft');
        } else {
          return t('workspace.draft.popupConfirm.btnDeleteAllScheduleWiki');
        }
      }
      return '';
    });
    return {
      ...toRefs(state),
      deleteDraft,
      // popup
      handleDelete,
      tab,
      labelDelete,
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
    border-radius: 8px;
    background: #e7f6e9 !important;
  }

  .box-fixed__icon {
    color: #1c8c44;
  }
}
</style>
