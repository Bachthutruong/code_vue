<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useChannelStore } from 'stores/channel';

interface IState {
  tab: string | any;
}

export default defineComponent({
  name: 'TabHeaderDraft',
  setup() {
    const { t } = useI18n();

    const route = useRoute();
    const router = useRouter();
    const state = reactive<IState>({
      tab: 'draft-task',
    });
    const channelStore = useChannelStore();

    const options = computed<Array<{ name: string; icon: string; label: string }>>(() => {
      return [
        {
          name: 'draft-task',
          icon: 'bi-card-heading',
          label: t('workspace.channel.headerFilterChannel.tab.task'),
          count: channelStore.totalCountDraftTask || 0,
        },
        {
          name: 'draft-wiki',
          icon: 'bi-calendar3-week',
          label: t('workspace.channel.headerFilterChannel.tab.wiki'),
          count: channelStore.totalCountDraftWiki || 0,
        },
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
        ></q-icon>
        <span class="q-tab-item-name">
          {{ item.label }}
        </span>
        <q-badge
          v-if="item.count > 0"
          rounded
          :color="item.name === tab ? 'white' : 'neutral-6'"
          :text-color="item.name === tab ? 'primary' : 'neutral-3'"
          :label="item.count"
        />
      </div>
    </q-tab>
  </q-tabs>
</template>

<style scoped lang="scss">
.tab-header {
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  padding: 8px;

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
      .q-icon {
        color: #565656;
      }

      .q-tab-item-name {
        margin: 0 4px;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
      }

      .q-badge {
        padding: 2px 4px;
      }
    }
  }
}
</style>
