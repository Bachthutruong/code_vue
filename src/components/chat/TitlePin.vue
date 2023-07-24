<template>
  <div class="box-action-task">
    <div v-if="emoji">
      <img :src="emoji" />
    </div>
    <div class="box-action-task-text">
      <div v-if="!getInfoTask">
        <span>{{ $t('workspace.chat.titlePin.content', { count: countPin }) }}</span>
        <span
          class="text-primary text-bold cursor-pointer"
          @click="action"
          >{{ $t('workspace.chat.titlePin.click') }}</span
        >
        <span>{{ $t('workspace.chat.titlePin.lastContent') }}</span>
      </div>
      <div v-if="getInfoTask?.type === 'pinTask'">
        <span>{{ getInfoTask?.actorName }}</span>
        <span>{{
          getInfoTask?.pinChat
            ? $t('workspace.chat.titlePin.contentPin')
            : $t('workspace.chat.titlePin.contentUnPin')
        }}</span>
      </div>
      <div v-if="getInfoTask?.type === 'pollVote'">
        <span v-if="getInfoTask?.typePoll === actionSocket['NEW_POLL']">
          {{ $t('workspace.chat.titlePoll.content', { name: nameActor }) }}
        </span>
        <span v-if="getInfoTask?.typePoll === actionSocket['CHANGE_VOTE_POLL']">
          {{ $t('workspace.chat.titlePoll.contentChangeVote', { name: nameActor }) }}
        </span>
        <span v-if="getInfoTask?.typePoll === actionSocket['VOTE_POLL']">
          {{ $t('workspace.chat.titlePoll.contentVote', { name: nameActor }) }}
        </span>
        <span v-if="getInfoTask?.typePoll === actionSocket['NEW_ANSWER_POLL']">
          {{ $t('workspace.chat.titlePoll.contentNewAnswer', { name: nameActor }) }}
        </span>

        <span v-if="getInfoTask?.typePoll === actionSocket['CLOSE_POLL']">
          {{ $t('workspace.chat.titlePoll.contentClosePoll.firstContent') }}
        </span>
        <span
          v-if="
            [actionSocket['PIN_POLL'], actionSocket['UNPIN_POLL']].includes(
              getInfoTask?.typePoll,
            )
          "
        >
          {{
            $t(`workspace.chat.titlePoll.${pinPollContent}.firstContent`, {
              name: nameActor,
            })
          }}
        </span>

        <span class="strong">"{{ getInfoTask?.other?.poll?.title || '' }}"</span>

        <span
          v-if="
            [actionSocket['PIN_POLL'], actionSocket['UNPIN_POLL']].includes(
              getInfoTask?.typePoll,
            )
          "
        >
          {{ $t(`workspace.chat.titlePoll.${pinPollContent}.lastContent`) }}
        </span>
        <span v-if="getInfoTask?.typePoll === actionSocket['CLOSE_POLL']">
          {{ $t('workspace.chat.titlePoll.contentClosePoll.lastContent') }}
        </span>
        <span
          v-if="
            ![actionSocket['PIN_POLL'], actionSocket['UNPIN_POLL']].includes(
              getInfoTask?.typePoll,
            )
          "
          class="cursor-pointer action-title"
          @click="action"
        >
          {{ $t('workspace.chat.titlePoll.viewPoll') }}
        </span>
      </div>
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
  name: 'TitlePinChat',
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

    const listActionPin = [actionSocket['PIN_POLL'], actionSocket['PIN_MESSAGE']];
    const listActionUnPin = [actionSocket['UNPIN_POLL'], actionSocket['UNPIN_MESSAGE']];
    const getInfoTask = computed(() => {
      if (props.infoTask) {
        const dataTask = props.infoTask;
        return {
          ...dataTask,
          isSend: dataTask?.user?.id === infoUser.value?.id,
          actorName: dataTask?.user?.full_name || dataTask?.user?.email || '',
          pinChat: listActionPin.includes(dataTask?.other?.type),
          type: dataTask.type,
          typePoll: dataTask.typePoll,
          typeActivity: dataTask?.other?.type,
        };
      }
      return null;
    });

    const nameActor = computed(() => {
      return getInfoTask.value?.isSend
        ? t('workspace.chat.titlePoll.you')
        : getInfoTask.value?.actorName;
    });

    const pinPollContent = computed(() =>
      getInfoTask.value?.typePoll === actionSocket['PIN_POLL']
        ? 'contentPinPoll'
        : 'contentUnpinPoll',
    );
    const action = () => {
      emit('action');
    };

    const emoji = computed(() => {
      if (!props?.infoTask || listActionPin.includes(getInfoTask.value?.typeActivity)) {
        return emojiPin;
      }
      if (listActionUnPin.includes(getInfoTask.value?.typeActivity)) {
        return emojiUnPin;
      }
      if (
        [...listActionPin, ...listActionUnPin].includes(getInfoTask.value?.typeActivity)
      ) {
        return emojiPin;
      }
      return null;
    });
    return {
      getInfoTask,
      emoji,
      action,
      nameActor,
      pinPollContent,
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

    .strong {
      margin: 0 4px;
      font-weight: 500;
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
