<template>
  <c-modal
    v-model="isShow"
    v-bind="$attrs"
    :title="title"
    class-modal="modal-confirm"
    @close="closeModal"
  >
    <div class="text-h5-regular">
      <slot>
        <li v-if="subTitle">{{ subTitle }}</li>
      </slot>
    </div>
    <slot name="body"></slot>

    <template #footer>
      <c-btn
        v-if="textCancel"
        color="primary"
        size="large"
        type="submit"
        :label="textCancel"
        :disabled="loading"
        outline
        @click="onCancel"
      />
      <c-btn
        color="primary"
        size="large"
        type="submit"
        :label="textOk"
        :loading="loading"
        :disabled="disabled"
        @click="onOk"
      />
    </template>
  </c-modal>
</template>

<script lang="ts">
import { computed } from 'vue';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
  ON_OK = 'onOk',
  CLOSE = 'close',
}

export default {
  name: 'CConfirm',

  emits: [EEmitFunc.UPDATE_VALUE, EEmitFunc.ON_OK, EEmitFunc.CLOSE],

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Title',
    },
    subTitle: {
      type: String,
      default: '',
    },
    textOk: {
      type: String,
      default: 'OK',
    },
    textCancel: {
      type: String,
      default: 'Cancel',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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

    const closeModal = () => {
      isShow.value = false;
      emit(EEmitFunc.CLOSE);
    };

    const onCancel = () => {
      closeModal();
    };

    const onOk = () => {
      emit(EEmitFunc.ON_OK);
    };

    return {
      isShow,
      closeModal,
      onCancel,
      onOk,
    };
  },
};
</script>
