<template>
  <div class="main flex items-center">
    <div class="main-img">
      <img
        src="~assets/t-message/welcome.svg"
        alt=""
      />
    </div>
    <div class="main-content">
      <div class="content-top">
        {{ $t('workspace.notify.welcomeChannel.welcomeTo') }}
        <span
          >{{ channelDetail?.type === 'ONE_TO_ONE' ? '' : '#'
          }}{{ channelDetail?.name }}</span
        >
        {{
          channelDetail?.type === 'ONE_TO_ONE'
            ? $t('workspace.notify.welcomeChannel.typeOneToOne')
            : $t('workspace.notify.welcomeChannel.typeChannel')
        }}
      </div>
      <div class="content-bottom">
        <div v-if="channelDetail?.type === 'ONE_TO_ONE'">
          {{ $t('workspace.notify.welcomeChannel.oneToOne.content') }}
          <span>{{ channelDetail?.name }}</span>
          {{ $t('workspace.notify.welcomeChannel.oneToOne.lastContent') }}
        </div>

        <div v-else>
          {{ $t('workspace.notify.welcomeChannel.channel.content') }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useChannelStore } from 'stores/channel';
export default defineComponent({
  name: 'WelcomeChannel',
  props: {
    typeChannel: {
      type: String,
      default: '',
    },
  },
  setup() {
    const channelStore = useChannelStore();

    const channelDetail = computed(() => {
      return channelStore.detailChanel;
    });
    return {
      channelDetail,
    };
  },
});
</script>
<style scoped lang="scss">
.main {
  padding: 24px 0 12px 32px;
  .main-img {
    padding-right: 15px;
    img {
      width: 48px;
      height: 48px;
    }
  }

  .main-content {
    .content-top {
      font-size: 16px;
      line-height: 24px;
      font-weight: 500;
      color: #2f2f2f;

      span {
        color: #1c8c44;
      }
    }

    .content-bottom {
      font-size: 14px;
      line-height: 20px;
      color: #565656;
      span {
        font-weight: 500;
      }
    }
  }
}
</style>
