<template>
  <div class="block-channel row">
    <div
      v-if="customSlots['left-radio']"
      class="block-left col-1"
    >
      <div class="left-radio">
        <slot name="left-radio"></slot>
      </div>
    </div>
    <div
      class="block-right"
      :class="{
        'col-11': customSlots['left-radio'] || customSlots['right-action'],
        'col-12': !customSlots['left-radio'] && !customSlots['right-action'],
      }"
    >
      <slot name="card-top"></slot>
      <div
        v-if="formChannelInfo?.is_pin"
        class="box-pin"
      >
        <q-icon name="bi-pin-fill"></q-icon>
        <span class="text-body-regular text-neutral-1">{{
          $t('workspace.channel.pinTask')
        }}</span>
      </div>

      <q-card
        class="my-card"
        :class="classCard[formChannelInfo?.statusBackground]"
        :cardItem="formChannelInfo"
      >
        <q-card-section class="flex justify-between relative-position">
          <div
            class="left-top"
            @click="$emit('detailTask')"
          >
            <div class="block-infor flex">
              <div class="block-avatar">
                <CAvatar
                  size="40px"
                  :avatar="formChannelInfo?.creator?.avatar"
                  :text="
                    formChannelInfo?.creator?.full_name?.split('')?.[0] ||
                    formChannelInfo?.creator?.email?.split('')?.[0] ||
                    ''
                  "
                />
              </div>
              <div class="block-status">
                <div class="block-time">
                  <div class="d-flex flex-center items-center">
                    <template
                      v-if="
                        formChannelInfo?.other?.activities?.length && typeData === 'wiki'
                      "
                    >
                      <span>{{ $t('workspace.channel.cardChannel.edited') }}</span>
                      <span class="date-time">
                        {{
                          formatdateToString(
                            formChannelInfo?.other?.activities[0]?.created_at || '',
                          )
                        }}
                      </span>
                    </template>
                    <template v-else>
                      <span>{{ dateStatus }}</span>
                      <span class="date-time">
                        {{ formatdateToString(formChannelInfo?.date?.time || '') }}
                      </span>
                      <div
                        v-if="formChannelInfo?.repeat"
                        class="dot"
                      ></div>
                      <div v-if="formChannelInfo?.repeat">
                        <q-icon
                          name="bi-repeat"
                          size="14px"
                          color="neutral-3"
                        />
                        <span class="text-h5 box-repeat-text text-neutral-3">
                          {{ formChannelInfo?.repeatContent }}
                        </span>
                      </div>
                    </template>
                  </div>
                </div>
                <span class="block-fullname">
                  {{
                    formChannelInfo?.creator?.full_name || formChannelInfo?.creator?.email
                  }}
                </span>
              </div>
            </div>
            <div
              class="block-content text-subtitle2 ellipsis"
              :class="formChannelInfo?.doneTask ? 'text-line-through content-text' : ''"
              v-if="
                formChannelInfo?.date?.status !== 'draft' ||
                formChannelInfo?.priority !== 'Low'
              "
            >
              <span>{{ typeData === 'task' ? 'Content: ' : 'Topic: ' }}</span>
              <div
                v-if="formChannelInfo.is_read || typeData === 'wiki'"
                class="text-body-regular text-subtitle2 date-status"
                :class="classText[formChannelInfo?.date?.status]"
              >
                <span
                  v-if="highlightSearch"
                  v-highlight="searchText"
                  v-html="content || ''"
                />
                <span
                  v-else
                  v-html="content || ''"
                />
              </div>
              <span
                v-if="!formChannelInfo.is_read && typeData === 'task'"
                class="un-read"
              >
                <img :src="unread" />
                <span>{{ typeData === 'task' ? 'Unread task!' : 'Unread post!' }}</span>
              </span>
            </div>
            <div
              v-if="typeData === 'wiki'"
              class="block-attachments ellipsis d-block"
            >
              <div
                v-if="formChannelInfo?.is_read"
                class="text-body-regular text-subtitle2 d-contents"
              >
                <span
                  v-html="convertHtmlToString(formChannelInfo?.other.content) || ''"
                />
              </div>
              <div
                v-else
                class="text-body-regular text-subtitle2 attachments-un-read"
              >
                <img :src="unread" />
                <span>{{ 'Unread post!' }}</span>
              </div>
            </div>
            <div
              v-if="typeData === 'task'"
              class="due"
            >
              <q-chip
                square
                size="16px"
                class="block-due"
                :class="statusTask"
              >
                {{ $t('workspace.channel.cardChannel.dueDate') }}:
                <span class="text-body-regular due-date">{{
                  formatdateToString(formChannelInfo?.due_time)
                }}</span>
              </q-chip>
            </div>
            <div
              v-if="typeData === 'task'"
              class="block-priority"
            >
              {{ $t('workspace.channel.cardChannel.priority') }}:
              <span
                v-if="formChannelInfo?.priority === 'Medium'"
                class="block-priority__tag medium text-body"
                >{{ formChannelInfo?.priority }}</span
              >
              <span
                v-else-if="formChannelInfo?.priority === 'Low'"
                class="block-priority__tag low text-body"
                >{{ formChannelInfo?.priority }}</span
              >
              <span
                v-else-if="formChannelInfo?.priority === 'High'"
                class="block-priority__tag high text-body"
                >{{ formChannelInfo?.priority }}</span
              >
              <span class="card-hover">{{
                $t('workspace.channel.cardChannel.taskDetail')
              }}</span>
            </div>
            <div
              class="block-attachments ellipsis"
              v-if="
                formChannelInfo?.date?.status !== 'draft' ||
                (formChannelInfo?.priority !== 'Low' &&
                  formChannelInfo?.priority !== 'Medium')
              "
            >
              <q-icon name="bi-paperclip" />
              {{ $t('workspace.channel.cardChannel.attachments') }}:
              <span
                v-if="formChannelInfo.is_read"
                class="attachments-total"
              >
                <span v-if="formChannelInfo?.attachments > 0">
                  {{ formChannelInfo?.attachments }}
                  file
                </span>
                <span
                  v-else
                  class="attachments-total-none"
                >
                  none
                </span>
              </span>
              <span
                v-if="!formChannelInfo.is_read"
                class="attachments-un-read"
              >
                <img :src="unread" />
                <span>{{ typeData === 'task' ? 'Unread task!' : 'Unread post!' }}</span>
              </span>
              <span
                v-if="
                  typeData === 'wiki' &&
                  !['schedule', 'draft'].includes(formChannelInfo?.date?.status)
                "
                class="attachments-detail"
                >{{ $t('workspace.channel.cardChannel.wikiDetail') }}</span
              >
            </div>
            <div
              v-if="formChannelInfo?.flag"
              :style="
                formChannelInfo?.flag && formChannelInfo?.warning ? 'top: 108px' : ''
              "
              class="block-flag"
            >
              <q-icon name="bi-flag-fill" />
              <span>{{ $t('workspace.channel.cardChannel.flag') }}</span>
            </div>
          </div>
          <div
            v-if="formChannelInfo?.action?.includes('edit')"
            @click="$emit('editTask')"
            class="block-edit"
          >
            <q-icon name="bi-pencil-square" />
          </div>

          <div
            v-if="formChannelInfo?.action?.includes('delete')"
            class="block-delete"
            @click="deleteTask"
          >
            <q-icon name="bi-trash3" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions
          @click="$emit('detailTask')"
          vertical
          v-if="
            formChannelInfo.can_access &&
            formChannelInfo.is_read &&
            ['received', 'sent'].includes(formChannelInfo?.date?.status)
          "
        >
          <div class="block-bottom flex">
            <div class="bottom-left flex items-center justify-between">
              <div
                v-if="typeData === 'task'"
                class="bottom-done"
              >
                <q-icon name="bi-check-circle" />
                <span
                  >{{ formChannelInfo?.markDone }}
                  {{ $t('workspace.channel.cardChannel.done') }}</span
                >
              </div>
              <div class="bottom-comment">
                <q-icon name="bi-chat-dots" />
                <span
                  >{{ formChannelInfo?.comment }}
                  {{ $t('workspace.channel.cardChannel.comments') }}</span
                >
              </div>
              <div
                v-if="formChannelInfo.is_mute && typeData === 'task'"
                class="bottom-mute"
              >
                <q-icon name="bi-bell-slash" />
                <span>{{ $t('workspace.channel.cardChannel.muteComments') }}</span>
              </div>
              <div
                v-if="formChannelInfo?.reminder?.id && typeData === 'task'"
                class="bottom-mute"
              >
                <q-icon name="bi-clock" />
                <span>{{ $t('workspace.channel.cardChannel.reminder') }}</span>
              </div>
            </div>
            <q-space />
            <div
              v-if="typeData === 'task'"
              class="bottom-right flex items-center"
            >
              <q-icon
                size="24px"
                color="primary"
                :name="formChannelInfo?.reads ? 'bi-check-all' : 'bi-check'"
              />
            </div>
          </div>
        </q-card-actions>
        <MenuClick
          v-if="!hiddenMenu && menu.length"
          :menu="menu"
        />
        <div
          class="menu-hover"
          v-if="!hiddenMenu && menu.length"
        >
          <MenuHoverChat :menu="menu" />
        </div>
      </q-card>
    </div>
    <div
      v-if="customSlots['right-action']"
      class="block-left col-1"
    >
      <div class="right-action">
        <slot name="right-action"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, useSlots, watchEffect } from 'vue';
// import MenuHover from 'src/components/general/MenuHover.vue';
import { date } from 'quasar';
import { useChannelStore } from 'stores/channel';
import folder from 'src/assets/t-message/folder.svg';
import foldernone from 'src/assets/t-message/foldernone.svg';
import unread from 'src/assets/t-message/unread.svg';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useWorkspaceStore } from 'stores/workspace';
import { convertHtmlToString } from 'src/helper/validForm';
// // @ts-ignore
// import Mark from 'mark.js/dist/mark.min'
interface typeclassCard {
  success: string;
  disable: string;
  basic: string;
}

interface typeclassText {
  sent: any;
}

export default defineComponent({
  name: 'CardChannel',
  methods: { convertHtmlToString },
  components: {
    // MenuHover,
  },
  emits: [
    'setFlag',
    'forwardTask',
    'editTask',
    'markAsRead',
    'deleteTask',
    'reminderTask',
    'pinTask',
    'detailTask',
  ],
  props: {
    hiddenMenu: {
      type: Boolean,
      default: false,
    },
    hiddenPin: {
      type: Boolean,
      default: false,
    },
    highlightSearch: {
      type: Boolean,
      default: false,
    },
    formChannelInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    typeData: {
      type: String,
      default: 'task',
    },
  },
  setup(props, { emit }) {
    watchEffect(() => {
      if (props.formChannelInfo) {
        console.log('props.formChannelInfo', props.formChannelInfo.id);
      }
    });
    const { t } = useI18n();

    const slots = useSlots();
    const channelStore = useChannelStore();
    const workspaceStore = useWorkspaceStore();

    const channelOwned = computed(
      () => channelStore.isOwner,
      // true
    );
    const permissionChannel = computed(() => channelStore.getRolePermissionChannel);
    const createWiki = computed(() => permissionChannel.value.createWiki);
    const workspaceRoleAdmin = computed(
      () => workspaceStore.workspaceRoleAdmin,
      // true
    );
    const workspaceRoleOwner = computed(
      () => workspaceStore.workspaceRoleOwner,
      // true
    );
    const permissionEditAndRemoveWiki = computed(
      () =>
        // true
        (createWiki.value && props.formChannelInfo?.date?.status === 'sent') ||
        channelOwned.value ||
        workspaceRoleAdmin.value ||
        workspaceRoleOwner.value ||
        false,
    );

    const permissionPinTask = computed(
      () =>
        permissionChannel.value?.pinTask ||
        channelOwned.value ||
        workspaceRoleAdmin.value ||
        workspaceRoleOwner.value ||
        false,
    );

    const route = useRoute();

    const customSlots = computed(() => {
      const { ...filteredSlots } = slots;
      return filteredSlots;
    });
    const formatdateToString = (dateTime: any) => {
      return date.formatDate(dateTime, 'HH:mm, MMM Do YYYY');
    };
    const searchText = computed(() => {
      if (props.highlightSearch) {
        return route?.query?.keyword || '';
      }
      return '';
    });

    const content = computed(() => {
      // const contentHtml = props?.formChannelInfo?.content;
      // if (props.highlightSearch) {
      //   const search = searchText.value as string | null
      //   // return highlightText(contentHtml,search);
      //   return highlightSearch(contentHtml,search);
      // }
      return props?.formChannelInfo?.content;
    });

    const state = reactive<{
      classCard: typeclassCard;
      classText: typeclassText;
    }>({
      classCard: {
        success: 'card-success',
        disable: 'card-disable',
        basic: 'card-basic',
      },
      classText: {
        sent: 'sent-date',
      },
    });

    // const permissionEdit = computed(() => {
    //   return channelStore.checkOwnerTask(props?.formChannelInfo?.creator?.id);
    // });
    const menu = computed(() => {
      if (!props.formChannelInfo?.is_read) {
        return [];
      }
      const menuAction = [
        //  chat
        {
          icon: 'bi-pin',
          title: t(
            props.formChannelInfo?.is_pin
              ? 'workspace.channel.menuAction.unpinTask'
              : 'workspace.channel.menuAction.pinTask',
          ),
          show: props.typeData === 'task' && permissionPinTask.value && !props.hiddenPin,
          action: () => emit('pinTask'),
        },
        {
          icon: 'bi-flag',
          title: t('workspace.channel.menuAction.setFlag'),
          show: props.typeData === 'task',
          action: () => emit('setFlag'),
        },
        {
          icon: 'bi-forward',
          title: t('workspace.channel.menuAction.forwardTask'),
          show: props.typeData === 'task',
          action: () => emit('forwardTask'),
        },
        {
          icon: 'bi-clock',
          title: t('workspace.channel.menuAction.reminderTask'),
          show: props.typeData === 'task' && statusTask.value === 'due-time',
          action: () => emit('reminderTask'),
        },

        //  wiki
        {
          icon: 'bi-gear',
          title: t('workspace.channel.menuAction.edit'),
          show: props.typeData === 'wiki' && permissionEditAndRemoveWiki.value,
          action: () => emit('editTask'),
        },
        {
          icon: 'bi-trash3',
          title: t('workspace.channel.menuAction.delete'),
          show: props.typeData === 'wiki' && permissionEditAndRemoveWiki.value,
          action: () => emit('deleteTask'),
        },
      ];
      return menuAction.filter((item: any) => item.show);
    });

    const deleteTask = () => {
      emit('deleteTask');
    };
    const editTask = () => {
      emit('editTask');
    };

    const statusTask = computed(() => {
      // formChannelInfo?.date?.status !== 'draft'
      if (!props.formChannelInfo?.due_time) return '';
      if (props.formChannelInfo?.doneTask) return 'task-done';
      if (props.formChannelInfo.statusTask === 'CANCEL') return 'block-cancel';
      if (props.formChannelInfo?.due?.status === 'overdue') return 'overdue-time';
      if (props.formChannelInfo.is_read) return 'due-time';
      return '';
    });

    const dateStatus = computed(() => {
      if (props?.formChannelInfo?.date?.status === 'sent') {
        return t('workspace.channel.cardChannel.sent');
      }
      if (props?.formChannelInfo?.date?.status === 'received') {
        return t('workspace.channel.cardChannel.received');
      }
      if (props?.formChannelInfo?.date?.status === 'draft') {
        return t('workspace.channel.cardChannel.draft');
      }
      if (props?.formChannelInfo?.date?.status === 'schedule') {
        return t('workspace.channel.cardChannel.scheduled');
      }
      return '';
    });

    return {
      ...toRefs(state),
      formatdateToString,
      deleteTask,
      editTask,
      menu,
      customSlots,
      statusTask,
      searchText,
      content,
      dateStatus,
    };
  },
  data() {
    return {
      folder,
      foldernone,
      unread,
    };
  },
});
</script>

<style lang="scss" scoped>
.block-channel {
  cursor: pointer;
  padding: 8px 32px 8px;

  .block-left {
    margin: auto;

    .left-title {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #565656;
    }

    .left-radio {
      :deep(.q-checkbox__icon) {
        font-size: 32px;
        color: #878b87;

        &.bi-x-circle-fill {
          color: #f44436;
        }
      }
    }
  }

  .block-right {
    .my-card {
      box-shadow: none;
      border-radius: 8px;
      position: relative;

      .q-card__section {
        padding: 0;
      }

      .menu-hover {
        float: left;
        list-style: none;
        margin: 0;
        padding: 0;
        position: absolute;
        top: 11px;
        right: 18px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease-out, visibility 0.1s 0.1s linear;
      }
    }

    .my-card:hover .menu-hover {
      opacity: 1;
      visibility: visible;
    }

    .left-top {
      position: relative;
      padding: 16px 24px;
      width: 100%;

      .block-infor {
        margin-bottom: 8px;
        .block-avatar {
          padding: 2px 12px 0 0;
        }

        .block-status {
          .block-fullname {
            font-size: 16px;
            line-height: 24px;
            font-weight: 550;
            color: #2f2f2f;
          }

          .block-time {
            padding: 0;
            line-height: 20px;

            i {
              font-size: 16px;
              padding-right: 6px;
            }

            span {
              font-weight: 400;
              font-size: 14px;
            }

            .date-time {
              margin-left: 4px;
            }
          }
        }
      }

      .content-text {
        color: #878b87;
      }

      .block-content {
        line-height: 20px;
        position: relative;
        font-size: 16px;

        span {
          font-weight: 500;
          font-size: 16px;
        }

        .date-status {
          display: contents;
          font-weight: 500;
        }

        .un-read {
          display: inline-flex;
          align-items: center;

          img {
            width: 21px;
            height: 14px;
            background: linear-gradient(180deg, #ffe082 -29.83%, #ffca28 91.58%);
            margin-right: 8px;
          }

          span {
            font-weight: 700;
            color: #f44436;
            font-size: 14px;
            // padding-left: 8px;
          }
        }
      }

      .block-due {
        margin: 10px 0;
        font-weight: 500;
        background: inherit;
        padding: 0;

        .due-date {
          margin-left: 4px;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
        }
      }

      .due-time {
        background: #1c8c44;
        color: #ffffff;
        border: 1px solid #878b87;
        padding: 4px 8px;
      }

      .overdue-time {
        background: #ffff00;
        color: #2f2f2f;
        border: 1px solid #878b87;
        padding: 4px 8px;
      }

      .task-done {
        background: #d3d3d3;
        color: #2f2f2f;
        border: 1px solid #878b87;
        padding: 4px 8px;
      }

      .block-cancel {
        background: #f8f8f8;
      }

      .block-attachments {
        padding: 10px 0 0;
        position: relative;
        display: flex;
        align-items: center;

        .attachments-total {
          //padding-left: 30px;
          font-size: 14px;
          margin-left: 4px;

          img {
            position: absolute;
            left: 102px;
          }
        }

        .attachments-un-read {
          display: flex;
          align-items: center;
          margin-left: 4px;
          img {
            width: 21px;
            height: 14px;
            background: linear-gradient(180deg, #ffe082 -29.83%, #ffca28 91.58%);
          }

          span {
            font-weight: 700;
            color: #f44436;
            font-size: 14px;
            padding-left: 8px;
          }
        }
      }

      .block-flag {
        width: 79px;
        height: 24px;
        position: absolute;
        top: 80px;
        right: -10px;
        color: #fff;
        background-color: #ff5622;
        font-size: 12px;
        line-height: 1.6rem;
        font-weight: 500;
        padding-right: 4px;
        border-radius: 4px 0 0 4px;
        z-index: 1;

        i {
          padding: 4px 5px 4px 10px;
        }
      }

      .block-flag::before {
        content: '';
        top: 100%;
        left: 88%;
        position: absolute;
        border-top: 6px solid #ff5622;
        border-right: 7px solid transparent;
        filter: brightness(60%);
      }
    }

    .block-bottom {
      padding: 6px 18px;

      .bottom-left {
        .bottom-done,
        .bottom-mute,
        .bottom-comment {
          padding-right: 24px;

          i {
            font-size: 16px;
            padding-right: 8px;
            padding-bottom: 4px;
          }

          span {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }

      .bottom-right {
        i {
          font-size: 24px;
          color: #1c8c44;
        }
      }
    }
  }

  .block-right .card-hover,
  .attachments-detail {
    display: none;
    padding-left: 8px;
  }

  .block-right:hover .card-hover,
  .block-right:hover .attachments-detail {
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #1c8c44;
  }
}

.block-edit {
  position: absolute;
  top: 24px;
  right: 72px;
  font-size: 16px;
  cursor: pointer;
}

.block-delete {
  position: absolute;
  top: 24px;
  right: 33px;
  font-size: 16px;
  cursor: pointer;
}
.card-success {
  border: 1px solid #1e89e5;
  background: #eaf5ff;

  hr {
    background: #1e89e5;
  }
}

.card-disable {
  border: 1px solid #d3d3d3;
  background: #f8f8f8;
  opacity: 0.5;
}

.card-basic {
  border: 1px solid #d3d3d3;
  background: #f8f8f8;
}

.sent-date {
  // color: #878b87;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-decoration: line-through;
}

.disabled-btn {
  color: #d3d3d3;
}
.ellipsis {
  min-width: -webkit-fill-available;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.box-pin {
  .q-icon {
    margin-right: 4px;
  }

  margin-bottom: 8px;
}

.dot {
  width: 4px;
  height: 4px;
  background: #565656;
  margin: 0 8px;
  border-radius: 50%;
}
</style>
