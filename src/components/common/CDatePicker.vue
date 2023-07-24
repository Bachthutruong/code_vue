<template>
  <c-text-field
    v-bind="$attrs"
    v-model="date"
    :label="label"
    :disable="disable"
    :error-message="errorMessage"
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
          <q-date
            :options="$attrs['options']"
            v-model="date"
            :mask="mark"
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Close"
                color="primary"
                flat
              />
            </div>
          </q-date>
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
</template>

<script lang="ts" setup>
import { computed } from 'vue';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
}

interface IProps {
  modelValue: string;
  label?: string;
  outlined?: boolean;
  disable?: boolean;
  errorMessage?: string;
  icon?: string;
  iconColor?: string;
  mark?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  outlined: true,
  icon: 'bi-calendar-event',
  mark: 'YYYY/MM/DD hh:mm A',
});

const emits = defineEmits<{ (e: EEmitFunc, value?: any): void }>();

const date = computed({
  get(): string {
    return props.modelValue;
  },
  set(val: string) {
    emits(EEmitFunc.UPDATE_VALUE, val);
  },
});
</script>
