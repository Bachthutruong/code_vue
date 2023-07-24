<template>
  <div class="row q-gutter-x-sm justify-center">
    <q-input
      outlined
      v-for="i in length"
      :model-value="fieldValues[i - 1]"
      :maxlength="i === length ? 1 : undefined"
      v-bind="$attrs"
      @keyup="onKeyUp($event, i - 1)"
      @change="(value) => changeInput(value, i - 1)"
      @update:model-value="onUpdate($event, i - 1)"
      :key="i"
      :ref="(el) => updateFieldRef(el, i - 1)"
      input-class="text-center"
    >
    </q-input>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onBeforeUpdate,
  watch,
  reactive,
  toRefs,
  onMounted,
} from 'vue';
// import { checkOtpNumber6Dig } from 'src/helper/validForm';

export default defineComponent({
  name: 'OtpInput',

  emits: ['update:modelValue'],

  props: {
    inputLength: {
      type: Number,
      default: 6,
    },
  },
  setup(props, { emit }) {
    // const length = 6;
    const length = computed(() => props.inputLength);
    const state = reactive<{
      fields: any;
      fieldValues: Array<any>;
    }>({
      fields: [],
      fieldValues: [],
    });

    const composite = computed(() => {
      const nonNullFields = state.fieldValues.filter((value: any) => value);
      if (length.value !== nonNullFields.length) {
        return '';
      }
      return nonNullFields.join('');
    });

    watch(composite, () => {
      if (composite.value) {
        emit('update:modelValue', composite.value);
      }
    });

    // make sure to reset the refs before each update
    onBeforeUpdate(() => {
      state.fields = [];
    });

    const updateFieldRef = (element: any, index: any) => {
      if (element) {
        state.fields[index] = element;
      }
    };

    const focus = (index: any) => {
      if (index >= 0) {
        if (index < length.value) {
          state.fields[index].select();
        } else {
          state.fields[index - 1].blur();
          // if (composite.value) {
          //   state.fields[index - 1].blur();
          // }
        }
      }
    };

    const onUpdate = (value: any, index: any) => {
      if (value) {
        focus(index + 1);
      }
    };

    const onKeyUp = (evnt: any, index: any) => {
      const key = evnt.key;
      if (['Tab', 'Shift', 'Meta', 'Control', 'Alt'].includes(key)) {
        return;
      }

      if (['Delete'].includes(key)) {
        return;
      }

      if (key === 'ArrowLeft' || key === 'Backspace') {
        focus(index - 1);
        return;
      } else if (key === 'ArrowRight') {
        focus(index + 1);
        return;
      }
    };
    const changeInput = (value: any, index: number) => {
      if (value.length > 5) {
        state.fieldValues = ['', '', '', '', '', ''];
        let a = value.toString().split('');
        a.forEach((v: any, indx: number) => (state.fieldValues[indx] = v));
        focus(value.length - 1);
      } else {
        if (value.length > 1) {
          state.fieldValues[index] = value.split('')[0];
          state.fieldValues[index] = value.split('')[1];
        } else {
          state.fieldValues[index] = value.split('')[0];
        }
      }
    };
    onMounted(() => {
      focus(0);
    });

    return {
      composite,
      ...toRefs(state),
      focus,
      length,
      onKeyUp,
      onUpdate,
      updateFieldRef,
      changeInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-input {
  width: 72px;
}
</style>
