<template>
  <HeaderFilterCalendar />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderFilterCalendar from 'components/calendar/HeaderFilterCalendar.vue';

export default defineComponent({
  name: 'calendarPage',
  components: {
    HeaderFilterCalendar,
  },
  emits: [],
});
</script>

<style scoped lang="scss">
.calendar-page-body {
  padding: 0 32px;

  &-month {
    max-width: 1134px;
    margin: 48px auto 0;
  }
}
</style>
