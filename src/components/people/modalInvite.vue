<template>
  <CModal
    v-model="IsShowModalInvite"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header text-h4">
        <span class="text-header-title">{{ title }}</span>
        <span class="text-header-name">{{ detailWorkspace?.name || '' }}</span>
      </div>
    </template>
    <div class="modal-invite-body">
      <CSelect
        ref="refSelected"
        v-model="selectedMember"
        label="To (name@email.com)"
        input-debounce="0"
        :error-message="errorEmail"
        :error="errorSelected && !!errorEmail"
        multiple
        use-input
        outlined
        hide-dropdown-icon
        :loading="false"
        @keyup="keyupValue"
        @new-value="createValue"
      >
        <template #selected-item="{ opt, index }">
          <q-chip
            size="12px"
            square
            removable
            @remove="removeAtIndexSelected(index)"
            >{{ opt }}</q-chip
          >
        </template>
      </CSelect>
    </div>

    <template #footer>
      <c-btn
        color="primary"
        size="large"
        label="Send"
        :loading="loading"
        @click="sendEmailInvite"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import CModal from 'components/common/CModal.vue';
import { checkEmail } from 'src/helper/validForm';
import { useI18n } from 'vue-i18n';
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
export default defineComponent({
  name: 'modalInvite',
  components: { CModal },
  setup() {
    const state = reactive<{
      title: string;
      selectedMember: any;
      errorEmail: string;
      errorSelected: boolean;
      loading: boolean;
      keyup: string;
    }>({
      title: 'Invite people to ',
      selectedMember: null,
      errorEmail: '',
      errorSelected: false,
      loading: false,
      keyup: '',
    });
    const { t } = useI18n();
    const refSelected = ref();
    const workspaceStore = useWorkspaceStore();
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    const IsShowModalInvite = computed(() => {
      return workspaceStore.IsShowModalInvite;
    });

    watch(IsShowModalInvite, () => {
      resetData();
    });
    const keyupValue = (event: any) => {
      state.keyup = event.target.value || '';
    };
    const checkValue = (val: any) => {
      const modelValue = (state.selectedMember || []).slice();
      state.errorSelected = false;
      val
        .split(/[,;|]+/)
        .map((v: any) => v.trim())
        .filter((v: any) => v.length > 0)
        .forEach((v: any) => {
          if (modelValue.includes(v) === false) {
            if (checkEmail(v)) {
              modelValue.push(v);
              state.errorEmail = '';
            } else {
              state.errorSelected = true;
              state.errorEmail = t('valid.email');
            }
          }
        });
      state.selectedMember = modelValue;
    };
    const createValue = (val: any, done: any) => {
      if (val.length > 0) {
        checkValue(val);
        done(val, 'add-unique');
      }
    };
    const sendEmailInvite = () => {
      if (!state?.selectedMember?.length) {
        if (state.keyup) {
          checkValue(state.keyup);
        } else {
          state.errorSelected = true;
          state.errorEmail = t('valid.email');
          return;
        }
      }
      if (state.errorSelected) return;
      state.loading = true;
      WorkspaceService.inviteWorkspace({
        emails: [...state.selectedMember],
        workspace_id: Number(detailWorkspace.value.id),
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.invitePeopleSuccess'));
            closeModal();
            // emit('get-file', res?.data);
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(t('workspace.notify.invitePeopleFailed'));
        })
        .finally(() => {
          state.loading = false;
          state.keyup = '';
        });
    };
    const removeAtIndexSelected = (index: number | string) => {
      if (index >= 0) state.selectedMember.splice(index, 1);
      // refSelected.value.removeAtIndex(index)
    };

    const resetData = () => {
      state.keyup = '';
      state.selectedMember = null;
      state.errorSelected = false;
      state.errorEmail = '';
    };
    const closeModal = () => {
      resetData();
      workspaceStore.showModalInvite(false);
    };
    return {
      ...toRefs(state),
      refSelected,
      detailWorkspace,
      IsShowModalInvite,
      closeModal,
      createValue,
      removeAtIndexSelected,
      sendEmailInvite,
      checkValue,
      keyupValue,
    };
  },
});
</script>

<style scoped lang="scss">
.text-header {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /*số dòng muốn hiện */
}

.q-chip {
  background: #e9eae8;
}
</style>
