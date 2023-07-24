<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface IState {
  tab: string | any;
}

export default defineComponent({
  name: 'TabFixedOneToOne',
  setup() {
    const { t } = useI18n();

    const route = useRoute();
    const router = useRouter();
    const state = reactive<IState>({
      tab: 'one-to-one-chat',
    });
    const options = computed<Array<{ name: string; icon: string; label: string }>>(() => {
      return [
        {
          name: 'one-to-one-chat',
          icon: 'bi-chat-left-dots',
          label: t('workspace.channel.headerFixedChannel.toolTip.chat'),
        },
        {
          name: 'one-to-one-task',
          icon: 'bi-card-heading',
          label: t('workspace.channel.headerFixedChannel.toolTip.task'),
        },
        // {
        //   name: 'one-to-one-wiki',
        //   icon: 'bi-calendar3-week',
        //   label: t('workspace.channel.headerFixedChannel.toolTip.wiki'),
        // },
      ];
    });
    if (route?.name) {
      state.tab = route.name;
    }
    watch(route, () => {
      if (route?.name) {
        state.tab = route.name;
      }
    });

    const goto = (name: string) => {
      router.push({
        name,
      });
    };
    return {
      ...toRefs(state),
      options,
      goto,
    };
  },
});
</script>

<template>
  <q-tabs
    class="tab-header"
    v-model="tab"
  >
    <q-tab
      v-for="item in options"
      :key="item.name"
      :name="item.name"
      no-caps
      @click="goto(item.name)"
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
        max-height="50px"
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
  padding-bottom: 96px;
  :deep(.q-tabs__content) {
    display: flex;
    flex-direction: column;
  }
}

.q-tab {
  padding: 4px;
  margin-bottom: 16px;
  min-height: 44px;

  :deep(.q-focus-helper) {
    border-radius: 50% !important;
  }
}

:deep(.q-tab__content) {
  background-color: #fff;
  border-radius: 50%;
  padding: 5.5px;
  min-width: 36px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
}

:deep(.q-tab__content:hover) {
  border: 0.5px solid var(--primary-03, #66bb69);
  background: #e7f6e9;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);

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
