<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useChannelStore } from 'stores/channel';
import { useRoute } from 'vue-router';
import { ChannelRoleName } from 'src/constants/ConstantChannelDetail';

interface IState {
  keyWordSearch: string;
}

export default defineComponent({
  name: 'ModalForwardChat',
  emits: ['sendChat'],
  props: {
    listForwardChat: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const mapI18n = (path: string): string => {
      return t(`workspace.chat.modalForward.${path}`);
    };
    const route = useRoute();

    const IsShowModalForwardChat = computed(() => {
      return channelStore.IsShowModalForwardChat;
    });

    const closeModal = () => {
      channelStore.IsShowModalForwardChat = false;
    };
    const state = reactive<IState>({
      keyWordSearch: '',
    });

    const channelStore = useChannelStore();
    const channelId = computed(() => channelStore?.detailChanel?.id);
    const listChannel = computed(() => {
      const channel = channelStore.listChannel.map((item: any) => {
        return {
          ...item,
          label: `#${item.name}` || '',
          value: item.id || '',
          type: 'channel',
          disable: props?.listForwardChat?.includes(item.id),
          showChannel: item.roles.find(
            (itemRole: any) => itemRole.name === ChannelRoleName['CREATE_CHAT'],
          ),
        };
      });
      const member = channelStore.listOneToOne.map((item: any) => {
        return {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.name}` || '',
          value: item.id || '',
          type: 'member',
          disable: props?.listForwardChat?.includes(item.id),
          showChannel: true,
        };
      });
      const result = [...member, ...channel];
      const needle = state.keyWordSearch.toLowerCase();
      return result.filter((v: any) => {
        return (
          v.label.toLowerCase().indexOf(needle) > -1 &&
          v.value !== channelId.value &&
          v.showChannel
        );
      });
    });
    const onSearch = (text: string) => {
      state.keyWordSearch = text || '';
    };

    const sendChat = (item: any) => {
      emit('sendChat', item.value);
    };
    return {
      ...toRefs(state),
      mapI18n,
      onSearch,
      listChannel,
      IsShowModalForwardChat,
      closeModal,
      sendChat,
    };
  },
});
</script>

<template>
  <CModal
    v-model="IsShowModalForwardChat"
    classModal="modal-task-channel modal-invite "
    alignFooter="right"
    @close="closeModal"
    :title="mapI18n('title')"
  >
    <c-text-field
      v-model="keyWordSearch"
      @update:model-value="onSearch"
      :placeholder="mapI18n('labelSearch')"
      prepend-icon="bi-search"
      debounce="500"
    />
    <div class="chanel-list">
      <q-list>
        <q-item
          v-for="opt in listChannel"
          :key="opt.value"
          :clickable="false"
        >
          <q-item-section
            avatar
            v-if="opt.type === 'member'"
          >
            <CAvatar
              size="32px"
              :avatar="opt?.img"
              :text="opt?.label?.split('')[0] || 'A'"
            ></CAvatar>
          </q-item-section>
          <q-item-section class="text-body-regular text-neutral-1 ellipsis label-opt"
            >{{ opt?.label || '' }}
          </q-item-section>
          <q-item-section side>
            <c-btn
              :label="opt.disable ? $t('global.sent') : $t('global.send')"
              color="primary"
              size="small"
              :disable="opt.disable"
              @click="sendChat(opt)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <template #footer>
      <c-btn
        size="large"
        color="primary"
        :label="$t('global.done')"
        @click="closeModal"
      />
    </template>
  </CModal>
</template>

<style scoped lang="scss">
.chanel-list {
  height: calc(100vh - 400px);
  overflow-y: scroll;

  .q-item__section--avatar {
    min-width: 32px;
  }

  .q-item {
    padding: 8px 0;
  }

  .label-opt {
  }
}
</style>
