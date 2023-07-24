<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useChannelStore } from 'stores/channel';
import { IChannel } from 'src/model/ChannelDetail';
import { typeChannel, typeRoute } from 'src/interface/constStatus';
import { maxCount } from 'src/helper/global';

export default defineComponent({
  name: 'TabHeaderChannel',
  emits: ['changeTab'],
  setup(props, { emit }) {
    const { t } = useI18n();

    const route = useRoute();
    const router = useRouter();
    const channelStore = useChannelStore();

    const tabChannel = computed({
      get(): typeChannel | '' {
        return channelStore.tabChannel;
      },
      set(val: typeChannel | '') {
        channelStore.tabChannel = val;
      },
    });
    const getFirstNameRoute = (type: typeRoute) => {
      if (type === 'oneToOne') {
        return 'one-to-one';
      }
      if (type === 'channel') {
        return 'channel';
      }
      if (type === 'draft') {
        return 'draft';
      }
      return 'channel';
    };

    const getTotalUnread = (typeChannel: typeChannel) => {
      if (typeChannel === 'chat') {
        return channelStore?.notifyWs?.unreadChats || '0';
      }
      if (typeChannel === 'task') {
        return channelStore?.notifyWs?.unreadTasks || '0';
      }
      if (typeChannel === 'wiki') {
        return channelStore?.notifyWs?.unreadWiki || '0';
      }
      return '0';
    };

    const options = computed<Array<{ name: string; icon: string; label: string }>>(() => {
      const type = route.meta.type as typeRoute;
      const arrayTab = [
        {
          name: `${type === 'draft' ? 'channel' : getFirstNameRoute(type)}-chat`,
          icon: 'bi-chat-left-dots',
          label: t('workspace.channel.headerFilterChannel.tab.chat'),
          count: maxCount(getTotalUnread('chat')),
          show: true,
          value: 'chat',
        },
        {
          name: `${getFirstNameRoute(type)}-task`,
          icon: 'bi-card-heading',
          label: t('workspace.channel.headerFilterChannel.tab.task'),
          count: maxCount(getTotalUnread('task')),
          show: true,
          value: 'task',
        },
        {
          name: `${type === 'oneToOne' ? 'channel' : getFirstNameRoute(type)}-wiki`,
          icon: 'bi-calendar3-week',
          label: t('workspace.channel.headerFilterChannel.tab.wiki'),
          count: maxCount(getTotalUnread('wiki')),
          show: true,
          value: 'wiki',
        },
      ];
      return arrayTab.filter((item: any) => item.show);
    });
    if (route?.name) {
      tabChannel.value = (route.meta.typeChildren as typeChannel) || '';
    }
    watch(route, () => {
      if (route?.name) {
        tabChannel.value = (route.meta.typeChildren as typeChannel) || '';
      }
    });
    onBeforeRouteUpdate(() => {
      emit('changeTab');
    });
    const goto = (item: any) => {
      if (
        (route.meta.type === 'oneToOne' && item.value === 'wiki') ||
        (route.meta.type === 'draft' && item.value === 'chat')
      ) {
        router.push({
          name: item.name,
          params: {
            channelId: channelStore.generalChannel.id,
          },
        });
        return;
      }
      if (route.params.channelId) {
        router.push({
          name: item.name,
        });
      } else {
        router.push({
          name: item.name,
          params: {
            channelId: channelStore.generalChannel.id,
          },
        });
      }
    };
    return {
      // ...toRefs(state),
      tabChannel,
      options,
      goto,
    };
  },
});
</script>

<template>
  <q-tabs
    class="tab-header"
    v-model="tabChannel"
  >
    <q-tab
      v-for="item in options"
      :key="item.name"
      :name="item.value"
      no-caps
      @click="goto(item)"
    >
      <div class="q-tab-item">
        <div class="relative-position d-flex inline-block">
          <q-icon
            :name="item.icon"
            size="16px"
          >
          </q-icon>
          <div
            v-if="item.count !== '0'"
            class="q-tab-dot"
          ></div>
        </div>
        <span class="q-tab-item-name">
          {{ item.label }}
        </span>
      </div>
    </q-tab>
  </q-tabs>
</template>

<style scoped lang="scss">
.tab-header {
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  padding: 6px;
  background: #fff;

  :deep(.q-tabs__content) {
    border-radius: 0;
  }

  .q-tab {
    &:nth-child(2) {
      margin: 0 12px;
    }

    padding: 6px 8px;
    min-height: 28px;
    height: 28px;

    :deep(.q-tab__indicator) {
      display: none;
    }

    :deep(.q-tab__content) {
      height: 100%;
      padding: 0;
    }

    &.q-tab--active {
      background: #1c8c44;
      border-radius: 4px;

      .q-tab-item {
        .q-icon {
          color: #fff;
        }

        .q-tab-item-name {
          color: #fff;
        }
      }
    }

    .q-tab-item {
      display: flex;
      align-items: center;

      .q-icon {
        color: #565656;
      }
      .q-tab-dot {
        background: #f44436;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        position: absolute;
        z-index: 1;
        right: -4px;
        top: 0;
      }

      .q-tab-item-name {
        position: relative;
        margin: 0 4px;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #2f2f2f;
      }

      .q-badge {
        padding: 2px 4px;
      }
    }
  }
}
</style>
