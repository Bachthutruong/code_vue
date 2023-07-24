<template>
  <CModal
    v-model="IsShowModalProfile"
    classModal="modal-invite"
    @close="closeModal"
    alignFooter="center"
  >
    <template #title>
      <div class="text-h4 text-header">
        <span class="text-header-title">{{ $t('workspace.profile.title') }}</span>
      </div>
    </template>
    <div class="modal-invite-body">
      <div class="avatar-upload pb-2">
        <div class="create-avatar q-pb-sm">
          <CAvatar
            size="128px"
            :avatar="thumbnailUrl || upload"
          />
        </div>
        <div class="create-upload">
          <C-upload
            borderless
            accept=".jpg, image/*"
            :uploadPrivate="true"
            @get-file-before="uploadImg"
          >
            <template #action="{ handleUpload }">
              <c-btn
                :label="$t('workspace.profile.changeavatar')"
                icon="bi-upload"
                flat
                size="small"
                @click="handleUpload"
              />
            </template>
          </C-upload>
        </div>
      </div>
      <c-text-field
        class="q-pb-lg"
        outlined
        :label="$t('workspace.profile.name')"
        v-model="formModel.name"
        color="green-6"
      />
      <c-text-field
        class="pb-1"
        outlined
        :label="$t('workspace.profile.position')"
        v-model="formModel.position"
        color="green-6"
      />
      <c-text-field
        class="pb-1"
        outlined
        :label="$t('workspace.drawer.department')"
        v-model="formModel.department"
        color="green-6"
      />
      <c-text-field
        class="pb-1"
        outlined
        :label="$t('workspace.drawer.location')"
        v-model="formModel.location"
        color="green-6"
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
        color="primary"
        size="large"
        @click="submit"
        label="Save changes"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import CModal from 'components/common/CModal.vue';
import { useI18n } from 'vue-i18n';
import UserService from 'src/services/user';
import NotifyServices from 'src/plugins/NotifyServices';
// import { useRouter } from 'vue-router';
import { bodyProfile } from 'src/services/user/model';
import { checkData } from 'src/helper/global.js';
import { useMainStore } from 'stores/main';
import upload from 'assets/default/upload.svg';
interface formEditProfile {
  name: string;
  phone?: string;
  position?: string;
  department?: string;
  location?: string;
}
export default defineComponent({
  name: 'modalProfile',
  components: { CModal },
  setup() {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const state = reactive<{
      formModel: formEditProfile;
      file: any | null;
      thumbnailUrl: string;
    }>({
      formModel: {
        name: infoUser.value?.full_name || '',
        phone: infoUser.value?.phone || '',
        position: infoUser.value?.position || '',
        department: infoUser.value?.department || '',
        location: infoUser.value?.location || '',
      },
      file: null,
      thumbnailUrl: infoUser.value?.avatar?.url || '',
    });
    watch(infoUser, () => {
      state.formModel.name = infoUser.value?.full_name;
      state.thumbnailUrl = infoUser.value?.avatar?.url;
      state.formModel.phone = infoUser.value?.phone || '';
      state.formModel.position = infoUser.value?.position || '';
      state.formModel.department = infoUser.value?.department || '';
      state.formModel.location = infoUser.value?.location || '';
    });
    const { t } = useI18n();
    // const router = useRouter();
    const refSelected = ref();
    const workspaceStore = useWorkspaceStore();
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    const IsShowModalProfile = computed(() => {
      console.log('infoUser.value', infoUser.value);

      return workspaceStore.IsShowModalProfile;
    });

    const uploadImg = (file: any) => {
      state.file = file;
      state.thumbnailUrl = URL.createObjectURL(file);
    };

    const upLoadAvatar = () => {
      if (!state.file) return;
      let payload: any = new FormData();
      payload.set('avatar', state.file);
      UserService.editAvatarProfile(payload)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.editProfileSuccess'));
            closeModal();
          } else {
            NotifyServices.showMessageError('workspace.notify.editProfileFailed');
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(err?.message);
        });
    };

    const editProfile = () => {
      if (!checkData(state.formModel, ['name'])) return;
      const body: bodyProfile = {
        full_name: state.formModel.name.trim() || '',
        phone: state.formModel?.phone?.trim() || '',
        position: state.formModel?.position?.trim() || '',
        department: state.formModel?.department?.trim() || '',
        location: state.formModel?.location?.trim() || '',
      };
      UserService.editProfile(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.editProfileSuccess'));
            mainStore.getInfoUser();
            mainStore.actionReloadAllPage();
            closeModal();
          } else {
            NotifyServices.showMessageError('workspace.notify.editProfileFailed');
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(err?.message);
        });
    };

    const submit = () => {
      editProfile();
      upLoadAvatar();
    };
    const closeModal = () => {
      workspaceStore.showModalProfile(false);
    };
    return {
      ...toRefs(state),
      refSelected,
      detailWorkspace,
      IsShowModalProfile,
      closeModal,
      uploadImg,
      upLoadAvatar,
      editProfile,
      submit,
      upload,
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

.c-btn {
  background: #f8f8f8;
  color: #565656;
}
</style>
