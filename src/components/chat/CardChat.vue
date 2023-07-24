<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs, watchEffect } from 'vue';
import { checkFileType, formatDateDisplay } from 'src/helper/global';
import { useWorkspaceStore } from 'stores/workspace';
import { DeleteChat, formChat, FormFile } from 'src/interface/chat';
import { filename } from 'src/constants/ConstantFile';
import { useMainStore } from 'stores/main';
import { useI18n } from 'vue-i18n';

import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import CardListImg from 'components/upfile/cardListImg.vue';

import { User } from 'src/interface/comment';
import { useChannelStore } from 'stores/channel';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'CardChat',
  methods: { formatDateDisplay },
  components: {
    CardListImg,
    CardFileUpload,
  },
  props: {
    infoCardChat: {
      type: Object,
      default() {
        return null;
      },
    },
    showPinChat: {
      type: Boolean,
      default: true,
    },
    showReact: {
      type: Boolean,
      default: true,
    },
    highlightSearch: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['react', 'actionReply', 'focusMessage', 'pinChat'],
  setup(props, { emit }) {
    const route = useRoute();

    const workspaceStore = useWorkspaceStore();
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const { t } = useI18n();
    const channelStore = useChannelStore();

    const getRolePermissionChannel = computed(() => {
      return channelStore.getRolePermissionChannel;
    });
    const typeIsOneToOne = computed(() => channelStore.typeIsOneToOne);

    const permissionPinChat = computed(
      () =>
        // true
        typeIsOneToOne.value || !!getRolePermissionChannel.value?.['pinChat'] || false,
    );

    const fileTypeIncludesFileOther = ref(false);
    const getFile = () => {
      const dataFiles = state.infoChat?.files as Array<FormFile>;
      if (dataFiles) {
        dataFiles.forEach((item: FormFile) => {
          if (!fileTypeIncludesFileOther.value)
            fileTypeIncludesFileOther.value = fileType(item) !== 'Image';
        });
        return dataFiles;
      }
      return [];
    };
    const fileReplyTypeIncludesFileOther = ref(false);

    const getFileReply = () => {
      if (state.infoChat?.chat?.statusChat === 'normal') return [];
      const dataFiles = state.infoChat?.reply?.files as Array<FormFile>;
      if (dataFiles) {
        dataFiles.forEach((item: FormFile) => {
          if (!fileReplyTypeIncludesFileOther.value)
            fileReplyTypeIncludesFileOther.value = fileType(item) !== 'Image';
        });
        return dataFiles;
      }
      return [];
    };

    const getReplyMessage = () => {
      if (state.infoChat?.chat?.statusChat !== 'reply') return '';
      if (state.infoChat?.chat?.typeChat === 'sent') {
        if (state.user?.id === state.userReply?.id) {
          return t('workspace.chat.replyMessageYourself');
        } else {
          return t('workspace.chat.youReplyMessage', {
            reply: state.userReply?.name,
          });
        }
      } else {
        return t('workspace.chat.replyMessage', {
          name: state.user?.name,
          reply: state.userReply?.name,
        });
      }
    };

    const menu = computed(() => {
      if (state.deleteChat?.isDeleted) {
        return [];
      }

      if (state.infoChat?.pinChat && !props.showPinChat) {
        if (permissionPinChat.value) {
          return [
            {
              icon: 'bi-emoji-smile',
              key: 'react',
              title: t('workspace.chat.menuAction.react'),
              show: props.showReact,
              action: () => (showEmoji.value = true),
            },
            {
              icon: 'bi-pin',
              key: 'pin',
              title: t('workspace.chat.menuAction.unpin'),
              show: permissionPinChat.value,
              action: () => emit('pinChat'),
            },
          ];
        } else {
          return [
            {
              icon: 'bi-emoji-smile',
              key: 'react',
              title: t('workspace.chat.menuAction.react'),
              show: props.showReact,
              action: () => (showEmoji.value = true),
            },
          ];
        }
      }

      const menu = [
        {
          icon: 'bi-emoji-smile',
          key: 'react',
          title: t('workspace.chat.menuAction.react'),
          show: props.showReact,
          action: () => (showEmoji.value = true),
        },
        ...state.infoChat?.menu,
      ];
      return menu.filter((item: any) => item.show);
    });

    const state = reactive<{
      infoChat?: formChat;
      files: Array<FormFile>;
      filesReply: Array<FormFile>;
      deleteChat: DeleteChat;
      textDeletedBy: string;
      user?: User;
      userReply?: User;
      listReact: any;
      replyMessage: string;
      menu: any;
      //    permission
      //   permissionCreateChat: boolean,
    }>({
      infoChat: undefined,
      files: [],
      filesReply: [],
      deleteChat: {
        isDeleted: false,
        time: '',
        user: undefined,
      },
      textDeletedBy: '',
      user: undefined,
      userReply: undefined,
      listReact: [],
      replyMessage: '',
      menu: [],
    });

    const fileType = (item: any) => {
      const _file = checkFileType(item);
      return filename[_file.type];
    };

    const setValueCard = () => {
      if (props.infoCardChat) {
        state.infoChat = { ...props.infoCardChat } as formChat;
        console.log(state.infoChat);
        state.user = state.infoChat?.user;
        state.userReply = state.infoChat?.reply?.user;
        state.files = getFile();
        state.filesReply = getFileReply();
        if (!state.infoChat?.deleteChat?.isDeleted) {
          state.deleteChat = {
            isDeleted: false,
            time: '',
            user: undefined,
          };
          state.textDeletedBy = '';
        } else {
          state.deleteChat = state.infoChat?.deleteChat;
          state.textDeletedBy = t('workspace.chat.deletedBy', {
            name: state.deleteChat?.user?.name,
            time: formatDateDisplay(state.deleteChat?.time || '', 'HH:mm, MMM Do YYYY'),
          });
        }
        state.listReact = state.infoChat?.reactions;
        state.replyMessage = getReplyMessage();
      }
    };
    watchEffect(() => {
      setValueCard();
    });
    const showModalImg = (item?: FormFile) => {
      workspaceStore.setListViewFile([item]);
    };

    const showEmoji = ref(false);

    const reactChat = (emoji: any, isReact?: boolean) => {
      emit('react', state.infoChat, emoji, !isReact);
      showEmoji.value = false;
    };
    const actionEmoji = (item: any) => {
      reactChat(item.emojiItem, item.active);
    };

    const focusMessage = () => {
      emit('focusMessage');
    };
    const focusMessageReply = () => {
      if (state.infoChat?.chat.statusChat === 'reply') {
        emit('actionReply', state.infoChat?.reply?.id);
      }
    };
    const searchText = computed(() => {
      if (props.highlightSearch) {
        return route?.query?.keyword || '';
      }
      return '';
    });
    return {
      ...toRefs(state),
      menu,
      // getMenu,
      fileTypeIncludesFileOther,
      showModalImg,
      actionEmoji,
      fileReplyTypeIncludesFileOther,
      showEmoji,
      reactChat,
      focusMessage,
      focusMessageReply,
      searchText,
    };
  },
});
</script>

<template>
  <div class="card-chat">
    <div
      :class="{
        'card-chat-received': infoChat?.chat?.typeChat === 'received',
        'card-chat-sent': infoChat?.chat?.typeChat === 'sent',
        'card-chat-pin': infoChat?.pinChat,
      }"
    >
      <div class="card-chat-body">
        <div
          v-if="showPinChat && infoChat?.pinChat"
          class="box-pin"
        >
          <q-icon name="bi-pin-fill"></q-icon>
          <span class="text-body-regular text-neutral-1">{{
            $t('workspace.chat.pinMessage')
          }}</span>
        </div>
        <q-card>
          <q-card-section>
            <div class="box-info-member">
              <CAvatar
                size="40px"
                :avatar="user?.avatar"
                :text="user?.name?.split('')[0]"
              />
              <div class="box-info-member-header">
                <div class="text-body-regular">
                  {{
                    infoChat?.chat?.typeChat === 'sent'
                      ? $t('workspace.chat.typeChat.sent')
                      : $t('workspace.chat.typeChat.received')
                  }}
                  {{
                    formatDateDisplay(infoChat?.chat?.time || '', 'HH:mm, MMM Do YYYY')
                  }}
                </div>
                <div class="text-body">
                  {{ user?.name }}
                  {{
                    infoChat?.chat?.typeChat === 'sent' ? ` (${$t('global.you')})` : ''
                  }}
                </div>
              </div>
            </div>
            <div class="box-info-chat">
              <template v-if="deleteChat?.isDeleted">
                <span class="box-info-chat-deleted">
                  {{ textDeletedBy }}
                </span>
              </template>
              <template v-else>
                <div
                  v-if="['reply', 'forward'].includes(infoChat?.chat.statusChat)"
                  class="box-info-chat-reply"
                >
                  <div
                    v-if="infoChat?.chat.statusChat === 'reply'"
                    @click="focusMessageReply"
                    class="box-info-chat-reply-title cursor-pointer"
                  >
                    <q-icon
                      size="20px"
                      name="bi-reply"
                    ></q-icon>
                    <span class="text-h5-regular text-neutral-1">
                      {{ replyMessage }}
                    </span>
                  </div>

                  <div class="box-info-chat-reply-body">
                    <q-separator
                      vertical
                      inset
                    />
                    <div
                      class="box-info-chat-reply-body-content"
                      :class="{
                        'opacity-7': infoChat?.chat.statusChat === 'reply',
                      }"
                    >
                      <div
                        v-if="infoChat?.chat.statusChat === 'forward'"
                        class="box-info-member"
                      >
                        <CAvatar
                          size="24px"
                          :avatar="userReply?.avatar"
                          :text="userReply?.name?.split('')[0]"
                        />
                        <div class="box-info-member-header">
                          <div class="text-body">
                            {{ userReply?.name }}
                            <!--                      {{ typeChat === 'sent' ? ` (${$t('global.you')})` : '' }}-->
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="highlightSearch"
                        v-highlight="searchText"
                        v-html="infoChat?.reply?.text || ''"
                        class="box-info-chat-text cursor-pointer"
                      ></div>
                      <div
                        v-if="!highlightSearch"
                        @click="focusMessageReply"
                        class="box-info-chat-text cursor-pointer"
                        v-html="infoChat?.reply?.text"
                      ></div>
                      <div class="box-info-chat-file">
                        <div class="row q-gutter-sm">
                          <div
                            v-for="(item, index) in filesReply"
                            :key="index"
                          >
                            <card-file-upload
                              v-if="fileReplyTypeIncludesFileOther"
                              class="bg-white"
                              :default-files="item"
                              :show-remove-item="false"
                              @showModalImg="showModalImg(item)"
                            />
                            <card-list-img
                              v-else
                              :image="item"
                              class="cursor-pointer"
                              @click="showModalImg(item)"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="box-info-chat-text cursor-pointer"
                  @click="focusMessage"
                >
                  <span
                    v-if="highlightSearch"
                    v-highlight="searchText"
                    v-html="infoChat?.chat?.text || ''"
                  />
                  <span
                    v-if="!highlightSearch"
                    v-html="infoChat?.chat?.text"
                  ></span>
                  <span
                    v-if="infoChat?.editChat"
                    class="box-info-chat-text-edited text-body-regular"
                    >{{
                      $t('workspace.chat.editedBy', {
                        name: infoChat?.editor?.name,
                      })
                    }}</span
                  >
                </div>
                <div class="box-info-chat-file">
                  <div class="row q-gutter-sm">
                    <div
                      v-for="(item, index) in files"
                      :key="index"
                    >
                      <card-file-upload
                        v-if="fileTypeIncludesFileOther"
                        class="bg-white"
                        :default-files="item"
                        :show-remove-item="false"
                        @showModalImg="showModalImg(item)"
                      />
                      <card-list-img
                        v-else
                        :image="item"
                        class="cursor-pointer"
                        @click="showModalImg(item)"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="box-read">
              <q-icon
                size="24px"
                color="primary"
                :name="infoChat?.chat.readAll ? 'bi-check-all' : 'bi-check'"
              />
            </div>
          </q-card-section>
          <MenuClick
            v-if="menu?.length"
            :menu="menu"
          ></MenuClick>
          <menu-hover-chat
            v-if="menu?.length"
            class="menu-hover-chat"
            :menu="menu"
          ></menu-hover-chat>
          <AppPickerComposition
            v-model="showEmoji"
            :show-action="false"
            @selected-emoji="reactChat"
          >
          </AppPickerComposition>
        </q-card>
        <div
          class="card-emoji"
          v-if="listReact?.length"
        >
          <AppPickerOptions
            :listEmoji="listReact"
            @actionEmoji="actionEmoji"
          ></AppPickerOptions>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card-chat {
  margin-bottom: 24px;
  margin-top: 8px;
  width: 100%;

  .box-pin {
    .q-icon {
      margin-right: 4px;
    }

    margin-bottom: 8px;
  }

  &-body {
    min-width: 336px;

    &:hover {
      :deep(.menu-hover-chat) {
        opacity: 1;
        visibility: visible;
      }
    }

    .q-card {
      box-shadow: none;
      border-radius: 8px;
    }
  }

  &-received {
    display: flex;
    flex-wrap: wrap;

    .q-card {
      background: #f8f8f8;
      border: 1px solid #d3d3d3;
    }
  }

  &-sent {
    display: flex;
    flex-direction: row-reverse;
    flex-wrap: wrap;

    .q-card {
      background: #eaf5ff;
      border: 1px solid #1e89e5;
    }
  }

  &-pin {
    //.q-card {
    //  background: #fff8e1 !important;
    //  border: 1px solid #ffbc54 !important;
    //}
  }

  .q-card__section {
    min-height: 108px;
    padding: 16px 24px;
    border-radius: 8px;
    border: none;

    .box-info-member {
      display: flex;
      margin-bottom: 8px;

      &-header {
        margin-left: 12px;

        .text-body-regular {
          color: #565656;
        }

        .text-body {
          color: #2f2f2f;
          font-weight: 600;
        }
      }
    }

    .box-info-chat {
      padding-right: 32px;

      &-deleted {
        font-style: italic;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #878b87;
      }

      &-reply {
        margin-bottom: 8px;

        &-title {
          display: flex;
          align-items: center;
          margin-bottom: 8px;

          span.text-h5-regular {
            margin-left: 8px;
          }
        }

        &-body {
          display: flex;

          hr {
            margin: 0 12px 0 0;
            width: 3px;
            background: #1e89e5;
            border-radius: 50px;
          }

          &-content {
          }
        }
      }

      &-text {
        margin-bottom: 10px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #2f2f2f;
        word-break: break-word;

        &-edited {
          color: #878b87;
          margin-left: 4px;
        }
      }

      &-file {
      }
    }
  }

  .card-emoji {
    margin-top: 8px;
  }

  .box-read {
    position: absolute;
    bottom: 16px;
    right: 24px;
  }
}

.opacity-7 {
  opacity: 0.7;
}

:deep(.menu-hover-chat) {
  position: absolute;
  top: 15px;
  right: 24px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-out, visibility 0.1s 0.1s linear;
}

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
    min-height: 32px;
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
