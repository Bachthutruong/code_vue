<template>
  <div class="block-channel">
    <div class="block-right">
      <slot
        name="card-top"
        :typeNotify="typeNotify"
      ></slot>
      <q-card
        class="my-card"
        :class="{
          focusDiv: !formStatus?.other?.is_read,
        }"
      >
        <q-card-section v-if="typeNotify === 'task'">
          <div class="left-top pb-0">
            <div
              v-if="
                showCommentAvatar && ![notifyType['NEW_COMMENT']].includes(typeComment)
              "
              class="block-avatar"
            >
              <CAvatar
                v-if="[notifyType['REPLY_COMMENT']].includes(typeComment)"
                size="32px"
                :avatar="formStatus?.comment?.parent?.user?.avatar"
                :text="formStatus?.comment?.parent?.user?.name.split('')[0]"
              ></CAvatar>
              <CAvatar
                v-else
                size="32px"
                :avatar="formStatus?.comment?.user?.avatar"
                :text="formStatus?.comment?.user?.name.split('')[0]"
              ></CAvatar>
            </div>
            <div class="w-100">
              <div
                v-if="formStatus?.status?.content || formStatus?.comment?.content"
                class="status"
              >
                <div class="block-status">
                  <p
                    v-if="
                      !showCommentAvatar ||
                      [notifyType['NEW_COMMENT']].includes(typeComment)
                    "
                    class="block-status__text"
                  >
                    {{ $t('workspace.channel.whatToDo') }}
                  </p>
                  <span
                    v-if="
                      showCommentAvatar &&
                      ![notifyType['NEW_COMMENT']].includes(typeComment)
                    "
                    class="block-status_content text-body"
                  >
                    {{
                      ![notifyType['REPLY_COMMENT']].includes(typeComment)
                        ? formStatus?.comment?.user?.name
                        : formStatus?.comment?.parent?.user?.name
                    }}
                  </span>
                  <div
                    v-if="
                      [
                        notifyType['REACT_COMMENT'],
                        notifyType['MENTION_COMMENT'],
                      ].includes(typeComment)
                    "
                    class="block-status__content maxlength-2"
                    v-html="formStatus?.comment?.content"
                  />
                  <div
                    v-else-if="[notifyType['REPLY_COMMENT']].includes(typeComment)"
                    class="block-status__content maxlength-2"
                    v-html="formStatus?.comment?.parent?.content"
                  />
                  <div
                    v-else
                    class="block-status__content maxlength-2"
                    v-html="formStatus?.status?.content"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="left-top">
            <div class="w-100">
              <div class="action">
                <div
                  v-if="
                    showActorAvatar || [notifyType['REACT_COMMENT']].includes(typeComment)
                  "
                  class="block-avatar"
                >
                  <CAvatar
                    size="32px"
                    :avatar="formStatus?.status?.user?.avatar"
                    :text="formStatus?.status?.user?.name.split('')[0]"
                  ></CAvatar>
                </div>
                <div
                  v-if="[notifyType['REMINDER_TASK']].includes(typeComment)"
                  class="block-avatar"
                >
                  <q-icon
                    name="bi-hourglass-bottom"
                    size="16px"
                    color="neutral-2"
                  ></q-icon>
                </div>
                <div class="action-text">
                  <span
                    v-if="contentComment?.firstContent"
                    class="block-action__status"
                    >{{ contentComment?.firstContent }}</span
                  >
                  <span
                    v-if="typeComment === notifyType['REMINDER_TASK']"
                    class="block-action__name"
                  >
                    {{ $t('workspace.comment.reminderDue') }}:
                  </span>
                  <span
                    v-if="typeComment === notifyType['REMINDER_TASK']"
                    class="block-action__reminder_time"
                  >
                    {{
                      formatDateDisplay(
                        formStatus?.other?.remind_at,
                        'HH:mm, MMM Do YYYY',
                      )
                    }}
                  </span>
                  <span
                    v-if="typeComment === notifyType['REMIND_DUE_TASK']"
                    class="block-action__name"
                  >
                    {{
                      formatDateDisplay(
                        formStatus?.other?.task?.due_at,
                        'HH:mm, MMM Do YYYY',
                      )
                    }}
                  </span>
                  <span
                    v-else-if="![notifyType['MENTION_COMMENT']].includes(typeComment)"
                    class="block-action__name"
                  >
                    {{ formStatus?.status?.user?.name }}
                  </span>
                  <span
                    v-if="contentComment?.lastContent"
                    class="block-action__status"
                  >
                    {{ contentComment?.lastContent }}
                  </span>
                  <span class="block-action__time">
                    {{ formatDateToString(formStatus?.dateComment) }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  showCommentAvatar &&
                  ![notifyType['REACT_COMMENT'], notifyType['MENTION_COMMENT']].includes(
                    typeComment,
                  )
                "
                class="commnent flex"
              >
                <div class="block-avatar">
                  <CAvatar
                    size="32px"
                    :avatar="formStatus?.comment?.user?.avatar"
                    :text="formStatus?.comment?.user?.name?.split('')[0]"
                  ></CAvatar>
                </div>
                <div class="block-comment">
                  <div class="block-comment__name">
                    <span class="block-comment__name-text">{{
                      formStatus?.comment?.user.name
                    }}</span>
                    <span
                      v-if="typeComment === notifyType['REPLY_COMMENT']"
                      class="mention-item-click"
                      >@{{ formStatus?.comment?.parent.user?.name }}</span
                    >
                  </div>
                  <div class="block-comment__content maxlength-2">
                    <span v-html="formStatus?.comment?.content"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="typeNotify === 'wiki'">
          <div
            v-if="typeNotify === 'wiki'"
            class="box-topic-wiki text-body text-primary text-ellipsis-2"
          >
            <span
              >{{ $t('workspace.notify.topic') }}:
              {{ formStatus?.other?.wiki?.topic }}</span
            >
          </div>

          <div
            v-if="
              [notifyType['REPLY_COMMENT_WIKI'], notifyType['NEW_COMMENT_WIKI']].includes(
                typeComment,
              )
            "
            class="left-top pb-0"
          >
            <div
              v-if="[notifyType['REPLY_COMMENT_WIKI']].includes(typeComment)"
              class="block-avatar"
            >
              <CAvatar
                size="32px"
                :avatar="formStatus?.comment?.parent?.user?.avatar"
                :text="formStatus?.comment?.parent?.user?.name.split('')[0]"
              ></CAvatar>
            </div>
            <div class="w-100">
              <div
                v-if="formStatus?.status?.content || formStatus?.comment?.content"
                class="status"
              >
                <div class="block-status">
                  <p
                    v-if="[notifyType['NEW_COMMENT_WIKI']].includes(typeComment)"
                    class="block-status__text"
                  >
                    {{ $t('workspace.comment.contentDescription') }}
                  </p>
                  <span
                    v-if="[notifyType['REPLY_COMMENT_WIKI']].includes(typeComment)"
                    class="block-status_content text-body"
                  >
                    {{ formStatus?.comment?.parent?.user?.name }}
                  </span>
                  <div
                    v-if="[notifyType['REPLY_COMMENT_WIKI']].includes(typeComment)"
                    class="block-status__content maxlength-2"
                    v-html="formStatus?.comment?.parent?.content"
                  />
                  <div
                    v-else
                    class="block-status__content maxlength-2"
                    v-html="formStatus?.other?.wiki?.content"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="left-top">
            <div class="w-100">
              <div class="action">
                <div class="action-text">
                  <span
                    v-if="contentComment?.firstContent"
                    class="block-action__status"
                    >{{ contentComment?.firstContent }}</span
                  >
                  <span
                    v-else-if="
                      ![notifyType['MENTION_COMMENT_WIKI']].includes(typeComment)
                    "
                    class="block-action__name"
                  >
                    {{ formStatus?.status?.user?.name }}
                  </span>
                  <span
                    v-if="contentComment?.lastContent"
                    class="block-action__status"
                  >
                    {{ contentComment?.lastContent }}
                  </span>
                  <span class="block-action__time">
                    {{ formatDateToString(formStatus?.dateComment) }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  ![
                    notifyType['REACT_COMMENT_WIKI'],
                    notifyType['MENTION_COMMENT_WIKI'],
                  ].includes(typeComment)
                "
                class="commnent flex"
              >
                <div class="block-avatar">
                  <CAvatar
                    size="32px"
                    :avatar="formStatus?.comment?.user?.avatar"
                    :text="formStatus?.comment?.user?.name?.split('')[0]"
                  ></CAvatar>
                </div>
                <div class="block-comment">
                  <div class="block-comment__name">
                    <span class="block-comment__name-text">{{
                      formStatus?.comment?.user.name
                    }}</span>
                    <span
                      v-if="typeComment === notifyType['REPLY_COMMENT_WIKI']"
                      class="mention-item-click"
                      >@{{ formStatus?.comment?.parent?.user?.name }}</span
                    >
                  </div>
                  <div class="block-comment__content maxlength-2">
                    <span v-html="formStatus?.comment?.content"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-if="typeNotify === 'chat'">
          <div class="left-top">
            <div class="w-100">
              <div class="action">
                <div class="block-avatar">
                  <CAvatar
                    size="32px"
                    :avatar="formStatus?.status?.user?.avatar"
                    :text="formStatus?.status?.user?.name.split('')[0]"
                  ></CAvatar>
                </div>
                <div class="action-text">
                  <span class="block-action__name">
                    {{ formStatus?.status?.user?.name }}
                  </span>
                  <!--                  <span-->
                  <!--                    v-if="contentComment?.firstContent"-->
                  <!--                    class="block-action__status"-->
                  <!--                  >{{ contentComment?.firstContent }}</span-->
                  <!--                  >-->
                  <span
                    v-if="contentChat?.lastContent"
                    class="block-action__status"
                  >
                    {{ contentChat?.lastContent }}
                  </span>
                  <span
                    v-if="typeComment === notifyType['VOTE_POLL']"
                    class="block-action__status"
                  >
                    "{{ formStatus?.other?.poll?.title }}"
                  </span>
                  <span class="block-action__time">
                    {{ formatDateToString(formStatus?.dateComment) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  notifyType,
  typeToChat,
  typeToWikiDetail,
  typeToWikiDetailComment,
  typeToTaskDetailComment,
  AboutTabFieldNameChat,
} from 'src/constants/ConstantNotify';
import { formatDateDisplay } from 'src/helper/global';

const typeOther = [
  // notifyType['REMOVE_CHANNEL'],
  // notifyType['NEW_COMMENT'],
  notifyType['REMIND_DUE_TASK'],
  notifyType['MENTION_COMMENT'],
  notifyType['REMINDER_TASK'],
  // notifyType['REPLY_COMMENT']
];
export default defineComponent({
  name: 'CardStatus',
  components: {},
  props: {
    formStatus: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const { t } = useI18n();

    const mapI18nComment = (path: string, params?: any): string => {
      return t(`workspace.comment.${path}`, params);
    };

    const typeComment = computed(() => {
      return props.formStatus.type;
    });
    const channelType = computed(() => {
      return props.formStatus.channel?.type;
    });
    const contentTextComment = computed(() => {
      return {
        [notifyType['NEW_TASK']]: {
          lastContent: mapI18nComment('newTask'),
        },
        [notifyType['EDIT_TASK']]: {
          lastContent: mapI18nComment('editTask'),
        },
        [notifyType['REMIND_DUE_TASK']]: {
          firstContent: mapI18nComment('reminder'),
        },
        [notifyType['REACT_COMMENT']]: {
          lastContent: mapI18nComment('liked'),
        },
        [notifyType['MARK_DONE_TASK']]: {
          lastContent: mapI18nComment('markDone'),
        },
        [notifyType['MARK_CANCEL_TASK']]: {
          lastContent: mapI18nComment('markCancel'),
        },

        [notifyType['NEW_COMMENT']]: {
          lastContent: mapI18nComment('comment'),
        },
        [notifyType['REPLY_COMMENT']]: {
          lastContent: mapI18nComment('replyComment'),
        },
        [notifyType['MENTION_COMMENT']]: {
          firstContent: mapI18nComment('mentioned'),
        },
        [notifyType['REMOVE_CHANNEL']]: {
          lastContent: mapI18nComment('removeChannel'),
        },
        [notifyType['JOIN_CHANNEL']]: {
          lastContent: mapI18nComment('joinChannel'),
        },
        //    wiki
        [notifyType['REPLY_COMMENT_WIKI']]: {
          lastContent: mapI18nComment('replyComment'),
        },
        [notifyType['NEW_COMMENT_WIKI']]: {
          lastContent: mapI18nComment('commentWiki'),
        },
        [notifyType['REACT_COMMENT_WIKI']]: {
          lastContent: mapI18nComment('reactCommentWiki'),
        },
        [notifyType['MENTION_COMMENT_WIKI']]: {
          lastContent: mapI18nComment('mentionedWiki'),
        },
      };
    });
    const contentComment = computed(() => {
      return contentTextComment.value[typeComment.value];
    });

    const AboutTabFieldNameChat = (params?: any) => {
      return {
        [notifyType['REACT_MESSAGE']]: {
          lastContent: mapI18nComment('reactMessage', params),
        },
        [notifyType['VOTE_POLL']]: {
          lastContent: mapI18nComment('newVoted'),
        },
      };
    };

    const contentChat = computed(() => {
      const fieldName = AboutTabFieldNameChat(
        ['ONE_TO_ONE'].includes(channelType.value) ? 2 : 1,
      ) as any;
      return fieldName[typeComment.value];
    });

    const showCommentAvatar = computed(() => {
      return typeToTaskDetailComment.includes(typeComment.value);
    });

    const showActorAvatar = computed(() => {
      return !showCommentAvatar.value && !typeOther.includes(typeComment.value);
    });
    const formatDateToString = (dateTime: string) => {
      if (!dateTime) return '';
      return `${formatDateDisplay(dateTime, 'MMM Do YYYY')} ${t(
        'global.at',
      )} ${formatDateDisplay(dateTime, 'HH:mm')}`;
    };

    const typeNotify = computed(() => {
      if (typeToChat.includes(typeComment.value)) {
        return 'chat';
      }
      if ([...typeToWikiDetail, ...typeToWikiDetailComment].includes(typeComment.value)) {
        return 'wiki';
      }
      return 'task';
    });

    return {
      notifyType,
      formatDateToString,
      formatDateDisplay,
      contentComment,
      typeComment,
      typeToTaskDetailComment,
      showActorAvatar,
      showCommentAvatar,
      typeNotify,
      // chat
      contentChat,
    };
  },
});
</script>

<style lang="scss" scoped>
.block-channel {
  padding: 8px 32px 8px;

  .block-right {
    .my-card {
      box-shadow: none;
      border-radius: 8px;
      border: 1px solid #d3d3d3;

      .q-card__section {
        padding: 16px;
      }
    }

    .left-top {
      position: relative;
      display: flex;

      .block-avatar {
        padding-right: 8px;
      }

      .block-time {
        padding: 0 67px 18px 0px;

        i {
          font-size: 16px;
          padding-right: 6px;
        }

        span {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
        }
      }

      .status {
        padding-bottom: 12px;

        .block-status {
          background: #f8f8f8;
          border-radius: 4px;
          padding: 10px;

          .block-status__text {
            //font-style: Regular;
            font-size: 12px;
            margin: 0;
            color: #878b87;
          }

          .block-status__name {
            color: #1c8c44;
            font-size: 14px;
            line-height: 20px;
            padding-right: 5px;
          }

          .block-status_content {
            color: #2f2f2f;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }

      .action {
        //margin-bottom: 12px;
        display: flex;
        align-items: center;
        .action-text {
          .block-action__name {
            color: #2f2f2f;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            margin-right: 4px;
          }
          .block-action__reminder_time {
            color: #2f2f2f;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            margin-right: 4px;
          }

          .block-action__status {
            margin-right: 4px;
            color: #2f2f2f;
          }

          .block-action__time {
            color: #878b87;
          }
        }
      }

      .commnent {
        margin-top: 12px;
        flex-wrap: nowrap;

        .block-comment {
          background: #f8f8f8;
          border-radius: 4px;
          align-items: center;
          width: calc(100% - 40px);
          padding: 8px;

          .block-comment__name {
            color: #2f2f2f;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;

            &-text {
              margin-right: 4px;
            }
          }

          .block-comment__content {
            br {
              display: none !important;
            }

            color: #2f2f2f;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
}

.box-topic-wiki {
  margin-bottom: 12px;
  span {
    word-break: break-all;
  }
}
</style>
