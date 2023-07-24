<template>
  <q-menu
    :touch-position="touch"
    :context-menu="contextMenu"
  >
    <q-list
      dense
      class="menu-item"
    >
      <template v-for="menuItem in menu">
        <slot
          v-if="menuItem.show"
          :key="menuItem.key"
          :name="menuItem.key"
          :dataItem="menuItem"
        >
          <q-item
            clickable
            v-close-popup
            @click="menuItem.action"
          >
            <q-item-section>
              <q-icon
                size="16px"
                v-if="menuItem.icon"
                :name="menuItem.icon"
              ></q-icon>
              <span class="item-title">{{ menuItem.title }}</span>
            </q-item-section>
          </q-item>
        </slot>
      </template>
    </q-list>
  </q-menu>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MenuClickChat',
  props: {
    menu: {
      type: Array,
      default() {
        return [
          // {
          //   icon: 'bi-flag',
          //   title: t('workspace.channel.menuAction.setFlag'),
          //   show: props.listShowAction?.includes('setFlag'),
          //   action: () => emit('setFlag'),
          // },
        ];
      },
    },
    touch: {
      type: Boolean,
      default: true,
    },
    contextMenu: {
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
.menu-item {
  padding: 16px 8px;
  background: #ffffff;
  border: 1px solid #e9eae8;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .q-item__section {
    display: flex;
    justify-content: space-around;
    flex-wrap: nowrap;
  }
  .q-item:hover {
    color: #1c8c44;
  }
  .q-item {
    padding: 0;
    min-width: 216px;
    span {
      white-space: nowrap;
    }
  }
  .q-icon {
    width: 36px;
    height: 36px;
  }
}
</style>
