<template>
  <c-text-field
    :model-value="textDate"
    readonly
    :placeholder="placeholder"
    @click="actionShowMenu()"
  >
    <template v-slot:prepend>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
      </q-icon>
      <q-popup-proxy
        ref="refProxy"
        cover
        transition-show="scale"
        transition-hide="scale"
        class="picker-date"
      >
        <q-date
          v-model="proxyDate"
          :range="range"
          mask="YYYY-MM-DD"
        >
          <div class="row items-center justify-end q-gutter-sm">
            <q-btn
              label="Cancel"
              color="primary"
              flat
              v-close-popup
            ></q-btn>
            <q-btn
              label="OK"
              @click="actionOk"
              color="primary"
              flat
              v-close-popup
            ></q-btn>
          </div>
        </q-date>
      </q-popup-proxy>
    </template>

    <template v-slot:append>
      <q-btn-dropdown
        :dropdown-icon="dropdownIcon"
        content-class="menu-date"
        class="dropdown-date"
        :menu-offset="[10, 10]"
        v-model="showMenu"
      >
        <q-list
          :style="{
            width: minWidth,
          }"
        >
          <q-item
            @click="actionDate('on')"
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label>On...</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            content-class="menu-item"
            @click="actionDate('range')"
            clickable
            v-close-popup
          >
            <q-item-section>
              <q-item-label>Range...</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </template>
  </c-text-field>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';

export default defineComponent({
  name: 'selectDateOnAndRange',
  props: {
    placeholder: {
      type: String,
      default: 'Choose date',
    },
    minWidth: {
      type: String,
      default: '328px',
    },
    dropdownIcon: {
      type: String,
      default: 'bi-chevron-up',
    },
    modelValue: {
      type: [String, Object],
      default: null,
    },
  },
  emits: ['update:modelValue', 'actionOk'],
  setup(props, { emit }) {
    const state = reactive<{
      // proxyDate: any;
      range: boolean;
      showMenu: boolean;
    }>({
      // proxyDate: '',
      range: false,
      showMenu: false,
    });
    const actionShowMenu = () => {
      state.showMenu = true;
    };
    const proxyDate = computed<any>({
      get(): any {
        return props.modelValue;
      },
      set(val: string) {
        emit('update:modelValue', val);
      },
    });
    const textDate = computed(() => {
      if (state.range && typeof proxyDate.value !== 'string') {
        return `${proxyDate.value?.from} ~ ${proxyDate.value?.to}`;
      }
      return proxyDate.value || '';
    });
    const refProxy = ref();

    const actionDate = (value: string) => {
      state.range = value === 'range';
      state.showMenu = false;
      openDate();
    };
    const openDate = () => {
      refProxy.value.show();
    };

    const customWidth = computed(() => {
      return props.minWidth || false;
    });

    watch(proxyDate, () => {
      if (proxyDate.value && typeof proxyDate.value !== 'string') {
        state.range = true;
      } else {
        state.range = false;
      }
    });
    onMounted(() => {
      if (proxyDate.value && typeof proxyDate.value !== 'string') {
        state.range = true;
      } else {
        state.range = false;
      }
    });
    const actionOk = () => {
      if (proxyDate.value) {
        emit('actionOk');
      }
    };
    return {
      ...toRefs(state),
      refProxy,
      proxyDate,
      textDate,
      customWidth,
      actionDate,
      openDate,
      actionShowMenu,
      actionOk,
    };
  },
});
</script>

<style lang="scss">
.dropdown-date {
  width: 12px;
}
.menu-date {
  //width: 300px;
  width: v-bind(customWidth) !important;
  height: 120px;

  .q-list {
    padding: 16px 8px 16px;
  }
  //:deep(.q-btn) {
  //  &.q-btn-dropdown {
  //    width: 12px;
  //  }
  //}

  .q-list .q-item:hover {
    background-color: #e7f6e9;
    color: #1c8c44;
  }

  .q-item:nth-child(1) {
    margin: 0 0 8px;
    padding: 0;
    min-height: 40px;
    border-radius: 8px;

    .q-item__section {
      padding: 0 0 0 16px;
      height: 40px;
    }
  }

  .q-item:nth-child(2) {
    padding: 0;
    min-height: 40px;
    border-radius: 8px;

    .q-item__section {
      padding: 0 0 0 16px;
      height: 40px;
    }
  }
}

.picker-date {
  min-width: v-bind(minWidth) !important;
  //top: 135px !important;
  // left: 1216px !important;
}
</style>
