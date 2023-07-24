<template>
  <q-input
    :outlined="outlined"
    :label="label"
    :disable="disable"
    :error="isError"
    :error-message="errorMessage"
    no-error-icon
    v-bind="$attrs"
  >
    <template
      v-if="showPrepend"
      v-slot:prepend
    >
      <template v-if="$slots['prepend']">
        <slot name="prepend" />
      </template>
      <q-icon
        v-else
        :name="prependIcon"
        :color="iconColor"
      />
    </template>
    <template
      v-if="showAppend"
      v-slot:append
    >
      <template v-if="$slots['append']">
        <slot name="append" />
      </template>
      <q-icon
        v-else
        :name="appendIcon"
        :color="iconColor"
      />
    </template>

    <template
      v-for="(_, dynamicSlotName) in customSlots"
      #[dynamicSlotName]="slotData"
    >
      <slot
        v-if="customSlots[dynamicSlotName]"
        :name="dynamicSlotName"
        v-bind="slotData"
      />
    </template>
  </q-input>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue';

interface IProps {
  label?: string;
  outlined?: boolean;
  disable?: boolean;
  errorMessage?: string;
  prependIcon?: string;
  appendIcon?: string;
  iconColor?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  outlined: true,
});
const slots = useSlots();

const customSlots = computed(() => {
  const { append, prepend, ...filteredSlots } = slots;
  return filteredSlots;
});
const isError = computed(() => !!props.errorMessage);
const showPrepend = computed(() => !!props.prependIcon || !!slots['prepend']);
const showAppend = computed(() => !!props.appendIcon || !!slots['append']);
</script>

<style lang="scss" scoped>
.q-field {
  :deep(.q-field__control) {
    &:before {
      border: 1px solid #d3d3d3;
      border-radius: 4px;
    }

    &:hover:before {
      border-color: $primary;
    }

    &:after {
      border-width: 1px !important;
    }
  }

  :deep(.q-field__label) {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #565656;
  }

  :deep(.q-icon) {
    font-size: 16px;
  }
}

:deep(.q-field--disabled) {
  .q-field {
    &__control {
      &:before {
        border: 1px solid #d3d3d3;
      }

      &-container {
        opacity: 1 !important;

        input {
          color: #878b87;
        }
      }
    }

    &__label {
      color: #878b87;
    }
  }
}
</style>
