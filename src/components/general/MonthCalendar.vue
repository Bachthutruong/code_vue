<template>
  <div
    class="main-bottom"
    :class="{
      active: monthItem.textMonth === currentDate,
      disabled: checkDisabledMonth,
    }"
  >
    <div
      class="main-month"
      @click="actionMonth"
    >
      <span>{{ monthItem.month }}</span>
    </div>
    <div class="show-count main-date flex justify-center items-center">
      <template v-for="type in ['overdue', 'indue', 'done']">
        <CTooltip
          v-if="monthItem?.date[type]"
          :key="type"
          classCustom="tooltip-text-calendar"
          placement="top"
        >
          <q-badge
            class="badge-total"
            rounded
            :color="typeCountCalendar[type]"
            @click="action(type)"
          >
            <span>{{ maxCount(monthItem.date[type]) }}</span>
          </q-badge>
          <template #labelSlot>
            <span>{{ $t(`workspace.calendar.taskYear.hoverTask.${type}`) }}</span>
          </template>
        </CTooltip>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { date } from 'quasar';
import { useWorkspaceStore } from 'stores/workspace';
import { checkDue, maxCount } from 'src/helper/global';
import CTooltip from 'components/common/CTooltip.vue';

export default defineComponent({
  name: 'MonthCalendar',
  components: { CTooltip },
  emits: ['action', 'actionMonth'],
  props: {
    monthItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const currentDate = computed(() => {
      const timeStamp = Date.now();
      return date.formatDate(timeStamp, 'YYYY-MM');
    });
    const workspaceStore = useWorkspaceStore();
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    const checkDisabledMonth = computed(() => {
      const check = checkDue(
        props?.monthItem?.textMonth,
        'months',
        date.formatDate(detailWorkspace?.value?.created_at, 'YYYY-MM'),
      );
      return check < 0;
    });

    const typeCountCalendar = {
      done: 'neutral-5',
      indue: 'primary',
      overdue: 'overdue',
    };
    const action = (value: any) => {
      emit('action', value, props.monthItem);
    };
    const actionMonth = () => {
      emit('actionMonth', props.monthItem);
    };
    return {
      action,
      actionMonth,
      typeCountCalendar,
      currentDate,
      checkDisabledMonth,
      maxCount,
    };
  },
});
</script>

<style scoped lang="scss">
.main-bottom {
  height: 120px;
  border: 1px solid #d3d3d3;

  &.active {
    background: #e7f6e9;

    .main-month {
      span {
        color: $primary;
      }
    }
  }

  &.disabled {
    background: #f8f8f8;
    border: 1px solid #d3d3d3;

    .main-month {
      span {
        color: #878b87;
      }
    }
  }

  &:hover {
    //background: #e7f6e9;
  }

  .main-month {
    padding: 15px 0 16px 20px;

    span {
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
      color: #565656;
      cursor: pointer;
    }
  }

  .main-date {
    height: auto;
  }
}

.show-count {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  .badge-total {
    cursor: pointer;
    min-width: 32px;
    min-height: 32px;
    border-radius: 50%;
  }
}
</style>
