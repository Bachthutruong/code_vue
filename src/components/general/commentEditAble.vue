<template>
  <div>
    <Mentionable
      :keys="['@']"
      :items="userTag"
      v-bind="$attrs"
      :class="{
        'q-field--error': isError,
      }"
      ref="refMentionable"
      offset="6"
      @apply="onApply"
      @open="loadIssues()"
      @close="closeMention()"
      @search="loadIssues($event)"
    >
      <div
        v-if="disabled"
        class="contenteditableCustorm contenteditableCustormMobie scroll-bar"
        disabled
        :style="{ maxHeight: type === 'comment' ? 'inherit' : maxHeight }"
        :class="{
          'is-label': labelSlot || label,
          'is-comment': type === 'comment',
        }"
      >
        <div v-html="text"></div>
      </div>
      <contenteditable
        v-if="!disabled"
        :style="{ maxHeight: type === 'comment' ? 'inherit' : maxHeight }"
        spellcheck="false"
        :id="selectableId"
        class="contenteditableCustorm contenteditableCustormMobie scroll-bar"
        :class="{
          'is-label': labelSlot || label,
          'is-comment': type === 'comment',
        }"
        tag="div"
        :contenteditable="contenteditableType"
        :modelValue="text"
        :key="renderEditor"
        @update:modelValue="inputText"
        :placeholder="placeholder"
        @keyup="keymonitor($event)"
        @keydown="keymonitor($event)"
        @focus="checkFocus()"
        @blur="checkBlur()"
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
          'focus-action': checkBorderFocus.focus || text || files.length,
        }"
      >
        <div class="comment-box-action-left">
          <div
            v-if="!hiddenTag"
            class="comment-box-action-left-icon-text mr-icon q-icon"
            @click="showIssue"
          >
            <span class="">@</span>
          </div>
          <div class="mr-icon">
            <AppPickerComposition @updateEmoji="updateEmoji">
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
              accept=".jpg, image/*"
            >
              <template #action="{ handleUpload }">
                <q-icon
                  size="20px"
                  name="bi-image"
                  @click="handleUpload"
                ></q-icon>
              </template>
            </C-upload>
          </div>
        </div>
        <div class="comment-box-action-right">
          <CButton
            round
            icon="bi-send"
            color="primary"
            size="small"
            fontSizeIcon="16"
            @click="sendComment()"
          ></CButton>
        </div>
      </div>
      <template #no-result>
        <q-item v-show="!hiddenTag">
          <q-spinner-dots
            v-if="loading"
            color="primary"
            size="40px"
          />
          <span v-else>No result</span>
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
      v-if="files"
      class="row q-gutter-sm"
    >
      <div
        v-for="(item, index) in files"
        :key="index"
      >
        <card-file-upload
          :is-download="false"
          :default-files="item"
          @removeFile="removeFile"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, computed } from 'vue';
// import {useI18n} from "vue-i18n";
import { useMouse } from 'src/helper/global';
// import {newLine} from "../../../public/js/newLine";
import { Mentionable } from 'vue-mention';
import contenteditable from 'vue-contenteditable';
import { checkContenteditable } from 'src/helper/validForm';
import CButton from 'components/common/CButton.vue';
import AppPickerComposition from 'components/emoji/AppPickerComposition.vue';
import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import ChannelService from 'src/services/channel';

export default defineComponent({
  name: 'commentEditAble',
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
      type: String,
      default: '',
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: String,
      default: '245px',
    },
  },
  emits: ['addComment'],
  components: {
    CButton,
    Mentionable,
    contenteditable,
    AppPickerComposition,
    CardFileUpload,
  },
  setup(props, { emit }) {
    // const {t} = useI18n();
    const refMentionable = ref();
    const state = reactive<{
      userTag: any;
      loading: boolean;
      text: any;
      // placeholder: string,
      // label?: string,
      contenteditableType: boolean;
      timeout: any;
      selectableId: any;
      showMention: any;
      checkBorderFocus: any;
      error: boolean;
      files: any;
      renderEditor: number;
    }>({
      userTag: [],
      loading: false,
      text: '',
      // placeholder: '',
      // label: 'What to do',
      contenteditableType: true,
      timeout: null,
      selectableId: 'selectable' + (props.keyContent || ''),
      showMention: false,
      checkBorderFocus: {
        focus: false,
        content: false,
      },
      error: false,
      files: [],
      renderEditor: 0,
    });
    // onMounted(() => {
    // })

    const removeBlank = (string: string) => {
      const regex = /\&nbsp;|(<div><br><\/div>)/g;
      return string.replace(regex, ' ').trim();
    };
    const setFocus = () => {
      let element = document.getElementById(`${state.selectableId}`);
      element?.focus();
    };
    // ======== Set parent to child ============
    const reset = () => {
      state.text = '';
    };

    const keySearch = computed(() => {
      if (props.hiddenTag) return [];
      return ['@'];
    });
    // Edit
    const setTextContent = (text: string, selectable?: string) => {
      state.text = text;
      state.selectableId = selectable;
    };
    const inputText = (text: any) => {
      let length = 0;
      if (props.count) {
        length = props.count;
      } else {
        length = 4000;
      }
      if (props?.isEdit) {
        state.text = text;
        return;
      }
      if (checkContenteditable(text) <= length) {
        state.text = text;
      } else {
        state.renderEditor += 1;
      }
    };
    // =========== End Set parent to child =============
    // ======== Set child to parent ============

    // =========== End Set child to parent =============

    const keymonitor = (event: any) => {
      let countBr = document.querySelectorAll(`#${state.selectableId} div`).length;
      let countText = checkContenteditable(state.text);
      let length = 0;
      if (props.count) {
        length = props.count;
      } else {
        length = 4000;
      }
      if (props?.type !== 'comment') {
        sendComment();
        // if (countBr + countText <= length) {
        //   state.text = text;
        // } else {
        //   state.renderEditor += 1;
        // }

        if (state.text && countText >= length && event.keyCode != 8 && !props?.isEdit) {
          state.renderEditor += 1;
          sendComment();
          event.preventDefault();
        }
      }
    };

    const loadIssues = async (searchText: any = null) => {
      if (props.hiddenTag) return;
      state.showMention = true;
      let body = {
        search: searchText ? searchText : '',
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
          });
      }, 800);
    };
    const closeMention = () => {
      state.showMention = false;
    };
    const onApply = (item: any, key: any, replacedWith: any) => {
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
    };
    const getFileBefore = (listFile: any) => {
      if (!listFile) return;
      listFile.map((item: any) => {
        state.files.push({
          ...item,
          name: item.originalname || item.name || '',
        });
      });
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
    const sendComment = () => {
      if (props.disabled) return;
      const countText = checkContenteditable(state.text);
      if (countText === 0 && state.files.length === 0 && props.type === 'comment') return;
      const textFormat = removeBlank(state.text);
      const userIdTag = getUserIdTag() || undefined;
      emit('addComment', textFormat, state.files, userIdTag);
    };

    const resetData = () => {
      state.text = '';
      state.files = [];
    };

    const isError = computed(() => {
      if (props?.errorMessage) {
        return true;
      }
      if (props?.isEdit) {
        return checkContenteditable(state.text) > props?.count;
      }
      return false;
    });
    return {
      ...toRefs(state),
      resetData,
      checkContenteditable,
      loadIssues,
      onApply,
      keymonitor,
      reset,
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
      isError,
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
  min-height: 108px;
  max-height: 416px;
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
    padding-bottom: 50px;
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
  bottom: 1px;
  position: absolute;
  background: #ffff;
  padding-bottom: 9px;

  &.is-label {
    bottom: 10px;
  }

  &-left {
    display: flex;

    .mr-icon {
      margin-right: 14px;
      cursor: pointer;
    }

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
</style>
