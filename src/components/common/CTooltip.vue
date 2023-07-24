<template>
  <Menu
    :placement="placement"
    noAutoFocus
    v-bind="$attrs"
  >
    <slot></slot>
    <template #popper>
      <div
        class="tooltiptext"
        :class="classCustom"
      >
        <slot name="labelSlot">
          {{ label }}
        </slot>
      </div>
    </template>
  </Menu>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import {
  // Directives
  // VTooltip,
  // VClosePopper,
  // Components
  // Dropdown,
  // Tooltip,
  Menu,
} from 'floating-vue';
export default defineComponent({
  name: 'CTooltip',
  props: {
    label: {
      type: String,
      default: '',
    },
    bgColor: {
      type: String,
      default: '',
    },
    textColor: {
      type: String,
      default: '',
    },
    maxWidth: {
      type: [Number, String],
      default: 0,
    },
    classCustom: {
      type: String,
      default: 'tooltip-text-normal',
    },
    placement: {
      type: String,
      default: 'auto',
    },
  },
  components: { Menu },
  setup(props) {
    const toolTip = ref();
    const toolTipParent = ref();
    const customBgColor = computed<string | boolean>(() => {
      return props.bgColor || false;
    });
    const customTextColor = computed<string | boolean>(() => {
      return props.textColor || false;
    });
    const customMaxWidth = computed<string | boolean>(() => {
      return props.maxWidth + 'px' || false;
    });
    return {
      customBgColor,
      customTextColor,
      customMaxWidth,
      toolTip,
      toolTipParent,
    };
  },
});
</script>

<style scoped lang="scss">
.tooltiptext {
  width: max-content;
  max-width: v-bind(customMaxWidth);
  background-color: v-bind(customBgColor);
  color: v-bind(customTextColor);
  text-align: center;
  border-radius: 6px;
  padding: 8px 16px;
}
.tooltipEmoji {
  width: max-content;
  max-width: 300px;
  background-color: #e7f6e9;
  color: #2f2f2f;
  text-align: center;
  border-radius: 6px;
  padding: 8px 16px;
}

.tooltip-text-calendar {
  width: max-content;
  max-width: 134px;
  background-color: #e7f6e9;
  color: #2f2f2f;
  text-align: center;
  border-radius: 6px;
  padding: 8px 16px;
  filter: drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.2));
}

.tooltip-text-normal {
  background-color: #e7f6e9;
  color: #2f2f2f;
  text-align: center;
  border-radius: 6px;
  padding: 8px 16px;
  //filter: drop-shadow(0px 3px 8px rgba(0, 0, 0, 0.2));
}
</style>
