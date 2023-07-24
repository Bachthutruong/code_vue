<template>
  <div>
    <q-list
      dense
      class="menu-item"
    >
      <template v-for="(menuItem, index) in menuDefault">
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
              max-width="300px"
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
            <!--            <CTooltip-->
            <!--              placement="top"-->
            <!--              bg-color="#E7F6E9"-->
            <!--              text-color="#2F2F2F"-->
            <!--            >-->
            <!--              <q-icon-->
            <!--                size="16px"-->
            <!--                v-if="menuItem.icon"-->
            <!--                :name="menuItem.icon"-->
            <!--              />-->
            <!--              <template #labelSlot>-->
            <!--                <span class="item-title">{{ menuItem.title }}</span>-->
            <!--              </template>-->
            <!--            </CTooltip>-->
          </q-item-section>
        </q-item>
      </template>
      <q-item
        v-if="menuMore?.length > 0"
        clickable
        v-close-popup
      >
        <q-item-section>
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
            max-width="300px"
            max-height="36px"
            class="tool-tip tool-tip-card bg-green-1"
          >
            <span class="item-title no-wrap">{{
              $t('workspace.chat.menuAction.moreAction')
            }}</span>
          </q-tooltip>
          <q-icon
            size="16px"
            name="bi-three-dots-vertical "
          />
          <!--          <CTooltip placement="top-end">-->
          <!--            <q-icon-->
          <!--              size="16px"-->
          <!--              name="bi-three-dots-vertical "-->
          <!--            />-->
          <!--            <template #labelSlot>-->
          <!--              <span class="item-title no-wrap">{{-->
          <!--                $t('workspace.chat.menuAction.moreAction')-->
          <!--              }}</span>-->
          <!--            </template>-->
          <!--          </CTooltip>-->
        </q-item-section>
        <MenuClickChat
          :menu="menuMore"
          :context-menu="false"
        ></MenuClickChat>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import MenuClickChat from 'components/chat/MenuClickChat.vue';
export default defineComponent({
  name: 'MenuHoverChat',
  components: { MenuClickChat },
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
  },
  setup(props) {
    const menuDefault = computed(() => {
      if (props?.menu) {
        return props.menu.slice(0, 2);
      }
      return [];
    });
    const menuMore = computed(() => {
      if (props?.menu) {
        return props.menu.slice(2, props.menu.length);
      }
      return [];
    });
    return {
      menuDefault,
      menuMore,
    };
  },
});
</script>

<style lang="scss" scoped>
.menu-item {
  display: flex;
  min-height: 36px;
  padding: 0;
  //max-width: 144px;
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

  .tool-tip {
    .item-title {
      font-size: 16px;
      line-height: 24px;
      color: #2f2f2f;
      font-weight: 400;
      margin-left: 16px;
    }
  }
}
</style>
