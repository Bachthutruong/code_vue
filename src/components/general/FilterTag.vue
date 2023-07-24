<script lang="ts">
import { computed, defineComponent, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { date } from 'quasar';
import { useI18n } from 'vue-i18n';
import { ListPriority, ListReadTask } from 'src/constants/ConstantFilter';
import { useChannelStore } from 'stores/channel';

export default defineComponent({
  name: 'FilterTag',
  props: {
    date: {
      type: [Object, String],
      default() {
        return null;
      },
    },
    hiddenField: {
      type: Array,
      default() {
        return [];
      },
    },
    listStatus: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: ['removeFilter'],
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();

    const { t } = useI18n();

    /*  const state = reactive<{
      // dateTime: string
    }>({
      // dateTime: ''
    });*/
    const channelStore = useChannelStore();

    const listChannel = computed(() => {
      const channel = channelStore.listChannel.map((item: any) => {
        return {
          ...item,
          label: `#${item.name}` || '',
          value: item.id || '',
          type: 'channel',
        };
      });
      const member = channelStore.listOneToOne.map((item: any) => {
        return {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.name}` || '',
          value: item.id || '',
          type: 'member',
        };
      });
      return [...channel, ...member];
    });

    const dateTime = computed(() => {
      let dateTime = '' as string;
      if (props.date && typeof props.date === 'string') {
        dateTime = date.formatDate(props.date, 'DD MMMM YYYY');
      }
      if (props.date && typeof props.date === 'object') {
        dateTime =
          date.formatDate(
            // @ts-ignore
            props?.date?.from,
            'DD MMMM YYYY',
          ) +
          ' ~ ' +
          date.formatDate(
            // @ts-ignore
            props?.date?.to,
            'DD MMMM YYYY',
          );
      }
      return dateTime;
    });

    const getPriority = (priority: string) => {
      if (!priority) return '';
      return (
        ListPriority.find((item: any) => item.value === priority.toUpperCase())?.label ||
        ''
      );
    };
    const convertPriority = (priority: any) => {
      if (priority) {
        if (typeof priority === 'string') {
          return getPriority(priority);
        }
        if (typeof priority === 'object') {
          const listPriority = [] as Array<string>;
          priority.forEach((item: string) => {
            if (item) {
              listPriority.push(getPriority(item));
            }
          });
          return listPriority.join('; ');
        }
      }
      return '';
    };

    const convertFlag = (is_flag?: string) => {
      if (!is_flag) {
        return '';
      }
      if (is_flag === 'true') {
        return 'Flag set';
      } else {
        return 'No flag';
      }
    };
    const getReadTask = (is_read: string) => {
      if (!is_read) return '';
      return (
        ListReadTask.find((item: any) => item.value === is_read.toUpperCase())?.label ||
        ''
      );
    };
    const convertReadTask = (is_read?: any) => {
      if (is_read) {
        if (typeof is_read === 'string') {
          return getReadTask(is_read);
        }
        if (typeof is_read === 'object') {
          const listRead = [] as Array<string>;
          is_read.forEach((item: string) => {
            if (item) {
              listRead.push(getReadTask(item));
            }
          });
          return listRead.join('; ');
        }
      }
      return '';
    };
    const getFrom = (id: number | string) => {
      if (!id) return '';
      return listChannel.value.find((item: any) => item.value == id)?.label || '';
    };

    const getStatus = (id: number | string) => {
      if (!id) return '';
      const statusItem = props?.listStatus?.find((item: any) => item.value == id) as any;
      return statusItem?.label || '';
    };
    const listFilter = computed(() => {
      const { query } = route as any;
      const { is_flag, priority, channel_id, status, readTask } = query;
      const filters = [
        {
          title: 'From:',
          value: getFrom(channel_id),
          key: 'channelName',
        },
        {
          title: 'Status:',
          value: getStatus(status),
          key: 'status',
        },
        {
          title: 'Priority:',
          value: convertPriority(priority) || '',
          key: 'priority',
        },
        {
          title: 'Flag:',
          value: convertFlag(is_flag) || '',
          key: 'flag',
        },
        {
          title: 'Date:',
          value: dateTime.value || '',
          key: 'date',
        },
        {
          title: 'Task view:',
          value: convertReadTask(readTask) || '',
          key: 'read',
        },
      ];
      return filters.filter(
        (item: any) => item.value && !props.hiddenField?.includes(item.key),
      );
    });

    watch(listFilter, () => {
      if (listFilter.value.length === 0) {
        channelStore.IsFilter = false;
      }
    });
    const removeFilter = (key: string) => {
      emit('removeFilter', key);
    };

    return {
      listFilter,
      removeFilter,
    };
  },
});
</script>

<template>
  <div class="block-show-filter">
    <template
      v-for="item in listFilter"
      :key="item.key"
    >
      <q-chip
        :model-value="item.value"
        square
        color="primary-5"
        class="block-show-filter-item"
      >
        <span class="block-show-filter-item-title">
          {{ item.title }}
        </span>
        <span class="block-show-filter-item-value">
          {{ item.value }}
        </span>
      </q-chip>
    </template>
  </div>
</template>

<style scoped lang="scss">
.block-show-filter {
  display: flex;

  padding: 16px 32px;

  &-item {
    border-radius: 8px;
    padding: 8px 16px;
    gap: 10px;
    height: 40px;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;

    :deep(.q-icon.q-chip__icon--remove) {
      margin-left: 10px;
      font-size: 12px;
      color: #3c3c3c;
    }

    &-title {
      margin-right: 4px;
      color: #3c3c3c;
    }

    &-value {
      color: #1c8c44;
    }
  }
}
</style>
