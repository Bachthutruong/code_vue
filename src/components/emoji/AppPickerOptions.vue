<template>
  <div class="row list-react">
    <div
      v-for="(item, index) in santaListEmoji"
      :key="index"
    >
      <CTooltip
        classCustom="tooltipEmoji"
        v-if="item.listUser?.length"
      >
        <q-chip
          outline
          :color="item.active ? 'primary' : 'neutral-5'"
          clickable
          :class="{
            'active-react': item.active,
          }"
          @click="actionEmoji(item)"
        >
          <emoji
            :data="emojiIndex"
            :emoji="item.emojiItem"
            :size="size"
            :set="setEmoji"
          />
          <span class="count-react">{{ item.listUser.length }}</span>
        </q-chip>

        <template #labelSlot>
          <div class="label-show-tooltip">
            <div class="label-show-tooltip-emoji">
              <emoji
                :data="emojiIndex"
                :emoji="item.emojiItem"
                :size="32"
                :set="setEmoji"
              />
            </div>
            <div class="label-show-tooltip-text">
              <span> {{ item.emoji }} {{ showLabel(item.listUser)?.text || '' }} </span>
              <span
                v-if="showLabel(item.listUser)?.showAction"
                @click="showOther"
                class="label-show-tooltip-action"
              >
                {{ showLabel(item.listUser)?.other }}
              </span>
            </div>
          </div>
        </template>
      </CTooltip>
    </div>
  </div>
  <c-modal
    v-model="showModalReact"
    :title="$t('workspace.task.react.modal.title')"
    class-modal="modal-confirm"
    :showFooter="false"
    @close="closeModal"
  >
    <div class="tab-list">
      <q-tabs
        v-model="tab"
        dense
        indicator-color="primary"
        align="left"
        narrow-indicator
        left-icon="bi-chevron-left"
        right-icon="bi-chevron-right"
        class="q-tabs__custom"
      >
        <q-tab
          v-for="item in santaListEmoji"
          :key="item.emoji"
          :name="item.emoji"
        >
          <div class="tab-list-emoji">
            <emoji
              :data="emojiIndex"
              :emoji="item.emojiItem"
              :size="24"
              :set="setEmoji"
            />
            <span class="count-react">{{ item.listUser.length }}</span>
          </div>
        </q-tab>
      </q-tabs>
      <q-separator />
      <q-tab-panels
        v-model="tab"
        animated
        class="tab-panels-list"
      >
        <q-tab-panel
          v-for="item in santaListEmoji"
          :key="item.emoji"
          :name="item.emoji"
        >
          <q-list class="list-user">
            <q-item
              clickable
              v-ripple
              v-for="user in item.listUser"
              :key="user.id"
            >
              <q-item-section avatar>
                <CAvatar
                  size="32px"
                  class="avatar"
                  :avatar="user?.avatar?.url"
                  :text="user?.full_name?.split('')[0] || user?.email?.split('')[0] || ''"
                >
                </CAvatar>
              </q-item-section>

              <q-item-section>
                {{ user?.full_name || user?.email || '' }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </c-modal>
</template>

<script lang="ts">
import data from 'emoji-mart-vue-fast/data/all.json';
// @ts-ignore
import { Emoji, EmojiIndex } from 'emoji-mart-vue-fast/src';
import { computed, defineComponent, ref, reactive, toRefs } from 'vue';
import CTooltip from 'components/common/CTooltip.vue';
import { useI18n } from 'vue-i18n';

let emojiIndex = new EmojiIndex(JSON.parse(JSON.stringify(data)));
export default defineComponent({
  name: 'AppPickerEmoji',
  components: {
    Emoji,
    CTooltip,
  },
  props: {
    listEmoji: {
      type: Array,
      default() {
        return [
          // {
          //   emoji: ':+1::skin-tone-1:'
          // },
          // {
          //   emoji: ':heart:'
          // },
          // ':+1::skin-tone-1:',
          // ':heart:',
          // // thuong thuong
          // ':smiling_face_with_3_hearts:',
          // // haha
          // ':laughing:',
          // // wow
          // ':open_mouth:',
          // // buon
          // ':smiling_face_with_tear:',
          // // phan no
          // ':angry:',
        ];
      },
    },
    size: {
      type: Number,
      default: 16,
    },
    setEmoji: {
      type: String,
      default: 'facebook',
    },
  },
  emits: ['actionEmoji'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const showModalReact = ref(false);

    const state = reactive<{
      tab: string;
    }>({
      tab: '',
    });

    const actionEmoji = (item: any) => {
      emit('actionEmoji', item);
    };
    const santaListEmoji = computed(() => {
      if (!props.listEmoji) return [];

      let listReactEmoji: any;
      listReactEmoji = props.listEmoji.map((item: any) => {
        return {
          ...item,
          emojiItem: emojiIndex.findEmoji(item.emoji),
        };
      });
      return listReactEmoji;
    });
    const showLabel = (listUser: Array<any>) => {
      if (!listUser || !listUser.length) return '';
      let text = t('workspace.task.react.reactBy');
      const showAction = listUser.length > 3;
      let other = `+ ${Math.abs(listUser.length - 3)} ${t(
        'workspace.task.react.other',
        listUser.length > 4 ? 2 : 1,
      )}`;
      let listNameReact = [] as any;
      listUser.forEach((item: any, index: number) => {
        if (index < 3) listNameReact.push(item?.full_name || item?.email || '');
      });
      text = `${text} ${listNameReact.join(', ')}`;
      return {
        showAction,
        text,
        other,
      };
    };
    const showOther = () => {
      state.tab = santaListEmoji.value[0].emoji;
      showModalReact.value = true;
    };
    const closeModal = () => {
      showModalReact.value = false;
    };
    return {
      ...toRefs(state),
      actionEmoji,
      emojiIndex,
      santaListEmoji,
      showOther,
      showLabel,
      showModalReact,
      closeModal,
    };
  },
});
</script>
<style lang="scss" scoped>
.list-react {
  .q-chip {
    background: #f8f8f8 !important;
    padding: 6px 8px 6px 2px;

    &.active-react {
      background: #e7f6e9 !important;

      .count-react {
        color: #1c8c44;
      }
    }
  }
}

.count-react {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #2f2f2f;
}

.tab-list {
  &-emoji {
    display: flex;
    align-items: center;
    text-align: center;

    span {
      margin-left: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #3c3c3c;
    }
  }

  .q-tabs {
    padding: 0px 52px;

    :deep(.q-tabs__arrow).q-icon {
      color: $primary;
      font-size: 20px;
    }

    .q-tab {
      padding: 0;
      margin-right: 24px;
    }
  }
}

.tab-panels-list {
  .q-tab-panel {
    padding: 16px 0;

    .list-user {
      height: 228px;

      .q-item__section--avatar {
        min-width: 32px;
      }

      .q-item {
        padding: 8px 0;
      }
    }
  }
}
</style>
<style lang="scss">
.label-show-tooltip {
  display: flex;

  &-emoji {
    margin-right: 12px;
  }

  &-text {
    text-align: start;
  }

  &-action {
    color: #1c8c44 !important;
    margin-left: 4px;
    cursor: pointer;
  }

  span {
    word-break: break-word;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    color: #2f2f2f;
    font-weight: 400;
  }
}
</style>
