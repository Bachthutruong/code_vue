<template>
  <q-menu
    touch-position
    context-menu
  >
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
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MenuClick;',
  props: {
    menu: {
      type: Array,
      default() {
        return [
          // {
          //   id: 1,
          //   icon: 'bi-eye',
          //   title: t('workspace.oneToOne.menuAction.markAsRead'),
          //   show: true,
          //   // show: props.listShowAction?.includes('markAsRead'),
          //   // disable: !props.listShowAction?.includes('markAsRead'),
          //   action: () => markAsRead(),
          // },
        ];
      },
    },
  },
  /* setup(props) {
    const showMenu = computed(() => {
      return props.menu?.filter((item:any) => item.show) || []
    })
    return showMenu
  }*/
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
