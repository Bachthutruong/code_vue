<template>
  <CModal
    v-model="IsShowModal"
    classModal="modal-invite"
    @close="closeModal"
    :title="$t('workspace.channel.createChannel')"
  >
    <q-form
      @submit="createChannel"
      ref="myForm"
    >
      <div class="modal-invite-body">
        <c-text-field
          v-model="name"
          class="pb-2"
          label-slot
          :rules="rulesName"
          :error-message="errorName"
          @keyup.enter="createChannel"
        >
          <template #label>
            {{ $t('workspace.channel.name') }} <span class="label-require">*</span>
          </template>
        </c-text-field>
        <c-text-area
          v-model="description"
          class="pb-2"
          :label="$t('workspace.channel.description')"
          max-length="250"
        />
        <CSelect
          ref="refSelected"
          class="pb-2"
          v-model="selectedMember"
          :label="$t('workspace.channel.addPeopleLabel')"
          input-debounce="500"
          :defaultOptions="options"
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
              size="12px"
              square
              removable
              @remove="removeAtIndexSelected(index)"
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
              <q-item-section side>
                <!--              tinh nang tam thoi skip-->
                <!--              Already in this channel-->
              </q-item-section>
            </q-item>
          </template>
        </CSelect>
      </div>
    </q-form>
    <template #footer>
      <c-btn
        color="primary"
        size="large"
        type="submit"
        :label="$t('workspace.channel.create')"
        :loading="loading"
        @click="createChannel"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch } from 'vue';
import { useChannelStore } from 'stores/channel';
import { useRoute } from 'vue-router';
import CModal from 'components/common/CModal.vue';
import { useI18n } from 'vue-i18n';
import ChannelService from 'src/services/channel';
import NotifyServices from 'src/plugins/NotifyServices';
import { bodyChannel } from 'src/services/channel/model';
import WorkspaceService from 'src/services/workspace';
import { resetValidation, validate } from 'src/helper/global';
export default defineComponent({
  name: 'modalCreateChannel',
  components: { CModal },
  setup() {
    const state = reactive<{
      name: string;
      description?: string;
      selectedMember: any;

      isPrivate: boolean;
      errorName: string;
      loading: boolean;
      options: any;
      search?: string;
      rulesName: Array<any>;
    }>({
      name: '',
      description: '',
      selectedMember: null,
      isPrivate: true,
      errorName: '',
      loading: false,
      options: [],
      search: '',
      rulesName: [(val: string) => !!val || t('global.messages.required')],
    });
    const route = useRoute();
    const { t } = useI18n();
    const refSelected = ref();
    const channelStore = useChannelStore();

    const IsShowModal = computed(() => {
      return channelStore.IsShowModal;
    });
    const resetData = () => {
      resetValidation(myForm.value);
      state.name = '';
      state.description = '';
      state.isPrivate = true;
      state.errorName = '';
      state.loading = false;
      state.selectedMember = null;
    };

    watch(IsShowModal, () => {
      resetData();
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
    const myForm = ref();

    const createChannel = async () => {
      const check = await validate(myForm.value);
      if (!check) return;
      const memberIds = state?.selectedMember?.map((item: any) => item.value) || null;
      const body: bodyChannel = {
        name: state.name,
        description: state.description,
        is_private: state.isPrivate,
        workspace_id: Number(route.params.workspaceId),
        member_ids: memberIds ? [...memberIds] : undefined,
      };
      console.log('body', body);
      ChannelService.createChannel(body)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(t('workspace.notify.createChannel'));
            channelStore.createChannel(res.data);
            // channelStore.getChannelInWs(`${route.params.workspaceId}`);
            closeModal();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(t('workspace.notify.createChannelFailed'));
        });
    };

    const closeModal = () => {
      channelStore.showModalAddChannel(false);
    };
    return {
      ...toRefs(state),
      refSelected,
      IsShowModal,
      myForm,
      closeModal,
      createChannel,
      filterMember,
      removeAtIndexSelected,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.q-item) {
  padding: 0 !important;
  &:hover {
    .q-focus-helper {
      opacity: 0 !important;
    }
  }
  .q-toggle__inner {
    //padding-right: 0;
  }
}
</style>
