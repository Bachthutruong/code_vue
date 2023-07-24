<template>
  <q-select
    class=""
    v-bind="$attrs"
    :options="options"
    behavior="menu"
    :menu-offset="[0, 6]"
    @filter="filterFn"
  >
    <template
      v-for="(_, dynamicSlotName) in $slots"
      #[dynamicSlotName]="slotData"
    >
      <slot
        v-if="$slots[dynamicSlotName]"
        :name="dynamicSlotName"
        v-bind="slotData"
      />
    </template>
  </q-select>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';

export default defineComponent({
  props: {
    defaultOptions: {
      type: Array,
      default() {
        return [
          // {
          //   label: 'label',
          //   value: 'value'
          // },
        ];
      },
    },
    filterAction: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['filterValue'],
  name: 'CSelect',
  setup(props) {
    const options = ref(props.defaultOptions);
    const getDefaultOptions = computed(() => {
      return props.defaultOptions || [];
    });
    watch(getDefaultOptions, () => {
      options.value = [...getDefaultOptions.value];
    });

    const filterFn = (val: any, update: any) => {
      if (!props.filterAction) {
        update();
        return;
      }
      if (val === '') {
        update(() => {
          options.value = [...props.defaultOptions];
          // here you have access to "ref" which
          // is the Vue reference of the QSelect
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        options.value = props.defaultOptions.filter((v: any) => {
          return v.label.toLowerCase().indexOf(needle) > -1;
        });
      });
    };
    return {
      options,
      getDefaultOptions,
      filterFn,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.q-field) {
  .q-field__control {
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

  .q-field__label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #565656;
  }
}

:deep(.q-field--disabled) {
  &.q-field {
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

    .q-field__input {
      display: none;
    }

    &__label {
      color: #878b87;
    }
  }
}
</style>
