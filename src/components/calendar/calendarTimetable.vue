<template>
  <div>
    <div class="box-input-date">
      <!--      <div>-->
      <select-date-on-and-range
        v-model="date"
        min-width="360px"
        placeholder="Choose date"
        @actionOk="changeDate"
      />
      <!--      </div>-->
    </div>
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
        :selectedStartEndDates="selectedStartEndDates"
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
              <q-badge
                v-if="countCalendar[day.scope.timestamp.date][type]"
                :key="type"
                class="badge-total"
                rounded
                :color="typeCountCalendar[type]"
                @click="chooseAction(day, type)"
              >
                <span>{{ maxCount(countCalendar[day.scope.timestamp.date][type]) }}</span>
              </q-badge>
            </template>
          </div>
        </template>
      </QCalendarMonth>
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
  watchEffect,
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
import { paramsTimetable } from 'src/services/calendar/model';
import CalendarService from 'src/services/calendar';
import SelectDateOnAndRange from 'components/general/selectDateOnAndRange.vue';
interface IsDate {
  to?: string;
  from?: string;
}
interface IState {
  selectedDate: any;
  title: string;
  shortWeekdayLabel: boolean;
  shortMonthLabel: boolean;
  dateFormatter: any;
  start: any;
  end: any;
  locale: string;
  now: any;
  countCalendar: any;
  typeCountCalendar: any;
  filter: paramsTimetable;
  date: IsDate | string | null | any;
  selectedStartEndDates: string[];
}

export default defineComponent({
  name: 'calendarTimetable',

  components: {
    SelectDateOnAndRange,
    QCalendarMonth,
  },
  props: {
    memberId: {
      type: Number,
      default: 0,
    },
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
      end: undefined,
      locale: 'en-us',
      now: '',
      countCalendar: null,
      typeCountCalendar: {
        done: 'neutral-5',
        indue: 'primary',
        overdue: 'overdue',
      },
      filter: {
        workspace_id: Number(route.params.workspaceId),
        start_date: '',
        end_date: '',
        status: undefined,
        priority: undefined,
        is_flag: undefined,
        search: '',
        member_id: 0,
        year: undefined,
      },
      date: null,
      selectedStartEndDates: [],
    });

    const isFilter = ref(false);
    const getDataCalendar = () => {
      if (isFilter.value) {
        state.selectedStartEndDates = [
          `${state.start?.date} ${state.start?.time}`,
          `${state.end?.date} ${state.end?.time}`,
        ];
        getCountCalendar(state.start?.date, state.end?.date);
        return;
      }
      const getStartOfMonthText = addToDate(getStartOfMonth(state.start), {
        day: -7,
      });
      const getEndOfMonthText = addToDate(getEndOfMonth(state.end || state.start), {
        day: 7,
      });
      getCountCalendar(getStartOfMonthText.date, getEndOfMonthText.date);
    };

    const getCountCalendar = (start_date: string, end_date: string) => {
      // const status = route?.query?.status as string;
      if (!props.memberId) return;
      CalendarService.getTimetable({
        ...state.filter,
        start_date,
        end_date,
        member_id: props.memberId,
      }).then((res: any) => {
        state.countCalendar = res.data.calendar;
        nextTick(() => {
          refCalendar?.value?.updateCurrent();
        });
      });
      // .finally(() => {
      // });
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
      const end = parseTimestamp(state.filter.end_date || '');
      state.start = now;
      state.end = end || '';

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

    const reloadCalendar = () => {
      updateFormatter();
      setTimeout(() => {
        updateSelectedDate(state.filter?.start_date || today());
      }, 50);
    };
    const updateSelectedDate = (dateTime: string) => {
      state.selectedDate = date.formatDate(dateTime, 'YYYY-MM-DD');

      nextTick(() => {
        updateDate();
      });
    };

    const reloadAllPage = computed(() => {
      return mainStore.reloadAllPage;
    });
    watch(reloadAllPage, () => {
      if (reloadAllPage.value > 0) {
        setTimeout(() => {
          updateSelectedDate(state.filter?.start_date || today());
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

    const changeDate = () => {
      let dateTime = null as any;
      if (typeof state.date === 'string' && state.date) {
        dateTime = {
          start_date: state.date,
          end_date: state.date,
        };
      }
      if (typeof state.date === 'object' && state.date) {
        dateTime = {
          start_date: state.date.from,
          end_date: state.date.to,
        };
      }
      if (!state.date) {
        dateTime = {
          start_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
          end_date: date.formatDate(new Date(), 'YYYY-MM-DD'),
        };
      }
      state.filter = {
        ...state.filter,
        ...dateTime,
      };
      isFilter.value = true;
      reloadCalendar();
      console.log('dateTime', dateTime);
    };

    watchEffect(() => {
      if (props.memberId) {
        reloadCalendar();
      }
    });
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
      changeDate,
    };
  },
});
</script>
<style scoped lang="scss">
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

.box-input-date {
  display: flex;
  justify-content: flex-end;
}
</style>
