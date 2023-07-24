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
      <div class="text-body-regular text-body-role">
        {{ $t('workspace.admin.modalTransfer.body.text1') }}
        <span class="text-h5">{{ infoMember.name }}</span>
        {{ $t('workspace.admin.modalTransfer.body.text2') }}
        <span class="text-h5">{{ detailWorkspace.name }}</span>
      </div>
      <div>
        <q-option-group
          :options="options"
          type="radio"
          v-model="role"
        />
      </div>
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
        :label="$t('global.save')"
        :loading="loading"
        @click="transferAdmin"
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
import { useWorkspaceStore } from 'stores/workspace';
import { changeRoleBody } from 'src/services/workspace/model';
import { RoleWs } from 'src/constants/ConstantUser';

export default defineComponent({
  name: 'modalChangeRoleWs',
  components: { CModal },
  emits: ['reload'],
  setup(props, { emit }) {
    const state = reactive<{
      loading: boolean;
      options: any;
      search?: string;
      role: string;
    }>({
      loading: false,
      options: [],
      search: '',
      role: RoleWs['ADMIN'],
    });
    const route = useRoute();
    const { t } = useI18n();
    const refSelected = ref();
    const workspaceStore = useWorkspaceStore();

    const IsShowModal = computed(() => {
      return workspaceStore.IsShowModalChangeRole;
    });

    const detailWorkspace = computed(() => workspaceStore.detailWorkspace);
    const infoMember = computed(() => workspaceStore.InfoModalDeactivate);

    // getMembers()

    const transferAdmin = () => {
      state.loading = true;
      const memberId = infoMember.value.id;
      const body: changeRoleBody = {
        member_id: Number(memberId),
        workspace_id: Number(route?.params?.workspaceId),
        role: state.role,
      };
      WorkspaceService.changeRole(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.admin.notify.changeRole'));
            emit('reload');
            closeModal();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(t('workspace.admin.notify.changeRoleFailed'));
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const closeModal = () => {
      state.role = RoleWs['ADMIN'];
      workspaceStore.showModalChangeRole(false);
      // RoleWs
    };
    state.options = [
      {
        value: RoleWs['ADMIN'],
        label: t('workspace.admin.modalTransfer.options.adminWs'),
      },
      {
        value: RoleWs['MEMBER'],
        label: t('workspace.admin.modalTransfer.options.member'),
      },
    ];
    return {
      ...toRefs(state),
      refSelected,
      IsShowModal,
      closeModal,
      transferAdmin,
      RoleWs,
      infoMember,
      detailWorkspace,
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
.text-body-role {
  margin-bottom: 16px;
}
.label-section {
  color: #2f2f2f;
}
</style>
