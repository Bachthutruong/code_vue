<template>
  <CModal
    v-model="IsShowModalActivate"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">{{ $t('workspace.activate.title') }}</span>
        </div>
      </div>
    </template>
    <div class="modal-invite-body">
      <span>{{ $t('workspace.activate.content') }}</span>
    </div>
    <template #footer>
      <c-btn
        color="primary"
        size="large"
        outline
        :label="$t('workspace.activate.btnNo')"
        @click="closeModal"
      />
      <c-btn
        color="primary"
        size="large"
        :label="$t('workspace.activate.btnYes')"
        @click="activateMember"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import CModal from 'components/common/CModal.vue';
import { useWorkspaceStore } from 'stores/workspace';
import { bodyDeactivate } from 'src/services/workspace/model';
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import { useRoute } from 'vue-router';
import { useMainStore } from 'stores/main';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'modalActivateUser',
  components: { CModal },
  setup() {
    const route = useRoute();

    const workspaceStore = useWorkspaceStore();

    const IsShowModalActivate = computed(() => {
      return workspaceStore.IsShowModalActivate;
    });
    const InfoModalDeactivate = computed(() => {
      return workspaceStore.InfoModalDeactivate;
    });
    const mainStore = useMainStore();
    const { t } = useI18n();

    const activateMember = () => {
      const body: bodyDeactivate = {
        workspace_id: Number(route?.params?.workspaceId) || 0,
        user_id: Number(InfoModalDeactivate?.value?.id) || 0,
      };
      WorkspaceService.activateMember(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.notify.activateMemberSuccess'),
            );
            workspaceStore.drawerValue = {
              ...workspaceStore?.drawerValue,
              is_deactive: false,
            };
            mainStore.actionReloadAllPage();
            closeModal();
          } else {
            NotifyServices.showMessageError('workspace.notify.activateMemberFailed');
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(err?.message);
        });
    };
    const closeModal = () => {
      workspaceStore.showModalActivate(false);
    };
    return {
      closeModal,
      IsShowModalActivate,
      activateMember,
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
  padding: 0 0 48px;
  li {
    font-size: 16px;
    line-height: 24px;
    color: #2f2f2f;
  }
}
</style>
