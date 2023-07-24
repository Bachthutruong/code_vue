<template>
  <CModal
    v-model="IsShowModalAddOneToOne"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">{{ $t('workspace.peoples.addPeople') }}</span>
        </div>
      </div>
    </template>
    <div class="modal-invite-body">
      <CSelect
        popup-content-class="select-height selectedItem"
        :reset="key"
        ref="refSelected"
        v-model="selectedMember"
        :label="$t('workspace.channel.addMemberLabel')"
        input-debounce="500"
        :defaultOptions="options"
        :error-message="errorEmail"
        :error="errorSelected && !!errorEmail"
        outlined
        fill-input
        hide-dropdown-icon
        @filter="filterMember"
      >
        <template #selected-item="{ opt }">
          <q-chip
            v-if="selectedMember"
            size="12px"
            square
            removable
            @remove="removeAtIndexSelected()"
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
            <q-item-section class="text-body-regular label-section"
              >{{ opt?.label || '' }}
            </q-item-section>
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
        :disabled="!selectedMember"
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
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import { useChannelStore } from 'stores/channel';
import ChannelService from 'src/services/channel';
import { bodyCreateOneToOne } from 'src/services/channel/model';

export default defineComponent({
  name: 'modalAddOneToOne',
  components: { CModal },
  setup() {
    const state = reactive<{
      key: number;
      title: string;
      selectedMember: any;
      errorEmail: string;
      errorSelected: boolean;
      loading: boolean;
      options: any;
      search?: string;
    }>({
      key: 0,
      title: 'Invite people to ',
      selectedMember: null,
      errorEmail: '',
      errorSelected: false,
      loading: false,
      options: [],
      search: '',
    });
    const route = useRoute();
    const { t } = useI18n();
    const refSelected = ref();
    const channelStore = useChannelStore();

    const IsShowModalAddOneToOne = computed(() => {
      return channelStore.IsShowModalAddOneToOne;
    });

    const removeAtIndexSelected = () => {
      state.selectedMember = null;
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
      WorkspaceService.findAllMemberWorkspace(`${route.params.workspaceId}`, {
        page: 1,
        page_size: 99999,
        search: state.search || '',
      })
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
      const memberIds = state.selectedMember.value;
      const body: bodyCreateOneToOne = {
        workspace_id: Number(route?.params?.workspaceId),
        user_id: memberIds,
      };
      ChannelService.createChannelOneToOne(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.notify.addMemberChannelSuccess'),
            );
            channelStore.getChannelInWs(`${route.params.workspaceId}`);
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(t('workspace.notify.addMemberChannelFailed'));
        })
        .finally(() => {
          state.loading = false;
          closeModal();
        });
    };
    const closeModal = () => {
      state.selectedMember = '';
      state.key += 1;
      channelStore.showModalAddOneToOne(false);
    };
    return {
      ...toRefs(state),
      refSelected,
      IsShowModalAddOneToOne,
      closeModal,
      removeAtIndexSelected,
      getMembers,
      filterMember,
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
