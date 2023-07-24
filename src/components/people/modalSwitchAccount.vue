<template>
  <CModal
    v-model="IsShowModalSwitchAccount"
    classModal="modal-invite"
    :show-footer="false"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header text-h4">
        <span class="text-header-title">{{
          $t('workspace.peoples.modalSwitch.title')
        }}</span>
      </div>
    </template>
    <div class="modal-switch-body">
      <div class="switch-account">
        <div class="avatar">
          <CAvatar
            size="64px"
            :avatar="infoUser?.avatar?.url"
            :text="
              infoUser?.full_name?.split('')[0] || infoUser?.email?.split('')[0] || ''
            "
          />
        </div>
        <div class="infomation">
          <span class="infomation-name">{{
            infoUser?.full_name || infoUser?.email || ''
          }}</span>
          <span class="infomation-mail">{{ infoUser?.email || '' }}</span>
        </div>
      </div>

      <q-separator color="#E9EAE8" />

      <div class="switch-another">
        <div
          v-for="user in listUser"
          :key="user.id"
        >
          <div
            v-if="user.id !== infoUser?.id"
            @click="switchAccount(user)"
            class="account-another"
          >
            <div class="avatar">
              <CAvatar
                size="48px"
                :avatar="user?.avatar?.url"
                :text="user?.full_name?.split('')[0] || user?.email?.split('')[0] || ''"
              />
            </div>
            <div class="infomation">
              <span class="infomation-name">{{
                user?.full_name || user?.email || ''
              }}</span>
              <span class="infomation-mail">{{ user?.email || '' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="add-account">
        <c-btn
          icon="bi-person-gear"
          :label="$t('workspace.peoples.modalSwitch.addAnotherAccount')"
          @click="logout"
        />
      </div>
    </div>

    <!--    <template #footer>-->
    <!--      <c-btn-->
    <!--        :disabled="listUser?.length < 2"-->
    <!--        color="primary"-->
    <!--        size="large"-->
    <!--        :label="$t('workspace.peoples.modalSwitch.switch')"-->
    <!--        @click="switchAccount"-->
    <!--      />-->
    <!--    </template>-->
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import CModal from 'components/common/CModal.vue';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'modalSwitch',
  components: { CModal },
  setup() {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const { t } = useI18n();
    const router = useRouter();
    const workspaceStore = useWorkspaceStore();
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });

    const IsShowModalSwitchAccount = computed(() => {
      return workspaceStore.IsShowModalSwitchAccount;
    });

    const closeModal = () => {
      workspaceStore.showModalSwitchAccount(false);
    };

    const logout = () => {
      mainStore.logout();
      mainStore.$reset();
      workspaceStore.$reset();
      router.push({ name: 'login' });
    };

    const listUser = computed(() => {
      return mainStore.listUser;
    });

    const switchAccount = (user: any) => {
      mainStore
        .refreshToken(user?.token?.refresh_token)
        .then(() => {
          workspaceStore.checkWorkspaceWithLogin();
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          closeModal();
        });
    };
    return {
      closeModal,
      IsShowModalSwitchAccount,
      detailWorkspace,
      infoUser,
      logout,
      listUser,
      switchAccount,
    };
  },
});
</script>

<style lang="scss" scoped>
.switch {
  width: 640px;
}
.modal-switch-body {
  .switch-account {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-bottom: 16px;
    .avatar {
      padding: 8px 12px 8px 16px;
    }

    .infomation {
      display: flex;
      flex-direction: column;
      color: #2f2f2f;

      .infomation-name {
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
      }

      .infomation-mail {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .switch-another {
    overflow-y: auto;
    max-height: 270px;
    width: 616px;
  }
  .account-another {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 0 8px;
    cursor: pointer;
    .avatar {
      padding: 8px 16px 8px 32px;
    }

    .infomation {
      display: flex;
      flex-direction: column;
      color: #2f2f2f;

      .infomation-name {
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
      }

      .infomation-mail {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }

  .add-account {
    padding-bottom: 24px;

    .q-btn {
      background: #e7f6e9;
      height: 64px;
      width: 100%;

      :deep(.q-icon) {
        color: #1c8c44;
        font-size: 28px;
      }
      :deep(.block) {
        color: #1c8c44;
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
        padding-left: 16px;
      }

      :deep(.q-btn__content) {
        display: flex;
        justify-content: flex-start;
        padding-left: 26px;
      }
    }
  }
}
</style>
