<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AsyncComponent',
  props: {
    index: Number,
    sent: Boolean,
  },
});
</script>

<template>
  <div :class="`row no-wrap items-center q-mx-sm justify-${sent ? 'end' : 'start'}`">
    <QSkeleton
      v-if="!sent"
      animation="none"
      type="QAvatar"
    ></QSkeleton>
    <QSkeleton
      class="on-left on-right"
      animation="none"
      type="text"
      width="150px"
      height="100px"
    ></QSkeleton>
    <QSkeleton
      v-if="sent"
      animation="none"
      type="QAvatar"
    ></QSkeleton>

    <QChatMessage
      class="q-mx-sm"
      :key="index"
    ></QChatMessage>
  </div>
</template>

<!--<style scoped lang="scss"></style>-->
