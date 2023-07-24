<template>
  <div class="block-bar">
    <div class="top-invite flex justify-between">
      <slot
        name="left"
        :pageName="pageName"
      >
        <span>{{ pageName }}</span>
      </slot>
      <slot name="right"> </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRoute } from 'vue-router';
export default defineComponent({
  name: 'CBreadcrumbs',
  setup() {
    const route = useRoute();
    const pageName = computed(() => {
      return route.meta.title || route.name;
    });

    return {
      pageName,
    };
  },
});
</script>

<style scoped lang="scss">
.block-bar {
  .top-invite {
    padding: 16px 32px;
    //border-top: 1px solid #d3d3d3;
    border-bottom: 1px solid #d3d3d3;
    align-items: center;

    span {
      font-weight: 500;
      font-size: 20px;
      line-height: 28px;
    }

    .q-btn {
      background-color: #1c8c44;
      color: #fff;
      min-height: 32px;
      width: 133px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;

      .q-btn__content {
        width: 133px;
        .q-icon {
          font-size: 16px;
          margin-right: 8px;
        }
        span {
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          text-transform: none;
        }
      }
    }
  }
}
</style>
