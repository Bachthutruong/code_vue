<template>
  <CModal
    v-model="IsShowModalDetailChannel"
    @close="closeModal"
    :title="`#${channelDetail?.name}`"
    classModal="modal-channel-detail"
    alignFooter="left"
  >
    <q-tabs
      v-model="tab"
      dense
      indicator-color="primary"
      align="justify"
      narrow-indicator
      class="q-tabs__custom"
    >
      <q-tab
        v-for="item in tabList"
        :key="item.value"
        :name="item.value"
        :label="item.label"
      />
      <c-btn
        v-if="!isOwner && channelDetail.type !== 'GENERAL'"
        class="c-btn-custom"
        label="Leave channel"
        color="#565656"
        icon="bi-box-arrow-in-right"
        flat
        @click="onShowConfirmLeaveChannel"
      />
    </q-tabs>
    <q-tab-panels
      v-model="tab"
      animated
      class="q-tab-panels__custom"
    >
      <q-tab-panel
        name="about"
        class="q-tab-panel__about"
      >
        <about-tab :loadingFilesInChannel="loadingFiles" />
      </q-tab-panel>
      <q-tab-panel
        name="member"
        class="q-tab-panel__member"
      >
        <member-tab />
      </q-tab-panel>
      <q-tab-panel
        name="roles"
        class="q-tab-panel__about"
      >
        <roles-tab />
      </q-tab-panel>
    </q-tab-panels>
  </CModal>
  <c-confirm
    v-model="showConfirmLeaveChannel"
    :title="mapI18n('leaveChannel.title')"
    :text-ok="mapI18n('leaveChannel.confirmLeave')"
    :text-cancel="$t('global.no')"
    :loading="loadingLeaveChannel"
    @on-ok="onLeaveChannel()"
  >
    <div class="text-neutral-1">
      <li>{{ mapI18n('leaveChannel.subTitle') }}</li>
      <li>{{ mapI18n('leaveChannel.subTitle2', [countTaskDraftSchedule]) }}</li>
    </div>
  </c-confirm>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import AboutTab from 'components/channel/ModalChannelDetailComponents/AboutTab.vue';
import MemberTab from 'components/channel/ModalChannelDetailComponents/MemberTab.vue';
import RolesTab from 'components/channel/ModalChannelDetailComponents/RolesTab.vue';
import { useI18n } from 'vue-i18n';
import CConfirm from 'components/common/CConfirm.vue';
import { useChannelStore } from 'stores/channel';
import { IChannel } from 'src/model/ChannelDetail';
import { useRoute, useRouter } from 'vue-router';
import NotifyServices from 'src/plugins/NotifyServices';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';

interface IState {
  tab: string;
  showConfirmLeaveChannel: boolean;
  loadingLeaveChannel: boolean;
  loadingFiles: boolean;
}

export default defineComponent({
  components: { CConfirm, MemberTab, AboutTab, RolesTab },

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    const i18n = useI18n();
    const state = reactive<IState>({
      tab: 'about',
      showConfirmLeaveChannel: false,
      loadingLeaveChannel: false,
      loadingFiles: false,
    });
    const channelStore = useChannelStore();
    const mainStore = useMainStore();
    const route = useRoute();
    const router = useRouter();
    const channelId = computed(() => {
      return Number(route?.params?.channelId);
    });
    const countTaskDraftSchedule = computed(() => {
      return channelStore?.detailChanel?.draft_schedule_count || 0;
    });

    const IsShowModalDetailChannel = computed({
      get(): boolean {
        return channelStore.IsShowModalDetailChannel;
      },
      set(value: boolean) {
        channelStore.IsShowModalDetailChannel = value;
      },
    });

    const closeModal = () => {
      state.tab = 'about';
      channelStore.IsShowModalDetailChannel = false;
    };
    const getFilesInChannel = () => {
      state.loadingFiles = true;
      channelStore
        .getFilesInChanel(channelId.value, {
          page: 1,
          page_size: 99999,
        })
        .finally(() => {
          state.loadingFiles = false;
        });
    };
    getFilesInChannel();

    const channelDetail = computed((): IChannel | null => {
      return channelStore.detailChanel;
    });
    const isOwner = computed((): boolean => {
      return channelStore.isOwner;
    });

    const workspaceStore = useWorkspaceStore();

    const roleAdminWeb = computed(() => {
      return mainStore.roleAdminWeb;
    });
    const actionRoleAdminWs = computed(() => {
      return (
        roleAdminWeb.value ||
        workspaceStore.workspaceRoleOwner ||
        workspaceStore.workspaceRoleAdmin
      );
    });

    const tabList = computed(() => {
      const list = [
        { label: 'About', value: 'about' },
        { label: 'Member', value: 'member' },
      ] as Array<{ label: string; value: string }>;
      if (isOwner.value || actionRoleAdminWs.value) {
        list.push({ label: 'Set role', value: 'roles' });
      }
      return list;
    });
    const onShowConfirmLeaveChannel = () => {
      state.showConfirmLeaveChannel = true;
    };

    const onReload = () => {
      const general: IChannel = channelStore.generalChannel;
      console.log('general', general);
      router
        .push({
          name: 'channel-detail',
          params: {
            channelId: general.id,
          },
        })
        .then(() => {
          mainStore.actionReloadAllPage();
        });
    };

    const onLeaveChannel = () => {
      state.loadingLeaveChannel = true;
      channelStore
        .leaveChannel(channelId.value)
        .then(() => {
          const message = mapI18n('massages.leaveSuccess', [
            channelDetail.value?.name || '',
          ]);
          NotifyServices.showMessageSuccess(message);
          onReload();
        })
        .finally(() => {
          state.loadingLeaveChannel = false;
          state.showConfirmLeaveChannel = false;
        });
    };

    const mapI18n = (path: string, params: (string | number)[] = []) => {
      return i18n.t(`workspace.channel.modalChannelDetail.${path}`, params);
    };
    return {
      ...toRefs(state),
      tabList,
      onLeaveChannel,
      onShowConfirmLeaveChannel,
      mapI18n,
      closeModal,
      channelDetail,
      countTaskDraftSchedule,
      isOwner,
      actionRoleAdminWs,
      IsShowModalDetailChannel,
    };
  },
});
</script>

<style lang="scss" scoped>
.tabs-edit {
  width: 100%;
  border-radius: 16px;

  .text-label {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
  }

  .text-value-channel {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
  }

  .text-edit {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: #1c8c44;
  }

  .position-item {
    margin-top: 24px;
  }
}

.q-tabs__custom {
  padding: 0 12px;
  position: relative;

  .q-tab {
    flex: 0 0 auto;
    padding: 0 12px;

    :deep(.q-tab__label) {
      font-size: 18px;
      font-weight: 400;
      color: #878b87;
    }

    &.q-tab--active {
      :deep(.q-tab__label) {
        color: #3c3c3c;
      }
    }

    :deep(.q-tab__indicator) {
      border-radius: 3px 3px 0 0;
    }
  }
}

.q-tab-panels__custom {
  // padding-bottom: 24px;
}

.q-tab-panel__about {
  padding: 24px;
  background: #f8f8f8;
  height: calc(100vh - 296px) !important;
  overflow-y: auto;
}

.q-tab-panel__member {
  padding: 24px;
  height: calc(100vh - 296px) !important;
  overflow-y: auto;
}

.c-btn-custom {
  position: absolute;
  right: 0;
}
</style>
