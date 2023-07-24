<template>
  <q-menu v-bind="$attrs">
    <q-list
      dense
      class="menu-item"
    >
      <template v-for="(menuItem, index) in menu">
        <q-item
          v-if="!menuItem.hidden"
          :key="index"
          clickable
          v-close-popup
          :disable="menuItem.disable"
          @click="menuItem.action ? menuItem.action : () => {}"
        >
          <q-item-section>
            <q-icon
              size="16px"
              v-if="menuItem.icon"
              :name="menuItem.icon"
            ></q-icon>
            <span>{{ menuItem.title }}</span>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'menuClick',
  props: {
    menu: {
      type: Array,
      default() {
        return [
          // {
          //   id: 1,
          //   icon: 'bi-flag',
          //   title: 'Set flag',
          //   hidden: true/false,
          //   disable: true/false,
          //   action: () => callback(),
          // },
        ];
      },
    },
  },
  // emits: [],
  // setup(props, { emit }) {
  //
  //   return {
  //     // ...toRefs(state),
  //   };
  // },
});
</script>

<style lang="scss" scoped>
.q-menu {
  padding: 12px 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);

  .q-list {
    min-width: 200px;
  }
}
</style>
