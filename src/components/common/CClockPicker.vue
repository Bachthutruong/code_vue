<template>
  <c-text-field
    v-model="time"
    readonly
  >
    <template v-slot:append>
      <q-icon
        :name="icon"
        :color="iconColor"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <ClockPicker
            landscape
            @chooseTime="getTime"
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </c-text-field>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ClockPicker from 'components/general/ClockPicker.vue';
export default defineComponent({
  components: {
    ClockPicker,
  },
  setup() {
    const getTime = (time1: any) => {
      time.value = `${time1.hour}:${time1.minute} ${time1.type}`;
    };
    const time = ref('');
    return {
      time,
      getTime,
    };
  },
});
</script>
