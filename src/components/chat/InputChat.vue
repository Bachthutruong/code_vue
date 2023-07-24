<template>
  <div>
    <div
      v-if="['edit', 'reply'].includes(typeAction)"
      class="box-reply-input"
      :class="{
        'box-reply-input-edit': typeAction === 'edit',
      }"
    >
      <div class="box-reply-input-body">
        <q-icon
          :name="typeAction === 'edit' ? 'bi-pencil-square' : 'bi-reply'"
          size="24px"
          color="neutral-1"
        ></q-icon>
        <div class="box-reply-input-body-content">
          <div class="text-h5 text-primary">
            {{
              typeAction === 'edit'
                ? $t('workspace.chat.editMessage')
                : bodyReply?.user?.name
            }}
          </div>
          <div
            v-if="typeAction === 'reply'"
            @click="actionReply"
            class="reply-title cursor-pointer"
          >
            <div class="ellipsis">
              <span
                class="text-h5-regular text-neutral-1"
                v-html="bodyReply?.chat?.text"
              ></span>
            </div>
            <span
              v-if="bodyReply?.files.length"
              class="text-h5-regular text-files"
              >{{ bodyReply?.files.length }}
              {{ $t('global.files', bodyReply?.files.length > 2 ? 2 : 1) }}</span
            >
          </div>
        </div>
      </div>
      <div
        class="cursor-pointer"
        @click="closeActionChat"
      >
        <q-icon
          name="bi-x-circle"
          size="24px"
          color="neutral-1"
        ></q-icon>
      </div>
    </div>
    <Mentionable
      :keys="['@']"
      :items="userTag"
      v-bind="$attrs"
      :class="errorMessage ? 'q-field--error' : ''"
      ref="refMentionable"
      offset="6"
      :disabled="hiddenTag || !permissionMention"
      @apply="onApply"
      @open="loadIssues()"
      @close="closeMention()"
      @search="loadIssues($event)"
    >
      <div
        v-if="disabled"
        class="contenteditableCustorm contenteditableCustormMobie scroll-bar"
        disabled
        :class="{
          'is-label': labelSlot || label,
          'is-comment': type === 'comment',
        }"
      >
        <div v-html="text"></div>
      </div>
      <contenteditable
        v-if="!disabled"
        ref="refContenteditable"
        :key="renderContenteditable"
        spellcheck="false"
        :id="selectableId"
        class="contenteditableCustorm contenteditableCustormMobie scroll-bar"
        :class="{
          'is-label': labelSlot || label,
          'is-comment': type === 'comment',
        }"
        tag="div"
        :contenteditable="contenteditableType"
        v-model="text"
        :placeholder="placeholder"
        @focus="checkFocus()"
        @blur="checkBlur()"
        @keydown="keymonitor($event)"
        @keyup="keyUp($event)"
        :noNL="false"
        :noHTML="false"
      />
      <label
        v-if="labelSlot || label"
        class="label q-field__label"
        :class="checkBorderFocus.focus || text ? 'focus-label' : ''"
      >
        <slot name="label">
          {{ label }}
        </slot>
      </label>
      <div
        v-if="count"
        class="q-field__bottom row items-start q-field__bottom--animated"
      >
        <div class="q-field__messages col"></div>
        <div class="q-field__counter">{{ checkContenteditable(text) }} / {{ count }}</div>
      </div>
      <div
        v-if="textBottom"
        class="q-field__bottom row items-start q-field__bottom--animated"
      >
        <div class="q-field__messages col"></div>
        <div class="q-field__counter">{{ textBottom }}</div>
      </div>
      <!--      <div >-->
      <!--        -->
      <!--      </div>-->
      <div
        v-if="errorMessage"
        class="q-field__bottom row items-start q-field__bottom--animated"
      >
        <div class="q-field__messages col">
          {{ errorMessage }}
        </div>
      </div>
      <div
        v-if="showAction"
        class="comment-box-action"
        :class="{
          'is-label': labelSlot || label,
          'focus-action': checkBorderFocus.focus || text?.length || files.length,
        }"
      >
        <div class="comment-box-action-left">
          <div
            v-if="!hiddenTag && permissionMention"
            class="comment-box-action-left-icon-text mr-icon q-icon"
            @click="showIssue"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              class="tool-tip bg-green-1"
              max-width="300px"
              max-height="36px"
            >
              <span class="item-title">{{
                $t('workspace.chat.inputChat.action.mention')
              }}</span>
            </q-tooltip>
            <span class="">@</span>
          </div>
          <div class="mr-icon">
            <AppPickerComposition @updateEmoji="updateEmoji">
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
                class="tool-tip bg-green-1"
                max-width="300px"
                max-height="36px"
              >
                <span class="item-title">{{
                  $t('workspace.chat.inputChat.action.emoji')
                }}</span>
              </q-tooltip>
              <q-icon
                size="20px"
                name="bi-emoji-smile"
              ></q-icon>
            </AppPickerComposition>
          </div>
          <div class="mr-icon">
            <C-upload
              multiple
              showTitle
              @get-file-before="getFileBefore"
              @get-file="getFile"
              @remove-file="removeFiles"
              accept="*/*"
            >
              <template #action="{ handleUpload }">
                <q-tooltip
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                  class="tool-tip bg-green-1"
                  max-width="300px"
                  max-height="36px"
                >
                  <span class="item-title">{{
                    $t('workspace.chat.inputChat.action.upFile')
                  }}</span>
                </q-tooltip>
                <q-icon
                  size="20px"
                  name="bi-paperclip"
                  @click="handleUpload"
                ></q-icon>
              </template>
            </C-upload>
          </div>
          <div
            v-if="!['edit', 'reply'].includes(typeAction) && permissionPollVote"
            class="mr-icon"
            @click="showVote"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              class="tool-tip bg-green-1"
              max-width="300px"
              max-height="36px"
            >
              <span class="item-title">{{
                $t('workspace.chat.inputChat.action.createPollVote')
              }}</span>
            </q-tooltip>
            <q-icon
              size="20px"
              name="bi-bar-chart"
            >
            </q-icon>
          </div>
        </div>
        <div
          class="comment-box-action-right"
          v-if="type === 'comment'"
        >
          <CButton
            round
            class="mr-icon"
            icon="bi-send"
            color="primary"
            size="small"
            fontSizeIcon="16"
            @click="sendComment()"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              class="tool-tip bg-green-1"
              max-width="300px"
              max-height="36px"
            >
              <span class="item-title">{{
                $t('workspace.chat.inputChat.action.send')
              }}</span>
            </q-tooltip>
          </CButton>
          <CButton
            v-if="!['reply'].includes(typeAction) && permissionCreateTask"
            round
            icon="bi-card-list"
            color="primary"
            size="small"
            outline
            fontSizeIcon="16"
            @click="convertTask()"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
              class="tool-tip bg-green-1"
              max-width="400px"
              max-height="36px"
            >
              <span class="item-title">{{
                $t('workspace.chat.inputChat.action.convert')
              }}</span>
            </q-tooltip>
          </CButton>
        </div>
      </div>
      <template #no-result>
        <q-item>
          <q-spinner-dots
            v-if="loading"
            color="primary"
            size="40px"
          />
          <span v-else>{{ $t('workspace.chat.noResult') }}</span>
        </q-item>
      </template>
      <template #item-@="{ item }">
        <div>
          <q-item
            clickable
            class="issue"
          >
            <q-item-section avatar>
              <CAvatar
                size="32px"
                :avatar="item?.avatar"
                :text="item?.label?.split('')[0] || 'A'"
              ></CAvatar>
            </q-item-section>
            <q-item-section class="text-body-regular item-label">
              {{ item?.label || '' }}
            </q-item-section>
          </q-item>
        </div>
      </template>
    </Mentionable>
    <div
      v-if="files?.length && fileError"
      class="box-warning-max-files"
    >
      <span>{{ $t('valid.uploadMaxLengthFiles') }}</span>
    </div>
    <div
      v-if="files"
      class="row q-gutter-sm"
    >
      <div
        v-for="(item, index) in files"
        :key="index"
      >
        <card-file-upload
          :is-download="false"
          :show-remove-item="typeAction !== 'edit'"
          :default-files="item"
          @removeFile="removeFile"
        />
      </div>
    </div>
    <div :id="`${selectableId}-file`"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  computed,
  watchEffect,
  nextTick,
} from 'vue';
import { scrollToBottomId, scrollToId, useMouse } from 'src/helper/global';
// import {newLine} from "../../../public/js/newLine";
import { Mentionable } from 'vue-mention';
import contenteditable from 'vue-contenteditable';
import { checkContenteditable } from 'src/helper/validForm';
import CButton from 'components/common/CButton.vue';
import AppPickerComposition from 'components/emoji/AppPickerComposition.vue';
import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import ChannelService from 'src/services/channel';
import { FormFile } from 'src/interface/chat';
import { useChannelStore } from 'stores/channel';

export default defineComponent({
  name: 'InputChat',
  props: {
    type: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
    label: {
      type: String,
      default: '',
    },
    labelSlot: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    textBottom: {
      type: String,
      default: '',
    },
    errorMessage: {
      type: String,
      default: '',
    },
    defaultText: {
      type: String,
      default: '',
    },
    keyContent: {
      type: String,
      default: '',
    },
    showAction: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hiddenTag: {
      type: Boolean,
      default: false,
    },
    channelId: {
      type: [String, Number],
      default: '',
    },
    typeAction: {
      type: String,
      default: '',
      //   edit' | 'reply' | ''
    },
    bodyReply: {
      type: Object,
      default() {
        return null;
      },
    },
    typeChannel: {
      type: String,
      default: 'channel',
      //   oneToOne' | 'channel' | ''
    },
  },
  emits: ['addComment', 'showVote', 'closeActionChat', 'convertTask', 'actionReply'],
  components: {
    CButton,
    Mentionable,
    contenteditable,
    AppPickerComposition,
    CardFileUpload,
  },
  setup(props, { emit }) {
    // const {t} = useI18n();
    const channelStore = useChannelStore();
    const getRolePermissionChannel = computed(() => {
      return channelStore.getRolePermissionChannel;
    });
    const typeIsOneToOne = computed(() => props.typeChannel === 'oneToOne');

    // const permissionCreateChat = computed(() =>  !!getRolePermissionChannel.value?.["creatChat"] || false)
    const permissionCreateTask = computed(
      () =>
        typeIsOneToOne.value || !!getRolePermissionChannel.value?.['createTask'] || false,
    );

    const permissionPollVote = computed(() => !typeIsOneToOne.value);
    const permissionMention = computed(() => !typeIsOneToOne.value);
    const refMentionable = ref();
    const state = reactive<{
      userTag: any;
      loading: boolean;
      text: any;
      // placeholder: string,
      searchText?: string;
      contenteditableType: boolean;
      timeout: any;
      selectableId: any;
      showMention: any;
      checkBorderFocus: any;
      error: boolean;
      fileError: boolean;
      files: any;
      renderContenteditable: number;
    }>({
      userTag: [],
      loading: false,
      text: '',
      // placeholder: '',
      searchText: '',
      contenteditableType: true,
      timeout: null,
      selectableId: 'selectable' + (props.keyContent || ''),
      showMention: false,
      checkBorderFocus: {
        focus: false,
        content: false,
      },
      error: false,
      fileError: false,
      files: [],
      renderContenteditable: 0,
    });
    // onMounted(() => {
    // })

    const refContenteditable = ref();
    const removeBlank = (string: string) => {
      const regex =
        /^(&nbsp;|\s|<br>|<div><br><\/div>)+|(&nbsp;|\s|<br>|<div><br><\/div>)+$/g;
      return string.replace(regex, '');
    };
    const setFocus = () => {
      setTimeout(() => {
        // scrollToBottomId(`${state.selectableId}-file`);
        // document.body.scrollIntoView(false);
        useMouse(state.selectableId);
      }, 100);
      // refContenteditable.value.focus()
    };
    // ======== Set parent to child ============;

    const keySearch = computed(() => {
      if (props.hiddenTag) return [];
      return ['@'];
    });
    // Edit
    const setTextContent = (text: string, files?: Array<FormFile>) => {
      state.text = `${text}`;
      if (files) {
        state.files = files;
        if (files?.length > 0) {
          setTimeout(() => {
            scrollToBottomId(`${state.selectableId}-file`);
          }, 50);
        }
      }
      state.fileError = false;
      setFocus();
    };
    const inputText = (text: any) => {
      state.text = text;
    };
    // =========== End Set parent to child =============
    // ======== Set child to parent ============

    // =========== End Set child to parent =============

    const keymonitor = (event: any) => {
      if (event.keyCode == 13 && !event.shiftKey && props.type === 'comment') {
        event.preventDefault();
        sendComment();
      }
      // if (props.type !== 'comment') {
      //   sendComment();
      // }
      // useMouse(state.selectableId);
    };

    const keyUp = () => {
      if (props.type !== 'comment') {
        sendComment();
      }
    };

    const loadIssues = async (searchText: any = null) => {
      if (props.hiddenTag || !permissionMention.value) return;
      // state.searchText = searchText || ''
      state.showMention = true;
      let body = {
        search: searchText || '',
        page: 1,
        page_size: 50,
      };
      state.loading = true;

      if (state.timeout) {
        clearTimeout(state.timeout);
        state.timeout = null;
      }
      state.timeout = setTimeout(() => {
        ChannelService.findAllMemberChannel(`${props.channelId}`, body)
          .then((response: any) => {
            if (response?.status_code === 200) {
              let tagList: any[] = [];
              response.data.data.map((res: any) => {
                tagList.push({
                  value: res.id,
                  label: res.full_name || res.email,
                  avatar: res?.avatar?.url,
                  fullName: res.full_name || res.email,
                  href: '#',
                });
              });
              state.userTag = tagList;
            }
          })
          .catch(({ err }) => {
            console.log(err);
          })
          .finally(() => {
            state.loading = false;
            // if (!searchText) closeMention()
          });
      }, 800);
    };
    const closeMention = () => {
      state.showMention = false;
      // state.searchText = ''
      if (state.timeout) {
        clearTimeout(state.timeout);
        state.timeout = null;
      }
    };
    const onApply = (item: any, key: any, replacedWith: any) => {
      closeMention();
      state.text = state.text.replace(
        replacedWith,
        `<a href="javascript:void(0);" class="mention-item-click" user-id="${item.value}" user-label="${item.label}">@${item.label}</a>`,
      );
      setTimeout(() => {
        useMouse(state.selectableId);
        if (props.type !== 'comment') {
          sendComment();
        }
      }, 1);
    };
    const checkFocus = () => {
      state.checkBorderFocus = {
        focus: true,
        content: false,
      };
      setFocus();
      // emit('checkBorderFocus', state.checkBorderFocus)
    };
    const checkBlur = () => {
      let content = false;
      if (state.text.trim()) {
        content = true;
      }
      state.checkBorderFocus = {
        focus: false,
        content: content,
      };
      // emit('checkBorderFocus', state.checkBorderFocus)
    };
    const updateEmoji = (emoji: any) => {
      console.log('updateEmoji');
      state.text = `${state.text} ${emoji}`;
      if (props.type !== 'comment') {
        sendComment();
      }
    };
    const updateListImg = (newItem: any) => {
      state.files = state.files.map((item: any) => {
        if (!item.originalname && item.name === newItem.originalname) {
          return {
            ...newItem,
            name: newItem.originalname,
          };
        }
        return item;
      });
    };
    const getFile = (listFile: any) => {
      if (!listFile) return;
      listFile.map((item: any) => {
        updateListImg(item);
      });
      if (state.files.length > 5) {
        state.fileError = true;
        state.files = state.files.slice(0, 5);
      } else {
        state.fileError = false;
      }
      console.log('getFile', state.files);
    };
    const getFileBefore = (listFile: any) => {
      if (!listFile) return;
      listFile.map((item: any) => {
        state.files.push({
          ...item,
          name: item.originalname || item.name || '',
        });
      });
      setTimeout(() => {
        scrollToId(`${state.selectableId}-file`);
      }, 50);
    };
    const removeFile = (file: any) => {
      state.files = state.files.filter((item: any) => item.id !== file.id);
    };
    const removeFiles = (files: any) => {
      files.forEach((item: any) => {
        removeFile(item);
      });
    };
    const showIssue = () => {
      console.log('showIssue');
      state.text = `${state.text} @`;
      setTimeout(() => {
        if (props.type !== 'comment') {
          sendComment();
        }
        useMouse(state.selectableId);
      }, 100);
    };
    const getUserIdTag = () => {
      let listTagUser = undefined as any;
      const element = document.getElementById(`${state.selectableId}`) as any;
      if (element) {
        const listTagInHtml = element.getElementsByClassName('mention-item-click') as any;
        if (listTagInHtml?.length > 0) {
          listTagUser = [];
          listTagInHtml.forEach((item: any) => {
            listTagUser.push(Number(item.attributes['user-id'].value));
          });
        }
      }
      return listTagUser;
    };

    watchEffect(() => {
      if (state.files && props.type !== 'comment') {
        nextTick(() => {
          sendComment();
        });
      }
    });

    const sendComment = () => {
      if (props.disabled) return;
      const countText = checkContenteditable(state.text);
      if (countText === 0 && state.files.length === 0 && props.type === 'comment') {
        return;
      }
      const textFormat = removeBlank(state.text);
      const userIdTag = getUserIdTag() || undefined;
      state.fileError = false;
      emit('addComment', textFormat, state.files, userIdTag);
    };
    const resetData = () => {
      state.text = '';
      state.files = [];
      state.fileError = false;
    };

    const showVote = () => {
      emit('showVote');
    };
    const convertTask = () => {
      emit('convertTask', state.text, state.files);
    };

    const closeActionChat = () => {
      emit('closeActionChat');
    };
    const actionReply = () => {
      emit('actionReply');
    };
    return {
      ...toRefs(state),
      resetData,
      checkContenteditable,
      loadIssues,
      onApply,
      keymonitor,
      setTextContent,
      checkFocus,
      checkBlur,
      closeMention,
      setFocus,
      updateEmoji,
      getFile,
      getFileBefore,
      removeFile,
      removeFiles,
      sendComment,
      showIssue,
      refMentionable,
      keySearch,
      inputText,
      showVote,
      closeActionChat,
      refContenteditable,
      permissionCreateTask,
      convertTask,
      actionReply,
      permissionPollVote,
      keyUp,
      typeIsOneToOne,
      permissionMention,
    };
  },
});
</script>
<style lang="scss" scoped>
.mentionable {
  .label {
    position: absolute;
    top: 26px;
    left: 11px;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
}

.focus-label {
  &.label {
    top: 15px;
    transform: translateY(-40%) scale(1);
    transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1),
      max-width 0.396s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    padding: 5px 8px 8px 5px;
    margin-right: 4px;
    font-size: 12px;
    right: 0;
    left: 11px;
  }
}

.mention-item {
  padding: 4px 10px;
  font-size: 14px !important;
}

.mention-selected {
  background: #e9eae8 !important;
  color: #2f2f2f;
}

[contenteditable='true']:empty:before {
  content: attr(placeholder);
  pointer-events: none;
  display: block; /* For Firefox */
}

.issue {
  cursor: pointer;
}

.mention-selected .issue {
  background: #e9eae8 !important;
  color: #2f2f2f;
}

//.issue .number {
//  font-family: monospace;
//}

.dim {
  color: #666;
}

//.is-label {
//  padding: 26px 10px 10px;
//}

[disabled] {
  opacity: 1 !important;
}

.contenteditableCustorm {
  min-height: 82px;
  max-height: 282px;
  margin-bottom: 10px;
  overflow: auto;
  font-size: 14px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  padding: 10px;

  &.is-label {
    padding: 40px 10px 10px;
  }

  &.is-comment {
    padding-bottom: 45px;
  }

  &[disabled] {
    border: 1px solid #d3d3d3 !important;
  }

  &:hover,
  &:focus,
  &:focus-visible {
    border: 1px solid #1c8c44;
    outline: none;
  }

  &::before {
    color: #878b87;
  }
}

.comment-box-action {
  display: flex;
  justify-content: space-between;
  left: 10px;
  right: 2px;
  bottom: 2px;
  position: absolute;
  background: #ffff;
  padding-bottom: 9px;

  &.is-label {
    bottom: 10px;
  }

  &-left {
    display: flex;
    align-items: flex-end;

    &-icon-text {
      font-size: 20px;
      color: #3c3c3c;
    }
  }

  &-right {
    opacity: 0.6;
    margin-right: 10px;
  }
}

.focus-action {
  .comment-box-action-right {
    opacity: 1;
  }
}

.item-label {
  color: #2f2f2f;
}

.q-field--error {
  .contenteditableCustorm {
    border: 2px solid #f44436;
  }
}

.mr-icon {
  margin-right: 10px;
  cursor: pointer;
}

.box-reply-input {
  &-edit {
    padding: 16px 10px;
  }

  padding: 12px 10px;
  background: #f8f8f8;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;

  &-body {
    width: calc(100% - 25px);
    display: flex;
    align-items: center;

    &-content {
      margin-left: 16px;
      width: calc(100% - 32px);

      .reply-title {
        display: flex;
        margin-right: 16px;

        .text-files {
          margin-left: 4px;
          color: #878b87;
          white-space: nowrap;
        }
      }
    }
  }
}

.ellipsis {
  min-width: -webkit-fill-available;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  .text-h5-regular {
    white-space: normal;
  }
}

.box-warning-max-files {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #f44436;
  margin-bottom: 12px;
}

.tool-tip strong {
  font-size: 12px;
  line-height: 20px;
  color: #2f2f2f;
  font-weight: 500;
  padding: 9px 10px;
}

.tool-tip .item-title {
  font-size: 12px;
  color: #2f2f2f;
}
</style>
