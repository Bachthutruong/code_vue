<template>
  <div
    class="cursor-pointer"
    @click="focusDate()"
  >
    <c-text-field
      v-bind="$attrs"
      v-model="date"
      :disable="disable"
      readonly
      class="cursor-pointer"
      :error-message="errorMessage"
    >
      <template v-slot:append>
        <q-icon
          :name="icon"
          :color="iconColor"
          class="cursor-pointer"
        >
          <q-popup-proxy
            v-if="!disable"
            ref="popupProxy"
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-if="!showTime"
              :options="$attrs['options']"
              v-model="date"
              mask="YYYY/MM/DD hh:mm A"
            >
              <div class="row items-center justify-end">
                <q-btn
                  v-close-popup
                  label="Close"
                  color="primary"
                  flat
                />
                <q-btn
                  @click="showTime = true"
                  label="OK"
                  color="primary"
                  flat
                />
              </div>
            </q-date>
            <ClockPicker
              v-else
              landscape
              :modelValue="getDefaultTime"
              @onCancel="showTime = false"
              @chooseTime="getTime"
            />
          </q-popup-proxy>
        </q-icon>
      </template>
      <template
        v-for="(_, dynamicSlotName) in $slots"
        #[dynamicSlotName]="slotData"
      >
        <slot
          v-if="$slots[dynamicSlotName]"
          :name="dynamicSlotName"
          v-bind="slotData"
        />
      </template>
    </c-text-field>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import ClockPicker from 'components/general/ClockPicker.vue';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
}

interface IProps {
  modelValue: string;
  outlined?: boolean;
  disable?: boolean;
  errorMessage?: string;
  icon?: string;
  iconColor?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  outlined: true,
  icon: 'bi-calendar-event',
});
const popupProxy = ref();
const showTime = ref(false);
const emits = defineEmits<{ (e: EEmitFunc, value?: any): void }>();
const focusDate = () => {
  popupProxy.value.show();
};
const date = computed({
  get(): string {
    return props.modelValue;
  },
  set(val: string) {
    emits(EEmitFunc.UPDATE_VALUE, val);
  },
});

const getDefaultTime = computed(() => {
  let dateTime = '';
  if (date.value) {
    let arrayDate = date.value.split(' ');
    dateTime = `${arrayDate[1]} ${arrayDate[2]} `;
  }
  return dateTime;
});

const getTime = (time1: any) => {
  time.value = `${time1.hour}:${time1.minute} ${time1.type}`;
  const newTime = `${date.value.split(' ')[0]} ${time.value}`;
  date.value = newTime;
  popupProxy.value.hide();
  showTime.value = false;
};
const time = ref('');
</script>
<style lang="scss" scoped>
:deep(.q-field--labeled) {
  .q-field__native {
    cursor: pointer !important;
  }
}
</style>
