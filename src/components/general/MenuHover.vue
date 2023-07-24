<template>
  <div>
    <q-list
      dense
      class="menu-item"
    >
      <template v-for="(menuItem, index) in menu">
        <q-item
          v-if="menuItem.show"
          :key="index"
          clickable
          v-close-popup
          @click="menuItem.action"
        >
          <q-item-section>
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              max-width="114px"
              max-height="36px"
              class="tool-tip tool-tip-card bg-green-1"
            >
              <span class="item-title">{{ menuItem.title }}</span>
            </q-tooltip>
            <q-icon
              size="16px"
              v-if="menuItem.icon"
              :name="menuItem.icon"
            />
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'menuHover',
  props: {
    menu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.menu-item {
  display: flex;
  min-height: 36px;
  padding: 0;
  max-width: 144px;
  background: #ffffff;
  border: 1px solid #e9eae8;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .q-item:hover {
    color: #1c8c44;
  }
  .q-item {
    padding: 0;
  }
  .q-icon {
    width: 36px;
    height: 36px;
  }
}
</style>
