<template>
  <q-btn
    :label="label"
    :outline="outline"
    :color="color"
    :disable="disable"
    :class="{
      'q-btn--disable': disable,
      [classSize]: !!size,
      'q-btn--round': round,
      'q-btn--custom-fontSize-icon': !!fontSizeCustom,
    }"
    :icon="icon"
    :dense="isDense"
    :round="round"
    :flat="flat"
    v-bind="$attrs"
  >
    <template
      v-for="(_, dynamicSlotName) in slots"
      #[dynamicSlotName]="slotData"
    >
      <slot
        v-if="slots[dynamicSlotName]"
        :name="dynamicSlotName"
        v-bind="slotData"
      />
    </template>
  </q-btn>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue';

interface IProps {
  label?: string;
  color?: string;
  icon?: string;
  outline?: boolean;
  disable?: boolean;
  size?: 'large' | 'small';
  round?: boolean;
  flat?: boolean;
  fontSizeIcon?: string;
}
const props = defineProps<IProps>();
const slots = useSlots();

const classSize = computed(() => `q-btn--${props.size}`);
const isDense = computed(() => props.size === 'small');
const fontSizeCustom = computed<string | boolean>(() =>
  props.fontSizeIcon ? props.fontSizeIcon + 'px' : false,
);
</script>

<style lang="scss" scoped>
.q-btn {
  text-transform: none;
  min-height: 40px;
  min-width: 40px;
  font-size: 14px;
  &--large {
    font-size: 16px;
    line-height: 24px;
    min-height: 48px;
    min-width: 48px;
  }

  &--small {
    min-height: 32px;
    min-width: 32px;
  }

  &--round {
    padding: 0;
  }
}

.q-btn--disable {
  opacity: 0.6 !important;
}

.q-btn--custom-fontSize-icon {
  :deep(.q-icon) {
    font-size: v-bind(fontSizeCustom);
  }
}
</style>
