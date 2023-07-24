<script lang="ts">
import { defineComponent, nextTick, reactive, toRefs, watch } from 'vue';
import { listRepeat, typeRepeat } from 'src/constants/ConstantTask';
import { formatDateDisplay } from 'src/helper/global';
import { typeBodyRepeat } from 'src/services/task/model';

export default defineComponent({
  name: 'boxRepeat',
  props: {
    scheduleDate: {
      type: String,
      default: '',
    },
  },
  emits: ['changeRepeat'],
  setup(props, { emit }) {
    const state = reactive<{
      repeat: typeRepeat;
      listTypeRepeat: Array<typeRepeat>;
    }>({
      repeat: listRepeat[0],
      listTypeRepeat: listRepeat,
    });
    watch(props, () => {
      if (props.scheduleDate) {
        setListRepeat();
        nextTick(() => {
          changeRepeat(listRepeat[0]);
        });
      }
    });

    const setListRepeat = () => {
      const dayOfWeek = formatDateDisplay(props.scheduleDate, 'E') as any;
      if (dayOfWeek > 5) {
        state.listTypeRepeat = listRepeat.filter(
          (item: typeRepeat) => item.type !== 'WEEKDAY',
        );
      } else {
        state.listTypeRepeat = listRepeat.filter(
          (item: typeRepeat) => item.type !== 'WEEKEND',
        );
      }
    };
    const setDefault = (repeatType: typeBodyRepeat) => {
      state.repeat =
        state.listTypeRepeat.find((item: typeRepeat) => item.type === repeatType.type) ||
        listRepeat[0];
      setListRepeat();
      nextTick(() => {
        changeRepeat(state.repeat);
      });
    };

    const changeRepeat = (repeat: typeRepeat) => {
      state.repeat = repeat;
      emit('changeRepeat', repeat);
    };
    return {
      ...toRefs(state),
      changeRepeat,
      setDefault,
    };
  },
});
</script>

<template>
  <div class="box-repeat">
    <div>
      <q-icon
        name="bi-repeat"
        size="14px"
        color="neutral-3"
      />
      <span class="text-h5 box-repeat-text text-neutral-3">
        {{ $t('workspace.channel.repeat') }}:
      </span>
    </div>
    <q-btn-dropdown
      dropdown-icon="bi-chevron-down"
      class="block-priority box-priority-action"
      content-class="menu-action"
    >
      <template #label>
        <span
          class="block-repeat-selected text-body1 text-weight-medium text-primary bg-primary-5"
        >
          {{ repeat.label }}</span
        >
      </template>
      <q-list>
        <q-item
          v-for="(item, index) in listTypeRepeat"
          :key="index"
          v-close-popup
          clickable
          :active="repeat.type === item.type"
          :active-class="'active-item'"
          @click="changeRepeat(item)"
        >
          <q-item-section>
            <q-item-label>
              <span>
                {{ item.label }}
              </span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<style scoped lang="scss">
.box-repeat {
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &-text {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    margin-left: 8px;
    margin-right: 16px;
  }

  &-action {
    padding: 0 8px;
    //min-height: 24px;
  }
}

.block-repeat-selected {
  border-radius: 4px;
  padding: 6px 16px;
  text-align: center;
  text-transform: initial;
}
</style>
