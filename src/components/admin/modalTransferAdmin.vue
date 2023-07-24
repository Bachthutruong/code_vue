<template>
  <CModal
    v-model="IsShowModal"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">{{
            $t('workspace.admin.modalTransfer.title')
          }}</span>
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
        outlined
        use-input
        hide-dropdown-icon
        popup-content-class="select-height selectedItem"
        @filter="filterMember"
      >
        <template #selected-item="{ opt }">
          <q-chip
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
            <q-item-section class="text-body-regular label-section">{{
              opt?.label || ''
            }}</q-item-section>
          </q-item>
        </template>
      </CSelect>
    </div>
    <template #footer>
      <c-btn
        color="primary"
        size="large"
        outline
        :label="$t('global.cancel')"
        @click="closeModal"
      />
      <c-btn
        color="primary"
        size="large"
        :label="$t('workspace.admin.transfer')"
        :loading="loading"
        :disabled="!selectedMember"
        @click="transferAdmin"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CModal from 'components/common/CModal.vue';
import { useI18n } from 'vue-i18n';
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import { useWorkspaceStore } from 'stores/workspace';
import { bodyRole } from 'src/services/workspace/model';

export default defineComponent({
  name: 'modalTransferAdmin',
  components: { CModal },
  emits: ['reload'],
  setup(props, { emit }) {
    const state = reactive<{
      selectedMember: any;
      loading: boolean;
      options: any;
      search?: string;
    }>({
      selectedMember: null,
      loading: false,
      options: [],
      search: '',
    });
    const route = useRoute();
    const router = useRouter();

    const { t } = useI18n();
    const refSelected = ref();
    const workspaceStore = useWorkspaceStore();

    const IsShowModal = computed(() => {
      return workspaceStore.IsShowModalTransfer;
    });

    const resetData = () => {
      state.selectedMember = null;
      state.search = '';
    };
    watch(IsShowModal, () => {
      resetData();
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

    const transferAdmin = () => {
      state.loading = true;
      const memberId = state.selectedMember?.id;
      const body: bodyRole = {
        member_id: Number(memberId),
        workspace_id: Number(route?.params?.workspaceId),
      };
      WorkspaceService.transferAdmin(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.admin.notify.transferAdmin'));
            closeModal();
            router.push({
              name: 'workspace-detail',
              params: {
                workspaceId: route.params.workspaceId,
              },
            });
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.admin.notify.transferAdminFailed'),
          );
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const closeModal = () => {
      state.selectedMember = null;
      workspaceStore.showModalTransferAdmin(false);
    };
    return {
      ...toRefs(state),
      refSelected,
      IsShowModal,
      closeModal,
      removeAtIndexSelected,
      getMembers,
      filterMember,
      transferAdmin,
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
