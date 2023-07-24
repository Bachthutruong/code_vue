<template>
  <q-header class="bg-white header-custom">
    <div
      class="header-filter block-filter flex justify-center items-center justify-between"
    >
      <div class="filter-left">
        <slot name="title">{{ $t(title) }}</slot>
      </div>
      <slot></slot>
      <div class="filter-right">
        <slot name="filter-right"></slot>
      </div>
    </div>
    <div
      v-if="hasMark"
      class="header-bottom-text text-body"
    >
      {{ $t('workspace.channel.markDone') }}
    </div>
  </q-header>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HeaderUnreadTask',
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    hasMark: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.q-header.header-custom {
  top: 97px;
}
.header-filter {
  width: 100%;
  padding: 12px 32px;

  .filter-left {
    font-weight: 500;
    font-size: 20px;
    line-height: 40px;
    color: #2f2f2f;
  }

  .filter-right {
    .filter-icon {
      :deep(.q-icon) {
        margin-right: 7.5px;
        font-size: 14px;
        top: -1px;
      }

      :deep(span) {
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
        text-transform: none;
      }

      .badge-total {
        margin-left: 12px;
        //width: 24px;
        height: 24px;
        min-width: 24px;
        span {
          margin: 0 auto;
          font-weight: 400;
          font-size: 12px;
          line-height: 16px;
          color: #ffffff;
          text-align: center;
        }
      }
    }

    .filter-select {
      padding: 0 24px 0 8px;

      i {
        width: 13px;
        height: 14px;
      }

      span {
        margin-left: 6px;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: #565656;
      }
    }

    .add-people {
      :deep(.q-icon) {
        margin-right: 7.5px;
        font-size: 14px;
        top: -1px;
      }
    }
  }
}

.q-expansion-item {
  width: 240px;

  :deep(.q-item__section) {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    padding: 8px 0 0;
  }

  :deep(.q-expansion-item__toggle-icon) {
    font-size: 16px;
  }

  .q-expansion-item__content {
    .q-item {
      padding: 0;

      .list-item {
        padding: 0;

        .q-checkbox {
          padding-left: 8px;

          :deep(.q-checkbox__bg) {
            border: 1px solid currentColor;
            border-radius: 4px;
          }

          :deep(.q-checkbox__label) {
            font-size: 14px;
            color: #2f2f2f;
            line-height: 20px;
            font-weight: 400;
          }
        }

        .q-checkbox:last-child {
          padding-bottom: 8px;
        }
      }
    }
  }
}

.q-list {
  .q-card {
    box-shadow: none;

    .q-card__actions {
      justify-content: space-between;
      margin: 0 8px;
      padding-top: 0;
    }

    .q-btn {
      padding: 0 16px;

      :deep(.q-btn__content) {
        font-size: 14px;
        font-weight: 500;
        text-transform: none;
        line-height: 20px;
      }
    }
  }
}

.block-filter {
  border-bottom: 1px solid #d3d3d3;
}

.header-bottom-text {
  color: #565656;
  margin: 16px 0 8px 32px;
}
</style>
