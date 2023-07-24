<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'cardChannelFilter',
  props: {
    cardItem: {
      type: Object,
      default() {
        return null;
      },
    },
    highlightSearch: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const searchText = computed(() => {
      if (props.highlightSearch) {
        return route?.query?.keyword || '';
      }
      return '';
    });
    const content = computed(() => {
      // const contentHtml = props?.cardItem?.name;
      // if (props.highlightSearch) {
      //   const search = searchText.value as string | null
      //   return highlightText(contentHtml,search);
      // }
      return props?.cardItem?.name;
    });
    return {
      content,
      searchText,
    };
  },
});
</script>

<template>
  <div class="card-filter cursor-pointer">
    <div class="card-filter-title">
      <div class="title-top flex items-center">
        <p class="text-body q-mb-none">
          {{ cardItem?.type === 'ONE_TO_ONE' ? 'One to one' : 'Channel' }}:
        </p>
        <span>{{ cardItem?.type === 'ONE_TO_ONE' ? '' : '#' }} </span>
        <span
          v-if="highlightSearch"
          v-highlight="searchText"
          v-html="content || ''"
        />
        <span
          v-else
          v-html="content || ''"
        />
      </div>
    </div>
    <div class="card-filter-description text-body-regular">
      <span>{{ cardItem?.description || 'No description' }}</span>
    </div>
    <div class="card-filter-count text-body-regular">
      <span>{{ cardItem?.members }} people</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-filter {
  padding: 16px;
  border: 1px solid #d3d3d3;
  border-radius: 8px;
  height: 112px;
  box-sizing: border-box;
  margin: 0 32px 24px 32px;
  &-title {
    margin-bottom: 8px;
    p {
      color: #565656;
    }
  }
  &-description {
    margin-bottom: 8px;
    color: #565656;
  }
  &-count {
    color: #878b87;
  }
  &:hover {
    border: 1px solid #1c8c44;
  }
}

.title-top {
  margin-bottom: 5px;
  font-weight: 500;
  span {
    color: #1c8c44;
    margin-left: 5px;
  }
}
</style>
