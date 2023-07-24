<template>
  <c-modal
    v-model="isShow"
    class-modal="modal-edit-field"
    @close="closeModal"
  >
    <template #title>
      <div class="text-h4 text-neutral-1">{{ title }}</div>
    </template>
    <div class="modal-content">
      <div class="label-role">{{ label }}</div>
      <q-option-group
        :options="listRoleChannel"
        type="radio"
        v-model="valueBinding"
        color="primary"
      />
      <CSelect
        v-if="valueBinding === 'SPECIFIC'"
        v-model="selectedMember"
        :label="$t('workspace.channel.addMemberLabel')"
        input-debounce="500"
        :defaultOptions="options"
        :error="!!errors?.member"
        :error-message="errors?.member"
        multiple
        outlined
        fill-input
        use-input
        hide-dropdown-icon
        popup-content-class="select-height selectedItem"
        @filter="filterMember"
      >
        <template #selected-item="{ opt, index }">
          <q-chip
            class="chip-selected"
            size="13px"
            square
            removable
            @remove="removeAtIndexSelected(index)"
          >
            <CAvatar
              size="22px"
              :avatar="opt?.avatar?.url"
              :text="opt?.label?.split('')[0]"
            ></CAvatar>
            <span>{{ opt.label }}</span>
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
        type="submit"
        :label="textOk"
        :loading="loading"
        @click="onOk"
      />
    </template>
  </c-modal>
</template>

<script lang="ts">
import { computed, reactive, toRefs } from 'vue';
import { RoleChannel } from 'src/constants/ConstantChannelDetail';
import NotifyServices from 'src/plugins/NotifyServices';
import { useI18n } from 'vue-i18n';
import ChannelService from 'src/services/channel';
import { useChannelStore } from 'stores/channel';
import { useRoute } from 'vue-router';
import { roleChannel } from 'src/model/ChannelDetail';
import { bodySetRole } from 'src/services/channel/model';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
  ON_OK = 'onOk',
  UPDATE_TEXT = 'update:text',
}

export default {
  name: 'ModalSetRoleField',

  components: {},

  emits: [EEmitFunc.UPDATE_VALUE, EEmitFunc.ON_OK, EEmitFunc.UPDATE_TEXT],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Title',
    },
    label: {
      type: String,
      default: 'label',
    },
    textOk: {
      type: String,
      default: 'OK',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: any, { emit }: { emit: any }) {
    const { t } = useI18n();
    const channelStore = useChannelStore();

    const route = useRoute();
    const channelId = route?.params?.channelId as string;
    // const isShow = computed({
    //   get: () => {
    //     return props.value;
    //   },
    //   set: (val) => {
    //     emit(EEmitFunc.UPDATE_VALUE, val);
    //   },
    // });

    // const valueBinding = computed({
    //   get: () => {
    //     return props.roleInfo?.type;
    //   },
    //   set: (val) => {
    //     emit(EEmitFunc.UPDATE_TEXT, val);
    //   },
    // });
    const listRoleChannel = computed(() => Object.values(RoleChannel));

    const state = reactive<{
      selectedMember: any;
      loading: boolean;
      options: any;
      search?: string;
      valueBinding?: string;
      isShow: boolean;
      roleInfo: roleChannel;
      errors: any;
    }>({
      selectedMember: null,
      loading: false,
      options: [],
      search: '',
      valueBinding: '',
      isShow: false,
      roleInfo: {
        id: 0,
        name: '',
        type: 'EVERYONE',
      },
      errors: null,
    });
    const removeAtIndexSelected = (index: number | string) => {
      if (index >= 0) state.selectedMember.splice(index, 1);
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
      channelStore
        .getAllMemberChannel(`${route?.params?.channelId}`, {
          page: 1,
          page_size: 99999,
          search: state.search,
        })
        .then((res: any) => {
          state.options = [];
          res?.data?.map((item: any) => {
            state.options.push({
              ...item,
              value: item.id,
              label: item.full_name || item.email || '',
            });
            return item;
          });
        })
        .catch((err) => {
          console.log('err', err);
          NotifyServices.showMessageError(t('workspace.notify.getPeopleFailed'));
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const getDetailRole = (roleId: string) => {
      return new Promise((resolve, reject) => {
        ChannelService.getDetailOneRoleChannel(channelId, roleId)
          .then((res: any) => {
            console.log(res);
            if (res?.status_code === 200) {
              state.selectedMember = [];
              res?.data?.members?.map((item: any) => {
                state.selectedMember.push({
                  ...item,
                  value: item.id,
                  label: item.full_name || item.email || '',
                });
                return item;
              });
              resolve(res);
            } else {
              reject(false);
            }
          })
          .catch(() => {
            reject(false);
          });
      });
    };
    const showModal = (roleInfo: roleChannel) => {
      state.valueBinding = roleInfo.type;
      state.roleInfo = roleInfo;
      state.selectedMember = [];
      if (state.valueBinding === 'SPECIFIC') {
        getDetailRole(`${roleInfo.id}`).finally(() => {
          state.isShow = true;
        });
      } else {
        state.isShow = true;
      }
    };

    const closeModal = () => {
      state.isShow = false;
    };

    const onOk = () => {
      const memberIds = state.selectedMember.map((item: any) => item.value);
      if (state.valueBinding === 'SPECIFIC' && memberIds?.length === 0) {
        state.errors = {
          member: t('workspace.channel.modalChannelDetail.roleChannel.notifyErrorMember'),
        };
        return;
      }
      state.errors = null;
      const body = {
        type: state.valueBinding,
        member_ids: [...memberIds],
      } as bodySetRole;
      ChannelService.setDetailOneRoleChannel(channelId, `${state.roleInfo.id}`, body)
        .then((res: any) => {
          console.log(res);
          if (res?.status_code === 200) {
            emit(EEmitFunc.ON_OK, res.data);
          }
        })
        .finally(() => closeModal());
    };

    return {
      ...toRefs(state),
      closeModal,
      onOk,
      listRoleChannel,
      filterMember,
      removeAtIndexSelected,
      showModal,
    };
  },
};
</script>

<style scoped lang="scss">
.label-role {
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #3c3c3c;
  margin-bottom: 16px;
}

:deep(.q-radio) {
  margin-bottom: 16px;

  .q-radio__inner {
    font-size: 24px;
    margin-right: 10px;

    .q-radio__bg {
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
  }

  .q-radio__label {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
  }
}
</style>
