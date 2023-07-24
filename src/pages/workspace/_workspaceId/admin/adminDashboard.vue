<template>
  <TableStatistic></TableStatistic>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import TableStatistic from 'components/general/TableStatistic.vue';

export default defineComponent({
  name: 'adminDashboard',
  components: {
    TableStatistic,
  },
});
</script>

<!--<style scoped lang="scss">-->

<!--</style>-->
