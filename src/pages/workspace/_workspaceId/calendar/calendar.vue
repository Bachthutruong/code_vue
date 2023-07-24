<template>
  <div class="calendar-page-body">
    <div class="calendar-page-body-month">
      <c-calendar
        @showYearCalendar="actionShowYearCalendar"
        @chooseDate="chooseDate"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import CCalendar from 'components/general/CCalendar.vue';
import { defineComponent, computed } from 'vue';
import { useCalendarStore } from 'stores/calendar';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  name: 'calendarPage',

  components: {
    CCalendar,
  },
  emits: [],
  setup() {
    const { t } = useI18n();
    const calendarStore = useCalendarStore();
    const router = useRouter();
    const route = useRoute();

    const viewType = computed(() => {
      return calendarStore.viewType;
    });
    const filterCalendar = computed(() => {
      return calendarStore.getFilterCalendar;
    });

    const actionShowYearCalendar = (dateTime: any) => {
      console.log(dateTime);
      router.push({
        name: 'calendar-year',
        query: {
          start_date: dateTime.year,
        },
      });
    };
    const chooseDate = (infoDay: any) => {
      router
        .push({
          name: 'calendar-list',
          query: {
            ...filterCalendar.value,
            status: infoDay.type.toUpperCase(),
            start_date: infoDay.day,
            end_date: infoDay.day,
          },
        })
        .then(() => {
          calendarStore.actionReloadFilter();
        });
    };

    const toggleViewType = (type: string) => {
      calendarStore.viewType = type;
    };

    return {
      viewType,
      actionShowYearCalendar,
      chooseDate,
      toggleViewType,
    };
  },
});
</script>

<style scoped lang="scss">
.calendar-page-body {
  padding: 0 32px;
  margin-bottom: 40px;
  &-month {
    max-width: 1134px;
    margin: 48px auto 0;
  }
}
</style>
