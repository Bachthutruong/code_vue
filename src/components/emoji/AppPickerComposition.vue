<template>
  <div>
    <slot v-if="showAction">
      <button>Toggle Picker</button>
    </slot>
    <q-menu v-bind="$attrs">
      <Picker
        class="picker"
        :data="emojiIndex"
        set="facebook"
        emoji="point_up"
        @select="convertEmoji"
      />
    </q-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// @ts-ignore
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast/src';
import * as data from 'emoji-mart-vue-fast/data/all.json';
import 'emoji-mart-vue-fast/css/emoji-mart.css';

export default defineComponent({
  name: 'AppPickerComposition',
  components: {
    Picker,
  },
  props: {
    showAction: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['updateEmoji', 'selectedEmoji'],
  setup(props, context) {
    let emojiIndex = new EmojiIndex(JSON.parse(JSON.stringify(data)));
    const convertEmoji = (emoji: any) => {
      context.emit('updateEmoji', emoji.native);
      selectedEmoji(emoji);
    };

    const selectedEmoji = (emoji: any) => {
      context.emit('selectedEmoji', emoji);
    };

    return {
      emojiIndex,
      convertEmoji,
    };
  },
});
</script>

<style lang="scss" scoped>
.picker {
  z-index: 100;
}
</style>
