<template>
  <c-modal
    v-model="isShow"
    :title="title"
    class-modal="modal-edit-field"
    @close="closeModal"
  >
    <div class="modal-content">
      <c-text-field
        v-if="typeEdit === 'textField'"
        v-model="valueBinding"
        :label="label"
        :rules="rules"
        lazy-rules
      />
      <c-text-area
        v-else
        v-model="valueBinding"
        :label="label"
        :max-length="maxLength"
        :rules="rules"
        lazy-rules
      />
    </div>
    <template #footer>
      <c-btn
        color="primary"
        size="large"
        type="submit"
        :label="textOk"
        :disabled="isError"
        :loading="loading"
        @click="onOk"
      />
    </template>
  </c-modal>
</template>

<script lang="ts">
import { computed, PropType } from 'vue';
import CTextField from 'components/common/CTextField.vue';
import { TypeRule } from 'src/model/Global';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
  ON_OK = 'onOk',
  UPDATE_TEXT = 'update:text',
}

export type TypeEditField = 'textField' | 'textArea';

export default {
  name: 'ModalEditField',

  components: { CTextField },

  emits: [EEmitFunc.UPDATE_VALUE, EEmitFunc.ON_OK, EEmitFunc.UPDATE_TEXT],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Title',
    },
    label: {
      type: String,
      default: 'label',
    },
    textOk: {
      type: String,
      default: 'OK',
    },
    typeEdit: {
      type: String as PropType<TypeEditField>,
      default: 'textField',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Array as PropType<TypeRule[]>,
      default: () => [],
    },
    text: {
      type: String,
      default: '',
    },
    maxLength: {
      type: [String, Number],
      default: '',
    },
  },

  setup(props: any, { emit }: { emit: any }) {
    const isShow = computed({
      get: () => {
        return props.value;
      },
      set: (val) => {
        emit(EEmitFunc.UPDATE_VALUE, val);
      },
    });

    const valueBinding = computed({
      get: () => {
        return props.text;
      },
      set: (val) => {
        emit(EEmitFunc.UPDATE_TEXT, val);
      },
    });

    const isError = computed(() => {
      let _isError = false;
      for (let i = 0; i < props.rules?.length; i++) {
        const rule = props.rules[i];
        const isCheck = rule(valueBinding.value);
        if (isCheck === false || typeof isCheck === 'string') {
          _isError = true;
          break;
        }
      }
      return _isError;
    });

    const closeModal = () => {
      isShow.value = false;
    };

    const onOk = () => {
      emit(EEmitFunc.ON_OK);
    };

    return {
      isShow,
      valueBinding,
      closeModal,
      onOk,
      isError,
    };
  },
};
</script>
