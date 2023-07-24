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
  name: 'menuClickOneToOne',
  props: {
    listShowAction: {
      type: Array,
      default() {
        return [];
      },
    },
    itemMenu: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  emits: ['muteChannel', 'closeConversation', 'markAsRead'],
  setup(props, { emit }) {
    const muteChannel = () => {
      emit('muteChannel');
    };
    const closeConversation = () => {
      emit('closeConversation');
    };
    const markAsRead = () => {
      emit('markAsRead');
    };
    const { t } = useI18n();

    const menu = computed(() => {
      return [
        {
          id: 1,
          icon: '',
          title: props?.itemMenu?.is_mute
            ? t('workspace.oneToOne.menuAction.unmuteChannel')
            : t('workspace.oneToOne.menuAction.muteChannel'),
          show: true,
          disable: props?.itemMenu?.is_mute,
          action: () => muteChannel(),
        },
        {
          id: 2,
          icon: '',
          title: t('workspace.oneToOne.menuAction.closeConversation'),
          show: true,
          disable: false,
          action: () => closeConversation(),
        },
        {
          id: 3,
          icon: 'bi-eye',
          title: t('workspace.oneToOne.menuAction.markAsRead'),
          show: props?.itemMenu?.total > 0,
          disable: props?.itemMenu?.total === 0,
          action: () => markAsRead(),
        },
      ];
    });
    return {
      menu,
    };
  },
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
