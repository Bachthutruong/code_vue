<template>
  <div class="box-action-task">
    <div>
      <img :src="emoji" />
    </div>
    <div class="box-action-task-text">
      <template v-if="!getInfoTask">
        <span>{{ $t('workspace.channel.titlePin.content', { count: countPin }) }}</span>
        <span
          class="text-primary text-bold cursor-pointer"
          @click="action"
          >{{ $t('workspace.channel.titlePin.click') }}</span
        >
        <span>{{ $t('workspace.channel.titlePin.lastContent') }}</span>
      </template>
      <template v-if="getInfoTask">
        <span>{{ getInfoTask?.actorName }}</span>
        <span>{{
          getInfoTask?.pinTask
            ? $t('workspace.channel.titlePin.contentPin')
            : $t('workspace.channel.titlePin.contentUnPin')
        }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import emojiPin from 'assets/emoji/emoji_pushpin.svg';
import emojiUnPin from 'assets/emoji/emoji_unpin.svg';
import { useMainStore } from 'stores/main';
import { actionSocket } from 'src/services/socket';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'TitlePin',
  computed: {
    actionSocket() {
      return actionSocket;
    },
  },
  props: {
    infoTask: {
      type: Object,
      default() {
        return null;
      },
    },
    countPin: {
      type: [Number, String],
      default: 0,
    },
  },
  emits: ['action'],
  setup(props, { emit }) {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const { t } = useI18n();

    const getInfoTask = computed(() => {
      if (props.infoTask) {
        const dataTask = props.infoTask;
        return {
          ...dataTask,
          actorName: dataTask?.actor?.full_name || dataTask?.actor?.email || '',
          pinTask: dataTask.type === 'PIN_TASK',
        };
      }
      return null;
    });

    const action = () => {
      emit('action');
    };

    const emoji = computed(() => {
      if (!props?.infoTask || getInfoTask.value?.pinTask) {
        return emojiPin;
      }
      if (!getInfoTask.value?.pinTask) {
        return emojiUnPin;
      }
      return emojiPin;
    });
    return {
      getInfoTask,
      emoji,
      action,
    };
  },
  data() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.box-action-task {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 4px 0;

  &-text {
    margin-left: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: #3c3c3c;

    span {
      margin-right: 4px;
    }
  }

  .action-title {
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #1c8c44;
    margin-left: 6px;
  }
}
</style>
