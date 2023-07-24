<template>
  <q-avatar
    :size="size"
    :style="avatar ? '' : cssProps"
    v-bind="$attrs"
  >
    <img
      v-if="avatar"
      :src="avatar"
    />
    <span
      v-else
      class="text-uppercase"
      >{{ text || '' }}</span
    >
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { genColor } from 'src/helper/global';

export default defineComponent({
  name: 'CAvatar',
  props: {
    avatar: String,
    text: String,
    size: {
      type: String,
      default: '40px',
    },
  },
  setup() {
    const cssProps = computed(() => {
      const color = genColor(`${Math.random()}`);
      return {
        background: color.bgColor,
        color: color.textColor,
      };
    });
    return {
      cssProps,
    };
  },
});
</script>

<style scoped lang="scss">
:deep(.q-avatar) {
  img {
    object-fit: cover;
  }
}
</style>
