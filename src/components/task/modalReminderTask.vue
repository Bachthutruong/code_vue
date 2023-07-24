<template>
  <CModal
    v-model="isShow"
    classModal="modal-invite"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">{{
            infoPopup?.title || $t('workspace.channel.modalSetReminder.title')
          }}</span>
        </div>
      </div>
    </template>
    <div class="modal-invite-body">
      <CDateTimePicker
        v-model="scheduleDate"
        :label="infoPopup?.label || $t('workspace.channel.modalSetReminder.label')"
        :options="optionsFn"
        bottom-slots
      >
      </CDateTimePicker>
    </div>
    <template #footer>
      <c-btn
        size="large"
        color="neutral"
        flat
        :label="$t('global.cancel')"
        :loading="loading"
        @click="closeModal"
      />
      <c-btn
        color="primary"
        size="large"
        :label="infoPopup?.textOk || $t('workspace.channel.modalSetReminder.textOk')"
        :disabled="!scheduleDate"
        :loading="loading"
        @click="submit()"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs } from 'vue';
import { optionsFn } from 'src/helper/global';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
  ON_OK = 'onOk',
  CLOSE = 'close',
}

export default defineComponent({
  name: 'modalReminderTask',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    infoPopup: {
      type: Object,
      default() {
        return {
          textOk: '',
          label: '',
          title: '',
        };
      },
    },
  },
  emits: [EEmitFunc.UPDATE_VALUE, EEmitFunc.ON_OK, EEmitFunc.CLOSE],
  setup(props, { emit }) {
    const isShow = computed({
      get: () => {
        return props.value;
      },
      set: (val) => {
        emit(EEmitFunc.UPDATE_VALUE, val);
      },
    });

    const state = reactive<{
      scheduleDate: string;
      loading: boolean;
    }>({
      scheduleDate: '',
      loading: false,
    });
    const refSelected = ref();
    const submit = () => {
      emit(EEmitFunc.ON_OK, state.scheduleDate);
    };
    const closeModal = () => {
      state.scheduleDate = '';
      isShow.value = false;
      emit(EEmitFunc.CLOSE);
    };
    const setDefault = (time: string) => {
      state.scheduleDate = time;
    };
    return {
      ...toRefs(state),
      refSelected,
      closeModal,
      submit,
      optionsFn,
      isShow,
      setDefault,
    };
  },
});
</script>

<style scoped lang="scss">
.text-header {
  &-title {
    color: #2f2f2f;
  }

  &-name {
    color: #878b87;
  }
}
</style>
