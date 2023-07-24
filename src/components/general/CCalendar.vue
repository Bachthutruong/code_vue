<template>
  <div>
    <q-toolbar class="box-header text-primary row justify-center items-center">
      <c-btn
        flat
        icon="bi-chevron-left"
        :disabled="checkDisabledMonth"
        @click="onPrev"
      />
      <div
        class="box-show-year cursor-pointer"
        @click="actionShowYearCalendar"
      >
        <span>{{ title }}</span>
      </div>
      <c-btn
        flat
        icon="bi-chevron-right"
        @click="onNext"
      />
    </q-toolbar>
    <div class="box-calendar">
      <q-separator class="full-width" />
      <QCalendarMonth
        ref="refCalendar"
        v-model="selectedDate"
        dateAlign="left"
        :weekdays="[0, 1, 2, 3, 4, 5, 6]"
        :locale="locale"
        :short-weekday-label="shortWeekdayLabel"
        :short-month-label="shortMonthLabel"
        :disabled-before="disabledBefore"
        dayHeight="110"
        :noActiveDate="true"
        :hoverable="true"
        class="c-calendar"
        :class="{
          'c-calendar-filter': isFilter,
        }"
        :sticky="true"
        :bordered="true"
      >
        <template #day="day">
          <div
            class="show-count"
            v-if="countCalendar?.[day.scope.timestamp.date]"
          >
            <template v-for="type in ['overdue', 'indue', 'done']">
              <CTooltip
                v-if="countCalendar[day.scope.timestamp.date][type]"
                :key="type"
                classCustom="tooltip-text-calendar"
                placement="top"
              >
                <q-badge
                  class="badge-total"
                  rounded
                  :color="typeCountCalendar[type]"
                  @click="chooseAction(day, type)"
                >
                  <span>{{
                    maxCount(countCalendar[day.scope.timestamp.date][type])
                  }}</span>
                </q-badge>
                <template #labelSlot>
                  <span>{{ $t(`workspace.calendar.taskYear.hoverTask.${type}`) }}</span>
                </template>
              </CTooltip>
            </template>
          </div>
        </template>
      </QCalendarMonth>
      <div class="box-fixed">
        <div class="box-fixed-button">
          <c-btn
            :label="isHovered ? '' : $t('workspace.channel.addTask')"
            color="primary"
            icon="bi-plus-lg"
            :round="isHovered"
            @click="showModalTask"
            @mousemove="handleMouse(false)"
            @mouseleave="handleMouse(true)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  onMounted,
  nextTick,
  computed,
  watch,
} from 'vue';
import {
  QCalendarMonth,
  makeDate,
  parseTimestamp,
  today,
  getStartOfMonth,
  getEndOfMonth,
  addToDate,
} from '@quasar/quasar-ui-qcalendar';
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass';
import '@quasar/quasar-ui-qcalendar/src/QCalendar.sass';
import { useRoute } from 'vue-router';
import { useCalendarStore } from 'stores/calendar';
import { date } from 'quasar';
import { useWorkspaceStore } from 'stores/workspace';
import { checkDue, maxCount } from 'src/helper/global';
import { useMainStore } from 'stores/main';
import CTooltip from 'components/common/CTooltip.vue';

interface IState {
  selectedDate: any;
  title: string;
  shortWeekdayLabel: boolean;
  shortMonthLabel: boolean;
  dateFormatter: any;
  start: any;
  locale: string;
  now: any;
  countCalendar: any;
  typeCountCalendar: any;
}

export default defineComponent({
  name: 'CCalendar',

  components: {
    CTooltip,
    QCalendarMonth,
  },
  emits: ['showYearCalendar', 'chooseDate'],
  setup(props, { emit }) {
    const workspaceStore = useWorkspaceStore();
    const mainStore = useMainStore();

    const refCalendar = ref();
    const route = useRoute();
    const state = reactive<IState>({
      selectedDate: '',
      title: '',
      shortWeekdayLabel: false,
      shortMonthLabel: false,
      dateFormatter: undefined,
      start: undefined,
      locale: 'en-us',
      now: '',
      countCalendar: null,
      typeCountCalendar: {
        done: 'neutral-5',
        indue: 'primary',
        overdue: 'overdue',
      },
    });
    const calendarStore = useCalendarStore();

    const filterCalendar = computed(() => {
      return calendarStore.getFilterCalendar;
    });

    const isFilter = computed(() => {
      return calendarStore.isFilter;
    });
    const getDataCalendar = () => {
      const getStartOfMonthText = addToDate(getStartOfMonth(state.start), {
        day: -7,
      });
      const getEndOfMonthText = addToDate(getEndOfMonth(state.start), {
        day: 7,
      });
      getCountCalendar(getStartOfMonthText.date, getEndOfMonthText.date);
    };

    const getCountCalendar = (start_date: string, end_date: string) => {
      mainStore.loadingPage = true;
      const status = route?.query?.status as string;
      calendarStore
        .getCountCalendar({
          start_date,
          end_date,
          status: status && status.length ? status?.toUpperCase() : undefined,
        })
        .then((res: any) => {
          state.countCalendar = res.data;
          nextTick(() => {
            refCalendar?.value?.updateCurrent();
          });
        })
        .finally(() => {
          mainStore.loadingPage = false;
        });
    };
    const updateTitle = () => {
      const myDate = makeDate(state.start);
      if (state.dateFormatter !== undefined) {
        state.title = state.dateFormatter.format(myDate);
      }
      getDataCalendar();
    };

    const updateDate = () => {
      const now = parseTimestamp(state.selectedDate);
      state.start = now;
      updateTitle();
    };
    const detailWorkspace = computed(() => {
      return workspaceStore.detailWorkspace;
    });
    const disabledBefore = computed(() => {
      return date.formatDate(
        date.subtractFromDate(detailWorkspace?.value?.created_at, { days: 1 }),
        'YYYY-MM-DD',
      );
    });
    const checkDisabledMonth = computed(() => {
      const check = checkDue(
        state.selectedDate,
        'months',
        date.formatDate(detailWorkspace?.value?.created_at, 'YYYY-MM'),
      );
      return check === 0;
    });
    const onPrev = () => {
      refCalendar.value.prev();
      nextTick(() => {
        updateDate();
      });
    };
    const onNext = () => {
      refCalendar.value.next();
      nextTick(() => {
        updateDate();
      });
    };
    const updateFormatter = () => {
      try {
        state.dateFormatter = new Intl.DateTimeFormat(state.locale || undefined, {
          month: state.shortMonthLabel ? 'short' : 'long',
          year: 'numeric',
          timeZone: 'UTC',
        });
      } catch (e) {
        state.dateFormatter = undefined;
      }
    };

    const chooseAction = (day: any, type: string) => {
      emit('chooseDate', {
        day: day.scope.timestamp.date,
        type,
      });
    };
    const actionShowYearCalendar = () => {
      emit('showYearCalendar', state.start);
    };
    onMounted(() => {
      updateFormatter();
      setTimeout(() => {
        updateSelectedDate(filterCalendar?.value?.start_date || today());
      }, 50);
    });
    const updateSelectedDate = (dateTime: string) => {
      state.selectedDate = date.formatDate(dateTime, 'YYYY-MM-DD');
      nextTick(() => {
        updateDate();
      });
    };

    const reloadPage = computed(() => {
      return calendarStore.reloadPage;
    });
    watch(reloadPage, () => {
      if (reloadPage.value) {
        setTimeout(() => {
          updateSelectedDate(filterCalendar?.value?.start_date || today());
        }, 50);
      }
    });

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        setTimeout(() => {
          updateSelectedDate(filterCalendar?.value?.start_date || today());
        }, 50);
      }
    });
    const showModalTask = () => {
      workspaceStore.showModalAddTask(true);
    };

    const isHovered = ref(true);

    const handleMouse = (isBoolean: boolean) => {
      isHovered.value = isBoolean;
    };
    return {
      refCalendar,
      ...toRefs(state),
      isFilter,
      isHovered,
      handleMouse,
      checkDisabledMonth,
      onNext,
      onPrev,
      updateTitle,
      chooseAction,
      actionShowYearCalendar,
      updateSelectedDate,
      showModalTask,
      disabledBefore,
      maxCount,
    };
  },
});
</script>
<style lang="scss">
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
<style scoped lang="scss">
.box-header {
  border: 1px solid #d3d3d3;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 12px 0;
  .q-btn {
    &[disabled] {
      opacity: 0.6 !important;
    }
  }

  .box-show-year {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 4px 10px 8px;
    border-radius: 8px;
    min-width: 200px;

    &:hover {
      background: #f8f8f8;
    }

    span {
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      color: #1c8c44;
    }
  }
}

.box-fixed {
  position: fixed;
  right: 32px;
  bottom: 40px;
  z-index: 10;

  &-button {
    margin-bottom: 24px;
  }

  &-scroll {
    display: flex;
    justify-content: flex-end;
  }

  .box-fixed__btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #e7f6e9 !important;

    .q-icon {
      color: #1c8c44;
    }
  }
}

.tool-tip {
  text-align: center;
  span {
    word-break: break-word;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
    font-weight: 400;
  }
}
</style>
