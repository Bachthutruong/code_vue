<template>
  <div
    class="show-date"
    :class="{
      'active-date-new-item': activeNewItem,
    }"
  >
    <div
      v-if="dateTime?.time"
      class="show-date-box"
    >
      <q-separator />
      <div class="show-date-box-text text-body">
        <span v-if="dateTime?.time">
          {{ dateTime?.time || '' }}
        </span>
        <span
          v-if="dateTime?.total"
          class="dot"
        ></span>
        <span v-if="dateTime?.total">
          {{ dateTime?.total }}
          {{
            $t(
              'workspace.calendar.taskCalendar.task',
              Number(dateTime?.total) > 1 ? 2 : 1,
            )
          }}
        </span>
      </div>
      <q-separator />
      <div
        v-if="activeNewItem"
        class="show-date-box-new"
      >
        {{ $t('global.new') }}
      </div>
    </div>
    <div
      v-if="activeNewItem && !dateTime?.time"
      class="show-date-box show-date-box-no-date"
    >
      <q-separator />
      <div class="show-date-box-new">
        {{ $t('global.new') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'showDateTask',
  props: {
    dateTime: {
      type: Object,
      default() {
        return {};
      },
    },
    activeNewItem: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped lang="scss">
.show-date {
  width: 100%;
  min-height: 60px;
  background: white;
  text-align: center;
  padding: 12px;
  color: black;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 99;
  transition: all 0.3s;
  &-box {
    display: flex;
    justify-content: center;
    align-items: center;
    hr {
      width: calc(100% / 2 - 120px);
    }
    &-text {
      min-width: 120px;
      white-space: nowrap;
      //margin: 0 8px;
      border: 1px solid #d3d3d3;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.1);
      border-radius: 100px;
      height: 36px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 8px 16px;
      color: #3c3c3c;
    }

    .dot {
      width: 4px;
      height: 4px;
      background: #3c3c3c;
      margin: 0 8px;
      border-radius: 50%;
    }
  }
}

.active-date-new-item {
  .show-date-box {
    &.show-date-box-no-date {
      hr {
        width: calc(100% - 60px);
      }
    }
    hr {
      background-color: #f44436;
    }
    &-text {
      border: 1px solid #f44436;
    }
    &-new {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #e53934;
      margin-left: 8px;
    }
  }
}
</style>
