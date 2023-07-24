<template>
  <div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-bind="$attrs"
        v-model="current"
        color="green-7"
        direction-links
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'PaginationWorkSpace',
  setup() {
    return {
      current: ref(1),
    };
  },
});
</script>
