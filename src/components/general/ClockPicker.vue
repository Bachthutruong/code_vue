<template>
  <div class="clock">
    <div class="clock-time flex items-center justify-center">
      <div class="flex items-center">
        <span>{{ selections[0] }} : {{ selections[1] }}</span>
        <span>{{ selections[2] }}</span>
      </div>
    </div>
    <div class="clock-picker">
      <scroll-picker
        :options="options"
        v-model="selections"
      />
      <div class="clock-btn">
        <c-btn
          @click="onCancel"
          label="Cancel"
          color="primary"
          flat
        />
        <c-btn
          label="OK"
          color="primary"
          flat
          v-close-popup
          @click="onSubmit()"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from 'vue';
import { date } from 'quasar';
// @ts-ignore
import ScrollPicker from 'vue3-scroll-picker';

const getNumberHours = (number: number) => {
  return [...Array(number)].map((item: any, i: number) => {
    return {
      label: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
      value: i + 1 < 10 ? `0${i + 1}` : `${i + 1}`,
    };
  });
};
const getNumberMin = (number: number) => {
  return [...Array(number)].map((item: any, i: number) => {
    return {
      label: i < 10 ? `0${i}` : `${i}`,
      value: i < 10 ? `0${i}` : `${i}`,
    };
  });
};

const mockOptions = [
  [...getNumberHours(12)],
  [...getNumberMin(60)],
  [
    {
      label: 'AM',
      value: 'AM',
    },
    {
      label: 'PM',
      value: 'PM',
    },
  ],
];
export default defineComponent({
  name: 'ClockPiker',
  components: {
    ScrollPicker,
  },
  methods: {},
  props: {
    modelValue: {
      type: String,
      default: '10:20 pm',
    },
  },
  emits: ['update:modelValue', 'chooseTime', 'onCancel'],
  setup(props, { emit }) {
    const onSubmit = () => {
      emit('chooseTime', {
        hour: state.selections[0],
        minute: state.selections[1],
        type: state.selections[2],
      });
    };
    const onCancel = () => {
      emit('onCancel');
    };
    const timeStamp = Date.now();
    const formatDateToString = () => {
      return date.formatDate(Number(timeStamp), 'hh:mm A');
    };

    const formatStringToArrayTime = (timeString: string) => {
      const arrayTime = timeString.split(' ');
      const b = [...arrayTime[0].split(':'), arrayTime[1]];
      return b;
    };

    const getModelValue = computed(() => {
      return formatStringToArrayTime(props.modelValue || formatDateToString());
    });
    const state = reactive({
      options: mockOptions,
      selections: [...getModelValue.value] as string[],
      // wheelSpeed: 1,
    });

    return {
      ...toRefs(state),
      onSubmit,
      formatDateToString,
      onCancel,
    };
  },
});
</script>

<style lang="scss" scoped>
.clock {
  width: 328px;
  height: 378px;

  .clock-time {
    width: 100%;
    height: 92px;
    background: #1c8c44;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    div {
      padding: 28px 12px 24px 24px;
    }

    span {
      font-size: 30px;
      line-height: 40px;
      font-weight: 500;
      color: #f8f8f8;
    }

    span:nth-child(2) {
      padding-left: 24px;
      font-size: 20px;
    }
  }

  .clock-picker {
    background: #ffffff;
    width: 100%;
    height: calc(100% - 92px);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .clock-btn {
    padding: 8px 12px 12px 198px;

    .q-btn:nth-child(1) {
      width: 67px;
      height: 40px;
    }

    .q-btn:nth-child(2) {
      width: 43px;
      height: 40px;
    }
  }
}

.scroll-picker-container {
  height: 79%;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.column-content::-webkit-scrollbar {
  width: 0;
  height: 5px;
}

.column-content::-webkit-scrollbar-thumb {
  background: rgb(0 0 0 / 10%);
  border-radius: 10px;
}

:deep(.column-container) {
  position: relative;
  padding: 10px;
}

.column-overlay {
  z-index: 1;
  position: absolute;
  cursor: grab;
  user-select: none;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
}

.column-content {
  height: 100%;
  overflow-y: auto;
}

:deep(.row-option) {
  font-size: 23px;
  line-height: 28px;
  color: rgb(60 60 67 / 60%);
}

.row-option-custom {
  padding: 10px;
}

.center-overlay {
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  margin: auto;
}

:deep(.center-overlay-custom) {
  height: 44px;
  width: 100%;
  border-radius: 8px;
  background: rgb(116 116 128 / 8%);
  border: 0;
}

.pad-overlay {
  z-index: 1;
  position: absolute;
  width: 100%;
}

.pad-top-overlay {
  top: 0;
}

.pad-top-overlay-custom {
  height: 100%;
  background: linear-gradient(to top, rgb(255 255 255 / 0%), rgb(255 255 255 / 100%));
}

.pad-bottom-overlay {
  bottom: 0;
}

.pad-bottom-overlay-custom {
  height: 100%;
  background: linear-gradient(to bottom, rgb(255 255 255 / 0%), rgb(255 255 255 / 100%));
}
</style>
