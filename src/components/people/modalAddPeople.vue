<template>
  <CModal
    v-model="IsShowModalAddPeople"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">{{ $t('workspace.peoples.addPeople') }}</span>
        </div>
        <div class="text-body-regular text-header-name">
          #{{ channelDetail?.name || '' }}
        </div>
      </div>
    </template>
    <div class="modal-invite-body">
      <!--       :label="$t('workspace.peoples.labelAddPeople')"-->
      <CSelect
        ref="refSelected"
        v-model="selectedMember"
        :label="$t('workspace.channel.addMemberLabel')"
        input-debounce="500"
        :defaultOptions="options"
        multiple
        outlined
        fill-input
        use-input
        hide-dropdown-icon
        popup-content-class="select-height selectedItem"
        @filter="filterMember"
      >
        <template #selected-item="{ opt, index }">
          <q-chip
            size="12px"
            square
            removable
            @remove="removeAtIndexSelected(index)"
            >{{ opt.label }}
          </q-chip>
        </template>
        <template #option="{ opt, selected, toggleOption }">
          <q-item
            clickable
            :active="selected"
            active-class="active-item-selected"
            @click="toggleOption(opt)"
          >
            <q-item-section avatar>
              <CAvatar
                size="32px"
                :avatar="opt?.avatar?.url"
                :text="opt?.label?.split('')[0] || 'A'"
              ></CAvatar>
            </q-item-section>
            <q-item-section class="text-body-regular label-section">{{
              opt?.label || ''
            }}</q-item-section>
            <q-item-section side>
              <!--              tinh nang tam thoi skip-->
              <!--              Already in this channel-->
            </q-item-section>
          </q-item>
        </template>
      </CSelect>
    </div>
    <template #footer>
      <c-btn
        color="primary"
        size="large"
        :label="$t('workspace.peoples.add')"
        :loading="loading"
        :disabled="!selectedMember?.length"
        @click="addMember"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import CModal from 'components/common/CModal.vue';
import { useI18n } from 'vue-i18n';
import NotifyServices from 'src/plugins/NotifyServices';
import { useChannelStore } from 'stores/channel';
import ChannelService from 'src/services/channel';
import { bodyAddMember } from 'src/services/channel/model';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';

export default defineComponent({
  name: 'modalAddPeople',
  components: { CModal },
  setup() {
    const state = reactive<{
      title: string;
      selectedMember: any;
      loading: boolean;
      options: any;
      search?: string;
    }>({
      title: 'Invite people to ',
      selectedMember: null,
      loading: false,
      options: [],
      search: '',
    });
    const route = useRoute();
    const { t } = useI18n();
    const refSelected = ref();
    const channelStore = useChannelStore();
    const workspaceStore = useWorkspaceStore();
    const mainStore = useMainStore();
    const channelDetail = computed(() => {
      return channelStore.detailChanel;
    });
    const IsShowModalAddPeople = computed(() => {
      return channelStore.IsShowModalAddPeople;
    });

    const removeAtIndexSelected = (index: number | string) => {
      if (index >= 0) state.selectedMember.splice(index, 1);
    };

    const filterMember = (val?: string, update?: any) => {
      if (val === '') {
        update(() => {
          getMembers('');
        });
        return;
      }
      update(() => {
        getMembers(val);
      });
    };
    const getMembers = (searchMember?: string) => {
      state.search = searchMember;
      workspaceStore
        .getMembers(state.search)
        .then((res: any) => {
          if (res?.status_code === 200) {
            state.options = [];
            res?.data?.data.map((item: any) => {
              state.options.push({
                ...item,
                value: item.id,
                label: item.full_name || item.email || '',
              });
              return item;
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.notify.getPeopleFailed'));
        })
        .finally(() => {
          state.loading = false;
        });
    };
    // getMembers()

    const addMember = () => {
      state.loading = true;
      const memberIds = state.selectedMember.map((item: any) => item.value);
      const body: bodyAddMember = {
        member_ids: [...memberIds],
        channel_id: Number(route?.params?.channelId),
      };
      ChannelService.addMemberChannel(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.notify.addMemberChannelSuccess'),
            );
            mainStore.actionReloadAllPage();
            closeModal();
            // channelStore
            //   .getAllMemberChannel(`${route?.params?.channelId}`, {
            //     page: 1,
            //     page_size: 99999,
            //   })
            //   .finally(() => {
            //     closeModal();
            //   });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(t('workspace.notify.addMemberChannelFailed'));
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const closeModal = () => {
      state.selectedMember = null;
      channelStore.showModalAddPeople(false);
    };
    return {
      ...toRefs(state),
      refSelected,
      IsShowModalAddPeople,
      closeModal,
      removeAtIndexSelected,
      getMembers,
      filterMember,
      channelDetail,
      addMember,
    };
  },
});
</script>

<style scoped lang="scss">
.text-header {
  &-title {
    color: #2f2f2f;
  }

  &-name {
    color: #878b87;
  }
}

.q-chip {
  background: #e9eae8;
}

.label-section {
  color: #2f2f2f;
}
</style>
