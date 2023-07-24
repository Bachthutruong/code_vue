<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useChannelStore } from 'stores/channel';
import { typeChannel, typeRoute } from 'src/interface/constStatus';
import { maxCount } from 'src/helper/global';

interface IState {
  tab: string | any;
}

export default defineComponent({
  name: 'TabFixedChannel',
  setup() {
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
          show: tabChannel.value !== 'chat' && type !== 'draft',
          value: 'chat',
        },
        {
          name: `${getFirstNameRoute(type)}-task`,
          icon: 'bi-card-heading',
          label: t('workspace.channel.headerFilterChannel.tab.task'),
          count: maxCount(getTotalUnread('task')),
          show: tabChannel.value !== 'task',
          value: 'task',
        },
        {
          name: `${type === 'oneToOne' ? 'channel' : getFirstNameRoute(type)}-wiki`,
          icon: 'bi-calendar3-week',
          label: t('workspace.channel.headerFilterChannel.tab.wiki'),
          count: maxCount(getTotalUnread('wiki')),
          show: tabChannel.value !== 'wiki' && type !== 'oneToOne',
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
        <q-icon
          :name="item.icon"
          size="16px"
        >
        </q-icon>
      </div>
      <q-tooltip
        :offset="[10, 10]"
        max-width="300px"
        max-height="100px"
        anchor="center start"
        self="center end"
        class="tool-tip bg-green-1 text-black shadow-9"
      >
        <span class="text-title">{{ item.label }}</span>
      </q-tooltip>
    </q-tab>
  </q-tabs>
</template>

<style scoped lang="scss">
.tab-header {
  display: flex;
  flex-direction: column;
  padding-bottom: 76px;
  :deep(.q-tabs__content) {
    display: flex;
    flex-direction: column;
  }
}

.q-tab {
  padding: 2px;
  margin-bottom: 16px;
  min-height: 32px;
  width: 38px;
  height: 38px;
  :deep(.q-focus-helper) {
    border-radius: 50% !important;
    bottom: 0;
    right: 0;
  }
}

:deep(.q-tab__content) {
  background-color: #fff;
  border-radius: 50%;
  border: 1px solid #d3d3d3;
  padding: 4px;
  min-width: 36px;
  max-height: 36px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  opacity: 0.6;
}

:deep(.q-tab__content:hover) {
  border: 1px solid var(--primary-03, #66bb69);
  background: #e7f6e9;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  opacity: 1;
  :deep(.q-icon) {
    background-color: #e7f6e9;
  }
}

:deep(.q-tab__indicator) {
  display: none;
}

.tool-tip .text-title {
  font-size: 12px;
  color: #2f2f2f;
}
</style>
