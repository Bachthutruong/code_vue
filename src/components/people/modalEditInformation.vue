<template>
  <CModal
    v-model="IsShowModalInformation"
    classModal="modal-invite"
    @close="closeModal"
    alignFooter="center"
  >
    <template #title>
      <div class="text-h4 text-header">
        <span class="text-header-title">{{ $t('workspace.information.title') }}</span>
      </div>
    </template>
    <div class="modal-invite-body">
      <c-text-field
        class="q-pb-lg"
        disable
        :model-value="infoUser.email"
        :label="$t('workspace.information.email')"
      />
      <c-text-field
        :rules="rulePhone"
        :error-message="errorPhone"
        :error="errorSelected && !!errorPhone"
        class="pb-1"
        v-model.trim="phone"
        :label="$t('workspace.information.phone')"
        :loading="false"
        @keyup="keyupValue"
        @new-value="createValue"
      />
    </div>
    <template #footer>
      <c-btn
        label="Cancel"
        color="primary"
        outline
        size="large"
        @click="closeModal"
      />
      <c-btn
        :disabled="!checkPhone(phone)"
        color="primary"
        size="large"
        label="Save changes"
        @click="editProfile"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, watch, toRefs } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import CModal from 'components/common/CModal.vue';
import { useI18n } from 'vue-i18n';
import { bodyProfile } from 'src/services/user/model';
import UserService from 'src/services/user';
import NotifyServices from 'src/plugins/NotifyServices';
import { useMainStore } from 'stores/main';
import { checkPhone } from 'src/helper/validForm';

export default defineComponent({
  name: 'modalInformation',
  components: { CModal },
  setup() {
    const mainStore = useMainStore();
    const { t } = useI18n();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const state = reactive<{
      name: string;
      phone: string;
      position: string;
      rulePhone: any[];
      selectedInfor: any;
      errorPhone: string;
      errorSelected: boolean;
    }>({
      name: infoUser?.value?.full_name || '',
      phone: infoUser?.value?.phone || '',
      position: infoUser.value?.position,
      rulePhone: [(val: string) => checkPhone(val) || t('valid.phone')],
      selectedInfor: null,
      errorPhone: '',
      errorSelected: false,
    });
    watch(infoUser, () => {
      state.name = infoUser.value?.full_name || '';
      state.phone = infoUser.value?.phone || '';
      state.position = infoUser.value?.position || '';
    });

    const refSelected = ref();
    const workspaceStore = useWorkspaceStore();
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    const IsShowModalInformation = computed(() => {
      return workspaceStore.IsShowModalInformation;
    });

    const editProfile = () => {
      const body: bodyProfile = {
        full_name: state.name?.trim() || '',
        phone: state.phone?.trim() || '',
        position: state.position?.trim() || '',
      };
      UserService.editProfile(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.editInformation'));
            mainStore.getInfoUser();
            mainStore.actionReloadAllPage();
            closeModal();
          } else {
            state.errorSelected = true;
            state.errorPhone = res?.errors.phone;
            NotifyServices.showMessageError(res?.errors.phone);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(err?.message);
        });
    };

    const closeModal = () => {
      workspaceStore.showModalInformation(false);
    };

    return {
      ...toRefs(state),
      refSelected,
      detailWorkspace,
      IsShowModalInformation,
      closeModal,
      editProfile,
      infoUser,
      checkPhone,
    };
  },
});
</script>

<style scoped lang="scss">
.avatar-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.q-card__actions {
  .q-btn:nth-child(1) {
    margin-right: 12px;
  }
  .q-btn:nth-child(2) {
    margin-left: 12px;
  }
}
</style>
