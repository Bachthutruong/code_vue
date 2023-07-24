<template>
  <div class="no-data">
    <div class="no-data-body">
      <q-img
        :src="imgNoData"
        spinner-color="white"
      />
      <slot name="bottom">
        <div class="bottom-title text-body-regular">
          {{ title }}
        </div>
        <slot name="action"></slot>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import emptyData from 'assets/default/empty-img-default.svg';
import emptyDataChat from 'assets/default/no_results_chat.svg';
import emptyDataWiki from 'assets/default/empty-wiki.svg';

export default defineComponent({
  name: 'noData',
  props: {
    title: {
      type: String,
      default: 'No data',
    },
    typeData: {
      type: String,
      default: 'task',
    },
  },
  setup(props) {
    const imgNoData = computed(() => {
      if (props?.typeData === 'task') return emptyData;
      if (props?.typeData === 'chat') return emptyDataChat;
      if (props?.typeData === 'wiki') return emptyDataWiki;
      return emptyData;
    });
    return {
      imgNoData,
    };
  },
});
</script>

<style scoped lang="scss">
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  &-body {
    text-align: center;
    min-width: 120px;
  }
  .bottom-title {
    color: #2f2f2f;
    text-align: center;
    margin-bottom: 16px;
  }

  .q-img {
    height: 116px;
    max-width: 120px;
    margin-bottom: 16px;
    :deep(img) {
      object-fit: contain !important;
    }
  }
}
</style>
