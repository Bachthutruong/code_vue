<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'cardListImg',
  props: {
    image: {
      type: Object,
      default() {
        return {
          url: '',
          name: '',
        };
      },
    },
  },
});
</script>

<template>
  <div
    v-if="image?.url"
    class="box-img-chat"
  >
    <img
      :src="image?.url"
      :alt="image?.name"
    />
  </div>
</template>

<style scoped lang="scss">
.box-img-chat {
  img {
    object-fit: cover;
    max-height: 232px;
    border-radius: 8px;
  }
}
</style>
