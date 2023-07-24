<template>
  <div class="block-channel">
    <div class="block-right">
      <q-card class="my-card">
        <q-card-section>
          <div class="card-top">
            <div class="commnent flex">
              <div class="block-avatar">
                <CAvatar
                  :avatar="formComment?.avatar"
                  :text="formComment?.name?.split('')[0] || ''"
                  size="32px"
                />
              </div>
              <div class="comment-right">
                <div
                  class="block-comment"
                  :id="`cardComment-${formComment.id}`"
                >
                  <div class="block-comment__name">
                    <span class="block-comment__name-text">{{ formComment?.name }}</span>
                    <span
                      v-if="formComment?.tagName"
                      class="mention-item-click"
                      >@{{ formComment?.tagName }}</span
                    >
                  </div>
                  <div class="row">
                    <q-img
                      v-for="(fileItem, indexFile) in formComment?.attachments"
                      :key="`files-1-${indexFile}`"
                      class="card-img col-7 cursor-pointer"
                      rounded
                      fit="cover"
                      :src="fileItem?.url"
                      @click="showModalImg(fileItem)"
                    />
                  </div>
                  <div class="block-comment__content">
                    <span v-html="formComment?.content"></span>
                  </div>
                </div>
                <AppPickerOptions
                  :listEmoji="listReact"
                  @actionEmoji="actionEmoji"
                ></AppPickerOptions>
                <div class="card-status flex justify-between">
                  <div class="status-left flex">
                    <div class="status-time">
                      {{ getTimeDifference(formComment?.time) }}
                    </div>
                    <AppPickerComposition @selectedEmoji="reactComment">
                      <div class="status-like cursor-pointer">
                        <span :class="classCard[formComment?.like?.status]">{{
                          $t('workspace.comment.react')
                        }}</span>
                      </div>
                    </AppPickerComposition>

                    <div
                      v-if="showReply"
                      class="status-reply"
                      @click="toggleReply"
                    >
                      <span
                        :class="classCard[formComment?.showComment ? 'action' : 'basic']"
                        >{{ $t('workspace.comment.reply') }}</span
                      >
                    </div>
                  </div>

                  <!-- có 2 trạng thái để hiển thi số lượng like: 1 là khi có số lượng like > 1 và sẽ được hiển thị và ngược lại -->
                  <!--                  <div class="status-right">-->
                  <!--                    <span class="status-liked"-->
                  <!--                      >{{ formComment?.like?.number }}-->
                  <!--                      <q-icon-->
                  <!--                        size="16px"-->
                  <!--                        name="bi-hand-thumbs-up-fill"-->
                  <!--                      />-->
                  <!--                    </span>-->
                  <!--                  </div>-->
                </div>
                <div :id="`showComment-${formComment?.id}`">
                  <slot
                    v-if="formComment?.showComment"
                    name="comment"
                  />
                </div>
                <slot name="reply" />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, defineAsyncComponent, computed } from 'vue';
import { getTimeDifference, scrollToId, sortByCreateTime } from 'src/helper/global';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import { FormFile } from 'src/interface/chat';

interface typeclassCard {
  action: string;
  basic: string;
}

export default defineComponent({
  name: 'CardComment',
  components: {
    AppPickerComposition: defineAsyncComponent(
      () => import('components/emoji/AppPickerComposition.vue'),
    ),
    AppPickerOptions: defineAsyncComponent(
      () => import('components/emoji/AppPickerOptions.vue'),
    ),
  },
  props: {
    formComment: {
      type: Object,
      default() {
        return {};
      },
    },
    showReply: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:formComment', 'actionLike'],
  setup(props, { emit }) {
    const workspaceStore = useWorkspaceStore();
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const state = reactive<{
      classCard: typeclassCard;
    }>({
      classCard: {
        action: 'card-action',
        basic: 'card-basic',
      },
    });

    const showModalImg = (item?: FormFile) => {
      workspaceStore.setListViewFile([item]);
    };

    const toggleReply = () => {
      emit('update:formComment', {
        ...props.formComment,
        showComment: !props?.formComment?.showComment,
      });
      scrollToId(`showComment-${props?.formComment?.id}`);
    };

    const reactComment = (emoji: any, isReact?: boolean) => {
      emit('actionLike', props.formComment, emoji, !isReact);
    };
    const actionEmoji = (item: any) => {
      reactComment(item.emojiItem, item.active);
    };
    const listReact = computed(() => {
      if (!props.formComment?.reactions) return [];
      let objectEmoji = {} as any;
      const reactions = props.formComment?.reactions as any;
      reactions.forEach((item: any) => {
        if (!objectEmoji[item.emoji]) {
          objectEmoji[item.emoji] = {
            emoji: item.emoji,
            listUser: [item.user],
          };
        } else {
          objectEmoji[item.emoji] = {
            ...objectEmoji[item.emoji],
            listUser: [...objectEmoji[item.emoji].listUser, item.user],
          };
        }
        objectEmoji[item.emoji] = {
          ...objectEmoji[item.emoji],
          active:
            objectEmoji[item.emoji]?.active || item?.user?.id === infoUser?.value?.id,
          created_at: item.created_at,
        };
      });
      const arrayResult = Object.values(objectEmoji);
      return sortByCreateTime(arrayResult) || [];
    });
    return {
      ...toRefs(state),
      listReact,
      getTimeDifference,
      toggleReply,
      reactComment,
      actionEmoji,
      showModalImg,
    };
  },
});
</script>

<style lang="scss" scoped>
.block-channel {
  .block-right {
    .my-card {
      box-shadow: none;

      .q-card__section {
        padding: 0;
      }
    }

    .card-top {
      padding: 8px 0;
      width: 100%;

      .commnent {
        flex-wrap: nowrap;

        .block-avatar {
          padding-right: 8px;

          img {
            width: 32px;
            height: 32px;
          }
        }

        .comment-right {
          width: 100%;

          .block-comment {
            background: #f8f8f8;
            border-radius: 4px;
            align-items: center;
            // width: calc(100% - 40px);
            padding: 8px;

            .block-comment__name {
              margin: 0;
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
                display: none;
              }

              color: #2f2f2f;
              font-size: 14px;
              line-height: 20px;
            }
          }

          .card-status {
            .status-left {
              display: flex;
              //width: 180px;
              //justify-content: inherit;
              .status-time {
                padding-top: 8px;
                padding-right: 8px;
                font-size: 14px;
                color: #878b87;
              }

              .status-like,
              .status-reply {
                margin-left: 24px;
                cursor: pointer;
                padding: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #565656;
              }
            }

            .status-right {
              padding-top: 8px;

              .status-liked {
                color: #878b87;

                i {
                  color: #1c8c44;
                  margin-bottom: 4px;
                }
              }
            }
          }

          .card-reply {
            padding-top: 8px;

            .reply {
              flex-wrap: nowrap;
              width: 100%;

              .reply-avatar {
                padding-right: 8px;

                img {
                  width: 32px;
                  height: 32px;
                }
              }

              .reply-right {
                width: 100%;

                .reply-comment {
                  background: #f8f8f8;
                  border-radius: 4px;
                  align-items: center;
                  // width: calc(100% - 40px);
                  padding: 8px;

                  .reply-comment__name {
                    margin: 0;
                    color: #2f2f2f;
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 20px;

                    span {
                      color: #1e89e5;
                      font-size: 14px;
                      font-weight: 500;
                    }
                  }

                  .reply-comment__content {
                    color: #2f2f2f;
                    font-size: 14px;
                    line-height: 20px;
                  }
                }

                .reply-status {
                  .reply-left {
                    display: flex;
                    width: 180px;
                    justify-content: inherit;

                    .reply-time {
                      padding-top: 8px;
                      font-size: 14px;
                      color: #878b87;
                    }

                    .reply-like,
                    .reply-text {
                      padding: 8px;
                      font-size: 14px;
                      font-weight: 500;
                      color: #565656;
                    }
                  }

                  .reply-action {
                    padding-top: 8px;

                    .reply-liked {
                      color: #878b87;

                      i {
                        color: #1c8c44;
                        margin-bottom: 4px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.card-action {
  color: #1c8c44;
}

.card-basic {
  color: #565656;
}

.card-img {
  margin-bottom: 4px;
}
</style>
