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
            $t('workspace.channel.modalChoseSchedules.title')
          }}</span>
        </div>
      </div>
    </template>
    <div class="modal-invite-body">
      <CDateTimePicker
        v-model="scheduleDate"
        :label="$t('workspace.channel.modalChoseSchedules.scheduleDate')"
        :options="optionsFn"
      >
      </CDateTimePicker>

      <template v-if="showRepeat">
        <box-repeat
          :schedule-date="scheduleDate"
          @change-repeat="changeRepeat"
        ></box-repeat>
        <CDateTimePicker
          v-if="repeat.type !== 'NONE'"
          v-model="repeatDate"
          :label="$t('workspace.channel.modalChoseSchedules.repeatDate')"
          :options="optionsFn"
        >
        </CDateTimePicker>
      </template>
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
        :label="$t('workspace.channel.modalChoseSchedules.schedule')"
        :disabled="disabledAction"
        :loading="loading"
        @click="submit()"
      />
    </template>
  </CModal>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch } from 'vue';
import CModal from 'components/common/CModal.vue';
import { optionsFn } from 'src/helper/global';
import { listRepeat, typeRepeat } from 'src/constants/ConstantTask';
import { typeBodyRepeat } from 'src/services/task/model';
import BoxRepeat from 'components/task/boxRepeat.vue';

enum EEmitFunc {
  UPDATE_VALUE = 'update:modelValue',
  ON_OK = 'onOk',
  CLOSE = 'close',
}

export default defineComponent({
  name: 'modalChoseSchedules',
  components: { BoxRepeat, CModal },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    showRepeat: {
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
      repeatDate: string;
      loading: boolean;
      repeat: typeRepeat;
    }>({
      scheduleDate: '',
      repeatDate: '',
      loading: false,
      repeat: listRepeat[0],
    });

    const disabledAction = computed(() => {
      // if (props.showRepeat && state.repeat.type !== 'NONE') {
      //   return !state.scheduleDate || !state.repeatDate;
      // }
      return !state.scheduleDate;
    });
    const refSelected = ref();
    watch(isShow, () => {
      if (!isShow.value) {
        state.scheduleDate = '';
      }
    });
    const submit = () => {
      const repeatBody = {
        type: state.repeat.type,
        end_at: state.repeatDate,
      } as typeBodyRepeat;
      emit(
        EEmitFunc.ON_OK,
        state.scheduleDate,
        props.showRepeat ? repeatBody : undefined,
      );
    };
    const closeModal = () => {
      state.scheduleDate = '';
      state.repeatDate = '';
      state.repeat = listRepeat[0];
      isShow.value = false;
      emit(EEmitFunc.CLOSE);
    };
    const setDefault = (time: string) => {
      state.scheduleDate = time;
    };

    const changeRepeat = (repeat: typeRepeat) => {
      state.repeat = repeat;
    };
    return {
      ...toRefs(state),
      refSelected,
      closeModal,
      submit,
      optionsFn,
      isShow,
      setDefault,
      listRepeat,
      changeRepeat,
      disabledAction,
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
