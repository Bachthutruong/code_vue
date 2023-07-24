<template>
  <c-text-field
    v-model="keyWordSearch"
    @update:model-value="onSearch"
    :label="mapI18n('memberTab.labelSearch')"
    prepend-icon="bi-search"
    debounce="500"
  />
  <c-btn
    v-if="permissionAddOrRemoveUsers"
    class="q-mb-lg"
    :label="$t('workspace.channel.addPeople')"
    color="primary"
    outline
    icon="bi-person-add"
    size="small"
    @click="showModalAddMember"
  />
  <div
    class="member-list"
    :class="{ 'is-loading': loadingMemberData }"
  >
    <div
      v-if="loadingMemberData"
      class="member-list--loading"
    >
      <q-linear-progress
        size="2px"
        indeterminate
      />
    </div>
    <div
      class="member-item q-px-md q-py-sm"
      v-for="(item, index) in memberDataDisplay"
      :key="index"
    >
      <CAvatar
        size="48px"
        :avatar="item.avatar?.url"
        :text="item?.full_name?.split('')[0] || item.email?.split('')[0] || ''"
      />
      <div class="member-item__info q-pl-md">
        <p class="member-item__name">
          {{ item.full_name || item.email }}
          <span v-if="item.id === currentUserId">(You)</span>
          <span v-else-if="item.id === channelOwnerId">(Owner)</span>
        </p>
        <p class="member-item__position">
          <q-icon name="bi-briefcase" />
          {{ item?.position || 'Member' }}
        </p>
      </div>
      <c-btn
        v-if="permissionAddOrRemoveUsers && item.id !== channelOwnerId && !generalChannel"
        :label="$t('global.remove')"
        color="#565656"
        flat
        @click="onShowModalConfirmRemove(item)"
      />
    </div>
  </div>
  <c-confirm
    v-model="showModalConfirmRemove"
    :title="mapI18n('memberTab.titleRemoveMember')"
    :text-ok="mapI18n('memberTab.confirmRemove')"
    :text-cancel="$t('global.no')"
    :loading="loadingRemoveMember"
    @on-ok="onRemoveMember"
  >
    <div>{{ mapI18n('memberTab.descRemoveMember') }}</div>
  </c-confirm>
</template>

<script lang="ts">
import { computed, reactive, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useChannelStore } from 'stores/channel';
import { useMainStore } from 'stores/main';
import { IMember } from 'src/model/ChannelDetail';
import { useRoute } from 'vue-router';
import CConfirm from 'components/common/CConfirm.vue';
import { mapI18nMessage } from 'src/helper/global';
import NotifyServices from 'src/plugins/NotifyServices';
import { useWorkspaceStore } from 'stores/workspace';

interface IState {
  keyWordSearch: string;
  showModalConfirmRemove: boolean;
  memberRemoveData: IMember | null;
  loadingRemoveMember: boolean;
  loadingMemberData: boolean;
  memberData: IMember[] | null;
}

export default {
  name: 'MemberTab',
  components: { CConfirm },
  setup() {
    const i18n = useI18n();
    const mapI18n = (path: string): string => {
      return i18n.t(`workspace.channel.modalChannelDetail.${path}`);
    };

    const route = useRoute();
    const channelId = Number(route?.params?.channelId);

    const channelStore = useChannelStore();
    const mainStore = useMainStore();
    const workspaceStore = useWorkspaceStore();

    const memberDataInStore = computed((): IMember[] => channelStore.listMemberChannel);

    const currentUserId = computed(() => mainStore.getUser?.id);
    const channelOwnerId = computed(() => channelStore.channelOwnerId);
    const generalChannel = computed(() => channelStore.generalChannel?.id === channelId);
    const workspaceOwnerId = computed(() => workspaceStore.workspaceOwnerId);
    const permissionChannel = computed(() => channelStore.getRolePermissionChannel);

    const permissionAddOrRemoveUsers = computed(() => {
      console.log(permissionChannel.value?.['AddOrRemoveUsers']);
      return !!permissionChannel.value?.['AddOrRemoveUsers'];
      // workspaceStore.workspaceRoleOwner ||
      // workspaceStore.workspaceRoleAdmin ||
      // channelOwnerId.value === currentUserId.value
    });
    const messageConfirmRemove = computed(() =>
      mapI18nMessage('confirmRemove', [
        state.memberRemoveData?.full_name || state.memberRemoveData?.email || '',
      ]),
    );

    const state = reactive<IState>({
      keyWordSearch: '',
      showModalConfirmRemove: false,
      memberRemoveData: null,
      loadingRemoveMember: false,
      loadingMemberData: false,
      memberData: null,
    });

    const memberDataDisplay = computed(() => state.memberData || memberDataInStore.value);

    const showModalAddMember = () => {
      if (state.loadingMemberData) return;
      channelStore.showModalAddPeople(true);
    };

    const onShowModalConfirmRemove = (member: IMember) => {
      state.memberRemoveData = member;
      state.showModalConfirmRemove = true;
    };

    const reloadMemberData = () => {
      state.loadingMemberData = true;
      channelStore
        .getAllMemberChannel(`${route?.params?.channelId}`, {
          page: 1,
          page_size: 99999,
        })
        .finally(() => {
          state.loadingMemberData = false;
        });
    };

    const onRemoveMember = () => {
      if (!state.memberRemoveData) return;
      state.loadingRemoveMember = true;
      channelStore
        .removeMembers(channelId, [state.memberRemoveData.id])
        .then(() => {
          const message = mapI18nMessage('removeSuccess', [
            state.memberRemoveData?.full_name || state.memberRemoveData?.email || '',
          ]);
          NotifyServices.showMessageSuccess(message);
          state.showModalConfirmRemove = false;
          state.memberRemoveData = null;
          reloadMemberData();
        })
        .finally(() => {
          state.loadingRemoveMember = false;
        });
    };

    const onSearch = (val: string) => {
      state.loadingMemberData = true;
      channelStore
        .searchMemberChannel(channelId.toString(), {
          page: 1,
          page_size: 99999,
          search: val,
        })
        .then((res: any) => {
          state.memberData = res.data;
        })
        .finally(() => {
          state.loadingMemberData = false;
        });
    };

    watch(memberDataInStore, () => {
      onSearch(state.keyWordSearch);
    });

    return {
      ...toRefs(state),
      mapI18n,
      showModalAddMember,
      currentUserId,
      onShowModalConfirmRemove,
      messageConfirmRemove,
      onRemoveMember,
      channelOwnerId,
      workspaceOwnerId,
      permissionAddOrRemoveUsers,
      memberDataDisplay,
      onSearch,
      generalChannel,
    };
  },
};
</script>

<style lang="scss" scoped>
.member {
  &-list {
    max-height: 500px;
    overflow: auto;
    position: relative;
    &--loading {
      position: absolute;
      width: 100%;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    &__info {
      flex: 1;
    }
    &__name {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #2f2f2f;
      margin-bottom: 4px;
    }
    &__position {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: #878b87;
      margin-bottom: 0;
    }
  }
}
.is-loading {
  .member-item {
    opacity: 0.5;
  }
}
</style>
