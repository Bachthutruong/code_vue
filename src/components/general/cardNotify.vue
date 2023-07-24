<template>
  <q-card
    v-if="formNotify.show"
    class="notify-card mb-1"
  >
    <q-card-section class="column">
      <div class="logo row items-center">
        <div class="row items-center">
          <img
            class="notify-logo"
            alt="logo"
            src="/logo-beta.svg"
          />
          <div class="notify-desc">TMessage</div>
          <div class="dot"></div>
          <template v-if="typeNotify === 'chat'">
            <q-icon
              class="icon-notify"
              name="bi-chat-left-dots"
              size="12px"
            ></q-icon>
            <span class="text-notify">{{ $t('workspace.notify.chat') }}</span>
          </template>
          <template v-if="typeNotify === 'task'">
            <q-icon
              class="icon-notify"
              name="bi-card-list"
              size="12px"
            ></q-icon>
            <span class="text-notify">{{ $t('workspace.notify.task') }}</span>
          </template>
          <template v-if="typeNotify === 'wiki'">
            <q-icon
              class="icon-notify"
              name="bi-calendar3-week"
              size="12px"
            ></q-icon>
            <span class="text-notify">{{ $t('workspace.notify.wiki') }}</span>
          </template>
        </div>
        <q-space />
        <c-btn
          class="notify-close"
          flat
          round
          dense
          @click="$emit('close')"
        >
          <template #default>
            <q-icon
              size="16px"
              name="bi-x-lg"
            />
          </template>
        </c-btn>
      </div>
      <div
        class="notify-title row items-center"
        @click="actionNotify"
      >
        <div
          v-if="formNotify?.other?.avatar"
          class="notify-title-avatar"
        >
          <CAvatar
            :avatar="formNotify?.other?.avatar"
            size="40px"
          ></CAvatar>
        </div>
        <div>
          <span
            v-if="formNotify?.title?.firstContent"
            class="notify-title__firstcontent"
          >
            {{ formNotify?.title?.firstContent }}</span
          >
          <span
            v-if="formNotify?.title?.name"
            class="notify-title__name"
            >{{ formNotify?.title?.name }}</span
          >
          <span
            v-if="formNotify?.title?.lastContent"
            class="notify-title__lastcontent"
            >{{ formNotify?.title?.lastContent }}</span
          >
          <span
            v-if="formNotify?.title?.project"
            class="notify-title__project"
            >{{ formNotify?.title?.project }}</span
          >
          <span
            v-if="formNotify?.title?.date"
            class="notify-title__date"
            >{{ formatdateToString(formNotify?.title?.date) }}</span
          >
        </div>
      </div>
      <div
        v-if="typeNotify === 'wiki'"
        class="box-topic-wiki text-body text-primary text-ellipsis-2"
      >
        <span>{{ $t('workspace.notify.topic') }}: {{ formNotify?.other?.topic }}</span>
      </div>
      <div
        v-if="formNotify?.content"
        class="card-content"
        @click="actionNotify"
      >
        <div
          class="notify-content"
          :class="{
            'text-ellipsis-2': typeNotify === 'wiki',
            'text-ellipsis-4': typeNotify !== 'wiki',
          }"
        >
          <span v-html="formNotify?.content"></span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { date } from 'quasar';
import { playAudioBuffet } from 'src/plugins/AudioServices';
import {
  typeToChat,
  typeToWikiDetail,
  typeToWikiDetailComment,
} from 'src/constants/ConstantNotify';
import CAvatar from 'components/common/CAvatar.vue';

export default defineComponent({
  name: 'cardNotify',
  components: { CAvatar },
  props: {
    formNotify: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const formatdateToString = (timeStamp: any) => {
      return date.formatDate(timeStamp, 'HH:mm, MMMM DD YYYY');
    };
    const actionNotify = () => {
      props.formNotify.action();
      emit('close');
    };

    const typeNotify = computed(() => {
      if (typeToChat.includes(props.formNotify?.type)) {
        return 'chat';
      }
      if (
        [...typeToWikiDetail, ...typeToWikiDetailComment].includes(props.formNotify?.type)
      ) {
        return 'wiki';
      }
      return 'task';
    });

    const playSound = () => {
      const url = `${location.origin}/sound/messenger-fb.mp3`;
      playAudioBuffet(url);
    };

    onMounted(() => {
      playSound();
      setTimeout(() => {
        emit('close');
      }, 10000);
    });

    return {
      close: false,
      formatdateToString,
      actionNotify,
      playSound,
      typeNotify,
    };
  },
});
</script>
<style lang="scss" scoped>
.notify-card {
  width: 400px;

  .logo {
    //position: relative;
    //padding-top: 8px;

    .notify-logo {
      width: 24px;
      height: 24px;
      padding-right: 4px;
    }

    .notify-desc {
      color: #565656;
      font-size: 12px;
      line-height: 16px;
    }

    .text-notify {
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #565656;
    }
    .icon-notify {
      margin-right: 4px;
      color: #3c3c3c;
    }

    .notify-close {
      font-size: 16px;
      cursor: pointer;

      .q-icon {
        color: #565656;
      }
    }
  }

  .notify-title {
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
    padding: 8px 0;
    flex-wrap: nowrap;
    &-avatar {
      margin-right: 8px;
    }
    .notify-title__firstcontent {
      padding-right: 4px;
    }

    .notify-title__name {
      font-weight: 500;
      padding-right: 4px;
    }

    .notify-title__project {
      font-weight: 500;
      margin: 0 4px;
    }

    .notify-title__date {
      font-weight: 500;
    }
  }

  .card-content {
    padding: 8px;
    background: #f8f8f8;
    border-radius: 4px;

    .notify-content {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #2f2f2f;
      span {
        word-break: break-all;
      }
    }
  }

  .notify-open {
    padding: 20px 0 8px;

    :deep(span.block) {
      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
      color: #1c8c44;
    }
  }
}

.text-ellipsis-4 {
  max-height: 96px;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4; /*số dòng muốn hiện */
}

.text-ellipsis-2 {
  max-height: 96px;
  max-width: 360px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /*số dòng muốn hiện */
}

.dot {
  width: 4px;
  height: 4px;
  background: #565656;
  margin: 0 8px;
  border-radius: 50%;
}

.box-topic-wiki {
  margin-bottom: 8px;
  span {
    word-break: break-all;
  }
}
</style>
