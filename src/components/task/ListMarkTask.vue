<template>
  <CTooltip
    classCustom="tooltipEmoji"
    placement="top"
    noAutoFocus
  >
    <slot name="markDone"></slot>
    <template #labelSlot>
      <div class="label-show-tooltip">
        <div class="label-show-tooltip-text">
          <span>{{ showLabel(markDone?.listUser, markDone?.type)?.text || '' }} </span>
          <span
            v-if="showLabel(markDone?.listUser)?.showAction"
            @click="showOther(markDone?.type)"
            class="label-show-tooltip-action"
          >
            {{ showLabel(markDone?.listUser)?.other }}
          </span>
        </div>
      </div>
    </template>
  </CTooltip>
  <CTooltip
    classCustom="tooltipEmoji"
    placement="top"
    noAutoFocus
  >
    <slot name="markCancel"></slot>
    <template #labelSlot>
      <div class="label-show-tooltip">
        <div class="label-show-tooltip-text">
          <span
            >{{ showLabel(markCancel?.listUser, markCancel?.type)?.text || '' }}
          </span>
          <span
            v-if="showLabel(markCancel?.listUser)?.showAction"
            @click="showOther(markCancel?.type)"
            class="label-show-tooltip-action"
          >
            {{ showLabel(markCancel?.listUser)?.other }}
          </span>
        </div>
      </div>
    </template>
  </CTooltip>
  <c-modal
    v-model="showModalReact"
    :title="$t('workspace.task.mark.modal.title')"
    :showFooter="false"
    class-modal="modal-confirm"
    @close="closeModal"
  >
    <div class="tab-list">
      <q-tabs
        v-model="tab"
        dense
        indicator-color="primary"
        align="left"
        narrow-indicator
        class="q-tabs__custom"
      >
        <q-tab
          v-for="item in santaListMark"
          :key="item.type"
          :name="item.type"
        >
          <div class="tab-list-emoji">
            <q-icon
              :name="item.type === 'DONE' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
              :color="item.type === 'DONE' ? 'primary' : 'negative'"
              size="24px"
            ></q-icon>
            <span>
              {{
                item.type === 'DONE'
                  ? $t('workspace.channel.modalTaskChannel.markDone')
                  : $t('workspace.channel.modalTaskChannel.markCancel')
              }}</span
            >
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
          v-for="item in santaListMark"
          :key="item.type"
          :name="item.type"
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
// @ts-ignore
import { computed, defineComponent, ref, reactive, toRefs } from 'vue';
import CTooltip from 'components/common/CTooltip.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ListMarkTask',
  components: {
    CTooltip,
  },
  props: {
    listMark: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  emits: [],
  setup(props, { emit }) {
    const { t } = useI18n();
    const showModalReact = ref(false);

    const state = reactive<{
      tab: string;
    }>({
      tab: '',
    });

    const santaListMark = computed(() => {
      if (!props.listMark) return [];
      console.log('props.listMark', props.listMark);
      let objectMark = {
        DONE: {
          type: 'DONE',
          listUser: [],
        },
        CANCEL: {
          type: 'CANCEL',
          listUser: [],
        },
      } as any;
      const marks = props.listMark as any;
      marks.forEach((item: any) => {
        // if (!objectMark[item.type]) {
        //   objectMark[item.type] = {
        //     type: item.type,
        //     listUser: [item.user],
        //   };
        // } else {
        // if (item.type)
        objectMark[item.type] = {
          ...objectMark[item.type],
          listUser: [...objectMark[item.type].listUser, item.user],
        };
        // }
      });
      console.log('objectMark', objectMark);
      const arrayResult = Object.values(objectMark);
      return arrayResult.filter((item: any) => item.listUser.length);
    });

    const markDone = computed(() => {
      return santaListMark.value?.find((item: any) => item.type === 'DONE') || null;
    });

    const markCancel = computed(() => {
      return santaListMark.value?.find((item: any) => item.type === 'CANCEL') || null;
    });
    console.log('santaListMark', santaListMark.value);
    const showLabel = (listUser: Array<any>, type?: string) => {
      if (!listUser || !listUser.length) return '';
      let text =
        type === 'DONE'
          ? t('workspace.task.mark.markDoneBy')
          : t('workspace.task.mark.markCancelBy');
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
    const showOther = (type: string) => {
      state.tab = type;
      showModalReact.value = true;
    };
    const closeModal = () => {
      showModalReact.value = false;
    };
    return {
      ...toRefs(state),
      santaListMark,
      showOther,
      showLabel,
      showModalReact,
      closeModal,
      markDone,
      markCancel,
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
    text-transform: none;
    margin-bottom: 8px;

    span {
      margin-left: 8px;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      color: #3c3c3c;
    }
  }

  .q-tabs {
    //padding: 0 52px;
    max-width: 400px;

    :deep(.q-tabs__arrow).q-icon {
      color: $primary;
      font-size: 20px;
    }

    .q-tab {
      padding: 0;
      margin-right: 24px;
      flex: none;
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
