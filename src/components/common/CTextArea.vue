<template>
  <c-text-field
    type="textarea"
    class="c-text-area"
    :maxlength="maxLength"
    :counter="isShowCounter"
    v-bind="$attrs"
  >
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
  </c-text-field>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
}

const emits = defineEmits<{ (e: EEmitFunc, value?: any): void }>();
const slots = useSlots();

interface IProps {
  height?: string;
  maxLength?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: '',
  height: '108',
});

const heightValue = computed(() => props.height + 'px');

const isShowCounter = computed(() => !!props.maxLength);

const customSlots = computed(() => {
  const { append, prepend, ...filteredSlots } = slots;
  return filteredSlots;
});
</script>

<style lang="scss" scoped>
.c-text-area {
  :deep(textarea) {
    height: v-bind(heightValue);
  }
}
</style>
