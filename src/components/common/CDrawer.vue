<template>
  <q-drawer
    side="right"
    v-model="drawerRightProfile"
    class="people-drawer"
    bordered
    :width="351"
  >
    <div class="title flex justify-between items-center">
      <span class="title-text">{{ $t('workspace.drawer.profile') }}</span>
      <c-btn
        flat
        round
        den
        class="edit-close"
      >
        <template #default>
          <q-icon
            size="24px"
            name="bi-x-lg"
            @click="closeModal"
          />
        </template>
      </c-btn>
    </div>
    <div class="form-info">
      <div class="w-100">
        <div class="information">
          <div
            v-if="!drawerRightProfileValue?.is_deactive"
            class="information-top"
          >
            <div class="information-avatar flex justify-center">
              <CAvatar
                size="160px"
                :avatar="drawerRightProfileValue?.avatar?.url || ''"
                :text="drawerRightProfileValue?.full_name?.split('')[0] || ''"
              />
            </div>
            <div class="information-name">
              <div class="information-fullName flex justify-between items-center">
                <span class="information-fullName__name"
                  >{{ drawerRightProfileValue?.name }}
                  <span v-if="isOwner">({{ $t('workspace.drawer.you') }})</span>
                </span>
                <span
                  class="information-fullName__edit"
                  @click="showModalProfile"
                  v-if="isOwner"
                  >{{ $t('workspace.drawer.edit') }}</span
                >
              </div>
              <div class="information-role">
                <div class="d-flex">
                  <span class="role-name">{{ $t('workspace.drawer.position') }}: </span>
                  <span class="text-body-regular">
                    {{ drawerRightProfileValue?.position || 'N/A' }}</span
                  >
                </div>
                <div class="d-flex">
                  <span class="role-name">{{ $t('workspace.drawer.department') }}: </span>
                  <span class="text-body-regular">{{
                    drawerRightProfileValue?.department || 'N/A'
                  }}</span>
                </div>
                <div class="d-flex">
                  <span class="role-name">{{ $t('workspace.drawer.location') }}: </span>
                  <span class="text-body-regular">{{
                    drawerRightProfileValue?.location || 'N/A'
                  }}</span>
                </div>
              </div>
              <div
                v-if="!isOwner"
                class="information-sentask"
              >
                <c-btn
                  :label="$t('workspace.drawer.sendTask')"
                  color="primary"
                  outline
                  icon="bi-send"
                  size="small"
                  @click="sendTask"
                >
                </c-btn>
              </div>
              <div
                v-if="!isOwner"
                class="information-sentask"
              >
                <c-btn
                  :label="$t('workspace.drawer.viewCalendar')"
                  color="primary"
                  outline
                  :icon="isShowViewCalendar ? 'bi-incognito' : 'bi-lock-fill'"
                  size="small"
                  :disabled="!isShowViewCalendar"
                  @click="viewCalendar"
                >
                </c-btn>
              </div>

              <div
                v-if="isShowDeactivate"
                @click="showModalDeativate"
                class="information-deactive"
              >
                <c-btn
                  :label="$t('workspace.drawer.deactivate')"
                  outline
                  icon="bi-lock"
                  fontSizeIcon="16"
                  size="small"
                />
              </div>
              <q-separator class="q-mt-lg q-mb-lg" />
            </div>
          </div>
          <div
            v-if="drawerRightProfileValue?.is_deactive"
            class="information-top deactive"
          >
            <div class="information-name">
              <div class="information-fullName flex justify-between items-center">
                <span class="information-fullName__name deactive"
                  >{{
                    drawerRightProfileValue?.full_name ||
                    drawerRightProfileValue?.email ||
                    ''
                  }}
                </span>
              </div>
              <div class="information-name-deactive">
                <q-icon
                  name="bi-lock-fill"
                  size="16px"
                ></q-icon>
                <span>{{ $t('workspace.drawer.deactive') }}</span>
              </div>
              <div
                v-if="actionRoleAdminWs"
                class="information-sentask"
              >
                <c-btn
                  :label="$t('workspace.drawer.activate')"
                  color="primary"
                  outline
                  icon="bi-unlock"
                  size="small"
                  @click="showModalActivate"
                >
                </c-btn>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="!drawerRightProfileValue?.is_deactive"
          class="contact"
        >
          <div class="contact-top flex justify-between items-center">
            <span class="contact-title">{{ $t('workspace.drawer.contact') }}</span>
            <span
              class="contact-edit"
              @click="showModalInformation"
              v-if="isOwner"
              >{{ $t('workspace.drawer.edit') }}</span
            >
          </div>
          <div class="contact-email flex items-center">
            <div class="email-left"><i class="bi-envelope"></i></div>
            <div class="email-right column">
              <span class="email-title">{{ $t('workspace.drawer.emailAddress') }}</span>
              <span class="email-address">{{
                drawerRightProfileValue?.email || ''
              }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="!drawerRightProfileValue?.is_deactive"
          class="phone"
        >
          <div class="phone-desc flex items-center">
            <div class="desc-left"><i class="bi-telephone"></i></div>
            <div class="desc-right column">
              <span class="desc-title">{{ $t('workspace.drawer.phone') }}</span>
              <span
                class="desc-address"
                v-if="!drawerRightProfileValue?.phone"
              >
                {{ 'N/A' }}
              </span>
              <span
                class="desc-address"
                else
              >
                {{ drawerRightProfileValue?.phone || '' }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="isOwner"
        class="sign-out"
      >
        <c-btn
          class="btn-signout"
          @click="signOut"
          :label="$t('workspace.drawer.signOut')"
          color="primary"
        />
        <div class="switch">
          <span>{{ $t('workspace.drawer.anotherAccount') }}</span>
          <span @click="showModalSwitchAccount">{{
            $t('workspace.drawer.switchAccount')
          }}</span>
        </div>
      </div>
    </div>
  </q-drawer>
  <modalEditProfile />
  <modalEditInformation />
  <modalDeactivateUser />
  <modalActivateUser />
  <modalSwitchAccount />
  <modal-calendar-timetable />
</template>

<script lang="ts">
import { defineComponent, computed, watch, defineAsyncComponent } from 'vue';
import { useWorkspaceStore } from 'stores/workspace';
import { useMainStore } from 'stores/main';
import { useRoute, useRouter } from 'vue-router';
import { RoleUSer, RoleWs } from 'src/constants/ConstantUser';
import { useI18n } from 'vue-i18n';
import ModalCalendarTimetable from 'components/calendar/modalCalendarTimetable.vue';

export default defineComponent({
  name: 'c-drawer',
  components: {
    ModalCalendarTimetable,
    modalEditProfile: defineAsyncComponent(
      () => import('components/people/modalEditProfile.vue'),
    ),
    modalEditInformation: defineAsyncComponent(
      () => import('components/people/modalEditInformation.vue'),
    ),
    modalSwitchAccount: defineAsyncComponent(
      () => import('components/people/modalSwitchAccount.vue'),
    ),
    modalDeactivateUser: defineAsyncComponent(
      () => import('components/people/modalDeactivateUser.vue'),
    ),
    modalActivateUser: defineAsyncComponent(
      () => import('components/people/modalActivateUser.vue'),
    ),
  },

  setup() {
    const { t } = useI18n();

    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const route = useRoute();

    const workspaceStore = useWorkspaceStore();

    const showModalProfile = () => {
      workspaceStore.showModalProfile(true);
    };

    const showModalInformation = () => {
      workspaceStore.showModalInformation(true);
    };

    const showModalDeativate = () => {
      workspaceStore.showModalDeativate(true, drawerRightProfileValue.value);
    };

    const showModalActivate = () => {
      workspaceStore.showModalActivate(true, drawerRightProfileValue.value);
    };

    const showModalSwitchAccount = () => {
      workspaceStore.showModalSwitchAccount(true);
    };

    const drawerRightProfile = computed(() => {
      return workspaceStore?.drawerRightProfile;
    });

    const drawerRightProfileValue = computed(() => {
      return {
        ...workspaceStore?.drawerValue,
        name:
          workspaceStore?.drawerValue?.full_name ||
          workspaceStore?.drawerValue?.email ||
          '',
      };
    });

    const roleProfile = computed(() => {
      const role = drawerRightProfileValue.value?.workspace_roles?.[0]?.name as any;
      return RoleWs[role] || RoleWs['MEMBER'];
    });

    watch(infoUser, () => {
      if (drawerRightProfileValue?.value?.id === infoUser?.value?.id) {
        workspaceStore.setDrawerRightProfileValue(infoUser.value);
      }
    });

    // watch(route,() => {
    // closeModal()
    // })

    const closeModal = () => {
      workspaceStore.showDrawerRightProfile(false);
    };

    const router = useRouter();
    const signOut = () => {
      mainStore.logout();
      router.push({
        name: 'login',
      });
      workspaceStore.$reset();
      mainStore.$reset();
      workspaceStore.showDrawerRightProfile(false);
    };

    const roleUser = computed(() => {
      return mainStore.getRole;
    });
    const actionRoleAdmin = computed(() => {
      return roleUser.value === RoleUSer['ADMIN'];
    });
    const actionRoleAdminWs = computed(() => {
      return (
        actionRoleAdmin.value ||
        workspaceStore.workspaceRoleOwner ||
        (workspaceStore.workspaceRoleAdmin && roleProfile.value === RoleWs['MEMBER'])
      );
    });

    const isShowDeactivate = computed(() => {
      return (
        drawerRightProfileValue.value?.id !== infoUser.value?.id &&
        actionRoleAdminWs.value
      );
    });
    const isShowViewCalendar = computed(() => {
      return (
        drawerRightProfileValue.value?.id !== infoUser.value?.id &&
        drawerRightProfileValue.value.can_view_timetable
      );
    });

    const isOwner = computed(() => {
      return drawerRightProfileValue.value?.id === infoUser.value?.id;
    });

    const sendTask = () => {
      workspaceStore.infoSendTask = drawerRightProfileValue.value;
      workspaceStore.createOneToOne = true;
      workspaceStore.showModalAddTask(true);
    };

    const viewCalendar = () => {
      // console.log('viewCalendar');
      workspaceStore.IsShowModalCalendarTimetable = true;
    };
    return {
      isShowDeactivate,
      drawerRightProfile,
      showModalInformation,
      showModalDeativate,
      showModalActivate,
      showModalProfile,
      showModalSwitchAccount,
      drawerRightProfileValue,
      closeModal,
      infoUser,
      signOut,
      actionRoleAdminWs,
      sendTask,
      isOwner,
      isShowViewCalendar,
      viewCalendar,
    };
  },
});
</script>

<style lang="scss" scoped>
:deep(.q-drawer) {
  .people-drawer {
    background: #f8f8f8;

    .q-icon {
      color: #565656;
    }

    .title {
      padding: 4px 8px 0 16px;

      span {
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
      }

      .edit-close {
        padding: 0;
      }
    }

    .form-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      height: calc(100% - 45px);
      //flex-grow: ;
    }
    .information {
      padding-top: 36px;

      .information-top {
        &.deactive {
          padding: 0 24px 24px;

          .information-sentask {
            padding: 24px 0;
          }

          .information-fullName {
            padding: 6px 0 8px 0;
          }
        }

        .information-avatar {
          padding-bottom: 16px;

          .q-avatar {
            width: 160px;
            height: 160px;
          }
        }
      }

      .information-name {
        .information-fullName {
          padding: 6px 24px 0 24px;

          .information-fullName__name {
            color: #2f2f2f;
            font-size: 20px;
            line-height: 28px;
            font-weight: 500;

            .deactive {
              color: #878b87;
            }
          }

          .information-fullName__edit {
            color: #1c8c44;
            font-size: 14px;
            line-height: 20px;
            font-weight: 500;
            cursor: pointer;
          }
        }

        .information-role {
          padding-left: 24px;

          .role-name {
            font-weight: 500;
            padding-right: 4px;
          }

          span {
            color: #565656;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            padding-top: 6px;
          }
        }

        .information-sentask {
          padding: 16px 24px 8px;

          .q-btn {
            width: 100%;
            color: #1c8c44;
          }
          .q-icon {
            color: #1c8c44;
          }
        }
        .information-deactive {
          padding: 16px 24px 8px;

          .q-btn {
            width: 100%;
            color: #f44436;
          }
          .q-icon {
            color: #f44436;
          }
        }

        &-deactive {
          .q-icon {
            color: #e53934;
            margin-right: 8px;
          }

          color: #e53934;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }

    .contact {
      padding-top: 8px;

      .contact-top {
        padding: 0 24px 16px 24px;

        .contact-title {
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
        }

        .contact-edit {
          font-size: 14px;
          line-height: 20px;
          font-weight: 500;
          color: #1c8c44;
          cursor: pointer;
        }
      }

      .contact-email {
        padding: 16px 24px 0;

        .email-left {
          padding-right: 8px;

          i {
            font-size: 14px;
            padding: 10px 11px;
            background: #ffffff;
            border-radius: 50%;
          }
        }

        .email-right {
          font-size: 14px;
          font-weight: 400;

          .email-title {
            color: #565656;
          }

          .email-address {
            color: #1c8c44;
            padding: 8px;
          }
        }
      }
    }

    .phone {
      padding: 16px 24px 0;

      .desc-left {
        padding-right: 8px;

        i {
          font-size: 14px;
          padding: 10px 11px;
          background: #ffffff;
          border-radius: 50%;
        }
      }

      .desc-right {
        font-size: 14px;
        font-weight: 400;

        .desc-title {
          color: #565656;
        }

        .desc-address {
          color: #565656;
          padding: 8px 8px 0px;
        }
      }
    }

    .sign-out {
      //position: fixed;
      //bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      //padding-bottom: 58px;

      .btn-signout {
        width: 319px;
        margin-bottom: 8px;
      }

      .switch {
        font-size: 14px;
        line-height: 20px;

        span:nth-child(1) {
          margin: 0px 0 8px 10px;
        }

        span:nth-child(2) {
          font-weight: 500;
          color: #1c8c44;
          margin: 0 8px 8px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
