<template>
  <div class="main-year-calendar">
    <div
      class="main-top bi-calendar-event flex items-center justify-center"
      :class="{
        'active-year':
          itemCard?.year ===
          formatDateDisplay($route.query?.start_date || new Date(), 'YYYY'),
      }"
    >
      <span class="main-years">{{ itemCard?.year }}</span>
    </div>
    <div class="row">
      <div
        class="col-lg-3 col-md-4"
        v-for="(month, index) in listMonth"
        :key="index"
      >
        <MonthCalendar
          :month-item="month"
          :id="month.textMonth"
          @action="action"
          @actionMonth="actionMonth(month)"
        ></MonthCalendar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs } from 'vue';
import MonthCalendar from 'components/general/MonthCalendar.vue';
import { useRoute } from 'vue-router';
import { date } from 'quasar';
import { formatDateDisplay } from 'src/helper/global';

interface listMonth {
  id: number;
  month: string;
  textMonth: string;
  date: {
    overdue: number;
    indue: number;
    done: number;
  };
}

export default defineComponent({
  props: {
    itemCard: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  components: { MonthCalendar },
  emits: ['activeMonth', 'actionMonth'],
  setup(props, { emit }) {
    const route = useRoute();
    const states = reactive<{
      countCalendar: any;
    }>({
      countCalendar: null,
    });
    const action = (type: any, item: any) => {
      emit('activeMonth', {
        type,
        date: item.textMonth,
      });
    };
    const actionMonth = (monthItem: any) => {
      emit('actionMonth', {
        ...monthItem,
        date: date.formatDate(monthItem.textMonth, 'YYYY-MM-DD'),
      });
    };

    const listMonth = computed(() => {
      const result: Array<listMonth> = [
        {
          id: 1,
          month: 'January',
          textMonth: `${props.itemCard.year}-01`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 2,
          month: 'February',
          textMonth: `${props.itemCard.year}-02`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 3,
          month: 'March',
          textMonth: `${props.itemCard.year}-03`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 4,
          month: 'April',
          textMonth: `${props.itemCard.year}-04`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 5,
          month: 'May',
          textMonth: `${props.itemCard.year}-05`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 6,
          month: 'June',
          textMonth: `${props.itemCard.year}-06`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 7,
          month: 'July',
          textMonth: `${props.itemCard.year}-07`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 8,
          month: 'August',
          textMonth: `${props.itemCard.year}-08`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 9,
          month: 'September',
          textMonth: `${props.itemCard.year}-09`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 10,
          month: 'October',
          textMonth: `${props.itemCard.year}-10`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 11,
          month: 'November',
          textMonth: `${props.itemCard.year}-11`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
        {
          id: 12,
          month: 'December',
          textMonth: `${props.itemCard.year}-12`,
          date: {
            overdue: 0,
            indue: 0,
            done: 0,
          },
        },
      ];
      return getCountCalendar(result);
    });

    const getCountCalendar = (listMonth: Array<listMonth>) => {
      return listMonth.map((item: any) => {
        if (props.itemCard?.data?.[item.textMonth]) {
          return {
            ...item,
            date: {
              ...props.itemCard?.data?.[item.textMonth],
            },
          };
        }
        return item;
      });
    };
    return {
      ...toRefs(states),
      action,
      formatDateDisplay,
      actionMonth,
      listMonth,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-year-calendar {
  width: 100%;
  margin: 0 auto 24px;
  max-width: 1152px;
  .main-top {
    font-size: 16px;
    color: #1c8c44;
    background: #e7f6e9;
    border: 0 solid #d3d3d3;
    border-radius: 8px 8px 0 0;
    height: 52px;
    cursor: pointer;
    &.active-year {
      background: #1c8c44;
      color: #ffffff;
    }
    .main-years {
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
      padding-left: 12px;
    }
  }
}
</style>
