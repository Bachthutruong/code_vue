<template>
  <CModal
    v-model="IsShowModalDeactivate"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">{{ $t('workspace.deativate.title') }}</span>
        </div>
      </div>
    </template>
    <div class="modal-invite-body">
      <li>{{ $t('workspace.deativate.contentLine1') }}</li>
      <li>{{ $t('workspace.deativate.contentLine2') }}</li>
    </div>
    <template #footer>
      <c-btn
        color="red"
        size="large"
        outline
        :label="$t('workspace.deativate.btnNo')"
        @click="closeModal"
      />
      <c-btn
        color="red"
        size="large"
        :label="$t('workspace.deativate.btnYes')"
        @click="deactivateMember"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, watch } from 'vue';
import CModal from 'components/common/CModal.vue';
import { useI18n } from 'vue-i18n';
import { useWorkspaceStore } from 'stores/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import { bodyDeactivate } from 'src/services/workspace/model';
import WorkspaceService from 'src/services/workspace';
import { useMainStore } from 'stores/main';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'modalDeactivateUser',
  components: { CModal },
  emits: ['reload'],
  setup(props, { emit }) {
    const route = useRoute();
    const mainStore = useMainStore();

    const workspaceStore = useWorkspaceStore();

    const { t } = useI18n();
    const IsShowModalDeactivate = computed(() => {
      return workspaceStore.IsShowModalDeativate;
    });
    const InfoModalDeactivate = computed(() => {
      return workspaceStore.InfoModalDeactivate;
    });

    const deactivateMember = () => {
      const body: bodyDeactivate = {
        workspace_id: Number(route?.params?.workspaceId) || 0,
        user_id: Number(InfoModalDeactivate?.value?.id) || 0,
      };
      WorkspaceService.deactivateMember(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.notify.deactivateMemberSuccess'),
            );
            mainStore.actionReloadAllPage();
            workspaceStore.drawerValue = {
              ...workspaceStore?.drawerValue,
              is_deactive: true,
            };
            emit('reload');
            closeModal();
          } else {
            NotifyServices.showMessageError('workspace.notify.deactivateMemberFailed');
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(err?.message);
        });
    };
    const closeModal = () => {
      workspaceStore.showModalDeativate(false, null);
    };
    return {
      closeModal,
      IsShowModalDeactivate,
      deactivateMember,
      InfoModalDeactivate,
    };
  },
});
</script>

<style scoped lang="scss">
.q-card__actions {
  .q-btn:nth-child(1) {
    margin-right: 12px;
  }
  .q-btn:nth-child(2) {
    margin-left: 12px;
  }
}
.modal-invite-body {
  padding: 0 24px 48px;
  li {
    font-size: 16px;
    line-height: 24px;
    color: #2f2f2f;
  }
}
</style>
