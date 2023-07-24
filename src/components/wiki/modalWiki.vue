<template>
  <CModal
    v-model="IsShowModal"
    :classModal="{
      'task-owner': typeModal === 'detail' && checkOwnerTask,
      'task-received': typeModal === 'detail' && !checkOwnerTask,
      'modal-task-channel modal-invite': true,
    }"
    alignFooter="center"
    :showFooter="typeModal !== 'detail'"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span
            class="text-header-title"
            v-if="typeModal === 'add'"
          >
            {{ $t('workspace.wiki.addPost') }}
          </span>
          <span
            v-if="typeModal === 'edit'"
            class="text-header-title"
          >
            <template v-if="infoTask?.type === 'DRAFT'">
              {{
                infoTask?.type === 'DRAFT'
                  ? $t('workspace.wiki.draftPost')
                  : $t('workspace.wiki.editPost')
              }}
            </template>
            <template v-else>
              {{ $t('workspace.wiki.editPost') }}
            </template>
          </span>
          <span
            v-if="typeModal === 'detail'"
            class="text-header-title"
          >
            {{ $t('workspace.wiki.detailPost') }}
          </span>
        </div>
      </div>
    </template>
    <q-form
      @submit="typeModal === 'edit' ? updateTask() : handleCreateTaskNow()"
      ref="myForm"
    >
      <div class="modal-invite-body">
        <div class="row q-col-gutter-md">
          <div
            v-if="typeModal !== 'detail'"
            class="col"
          >
            <CSelect
              v-if="
                typeModal === 'forward' || (infoTask && infoTask?.type !== 'IMMEDIATE')
              "
              v-model="channelName"
              :defaultOptions="listChannel"
              filterAction
              label-slot
              :rules="rulesName"
              outlined
              use-input
              hide-dropdown-icon
              popup-content-class="select-height selectedItem"
              :loading="false"
            >
              <template #label>
                {{ $t('workspace.channel.to') }} <span class="label-require">*</span>
              </template>
              <template #selected-item="{ opt }">
                {{ opt.label }}
              </template>
              <!--              <template #option="{ opt, selected, toggleOption }">-->
              <!--                <q-item-->
              <!--                  clickable-->
              <!--                  :active="selected"-->
              <!--                  @click="toggleOption(opt)"-->
              <!--                  active-class="active-item-selected"-->
              <!--                >-->
              <!--                  <q-item-section-->
              <!--                    avatar-->
              <!--                    v-if="opt.type === 'member'"-->
              <!--                  >-->
              <!--                    <CAvatar-->
              <!--                      size="32px"-->
              <!--                      :avatar="opt?.img"-->
              <!--                      :text="opt?.label?.split('')[0] || 'A'"-->
              <!--                    ></CAvatar>-->
              <!--                  </q-item-section>-->
              <!--                  <q-item-section class="text-body-regular label-opt"-->
              <!--                  >{{ opt?.label || '' }}-->
              <!--                  </q-item-section>-->
              <!--                </q-item>-->
              <!--              </template>-->
            </CSelect>
            <c-text-field
              v-else
              :model-value="channelName?.name || ''"
              readonly
              disable
              :label="$t('workspace.channel.toChannelName')"
            >
            </c-text-field>
          </div>
          <div
            v-if="
              !['add', 'forward'].includes(typeModal) && infoTask?.type === 'IMMEDIATE'
            "
            :class="'col'"
          >
            <CSelect
              :model-value="infoTask.creator"
              readonly
              disable
              :label="$t('workspace.channel.sentTo')"
              multiple
              use-input
              outlined
              hide-dropdown-icon
              bottom-slots
              new-value-mode="add"
              :loading="false"
            >
              <template #selected-item="{ opt }">
                <q-chip
                  size="12px"
                  square
                >
                  <CAvatar
                    size="20px"
                    class="avatar"
                    :avatar="opt?.avatar?.url"
                    :text="opt?.full_name.split('')[0] || opt?.email.split('')[0]"
                  >
                  </CAvatar>
                  {{ opt?.full_name || opt?.email || '' }}
                </q-chip>
              </template>
            </CSelect>
          </div>
          <div
            v-if="typeModal === 'detail'"
            class="col-7"
          >
            <div class="justify-between d-flex">
              <c-text-field
                :model-value="
                  formatDateDisplay(infoTask?.released_at, 'HH:mm, MMM Do YYYY') || ''
                "
                class="w-100"
                readonly
                disable
                bottom-slots
                :label="$t('workspace.channel.sentDateTime')"
              >
                <template
                  v-if="typeModal === 'detail'"
                  #counter
                >
                  {{ activities?.editTime || '' }}
                </template>
              </c-text-field>
              <div
                v-if="permissionEdit"
                class="icon-edit-task"
              >
                <q-icon
                  name="bi-gear"
                  class="cursor-pointer"
                  color="primary"
                  size="24px"
                  @click="changeEditTask"
                />
                <q-icon
                  name="bi-trash3"
                  class="cursor-pointer"
                  color="negative"
                  size="24px"
                  @click="showPopupDelete"
                />
              </div>
            </div>
          </div>
          <div class="col-12">
            <c-text-area
              v-model="topic"
              class="pb-2"
              label-slot
              :rules="typeTask !== 'DRAFT' ? rulesName : undefined"
              :readonly="typeModal === 'detail'"
              max-length="300"
            >
              <template #label>
                {{ $t('workspace.wiki.topic') }} <span class="label-require">*</span>
              </template>
            </c-text-area>
          </div>
          <div
            class="col-12 relative-position"
            :class="{ 'q-field--error': errorMessageContent }"
          >
            <q-editor
              :model-value="toDo"
              :key="renderEditor"
              min-height="228px"
              :placeholder="$t('workspace.wiki.desc')"
              max-height="460px"
              @update:model-value="addToDo"
              :readonly="typeModal === 'detail'"
              :class="{
                'hidden-toolbar': typeModal === 'detail',
              }"
            />
            <div class="q-field__bottom row items-start q-field__bottom--animated">
              <div class="q-field__messages col">{{ errorMessageContent }}</div>
              <div class="q-field__counter">
                {{ checkContenteditable(toDo) }} / {{ maxLengthDesc }}
              </div>
            </div>
          </div>
        </div>
        <div class="box-upload">
          <c-upload
            v-if="typeModal !== 'detail'"
            multiple
            showTitle
            @get-file-before="getFileBefore"
            @get-file="getFile"
            @remove-file="removeFiles"
          >
            <template #action="{ handleUpload }">
              <div class="text-body-regular handle-upload">
                <div v-if="!files?.length">{{ $t('upload.rules') }}</div>
                <div v-else>
                  {{
                    $t('upload.totalUploaded', {
                      count: files.length,
                    })
                  }}
                </div>
              </div>
              <div class="box-upload-post">
                <c-btn
                  label="Upload from computer"
                  icon="bi-upload"
                  color="primary"
                  outline
                  size="small"
                  :disabled="typeModal === 'detail' || files.length === 5"
                  @click="handleUpload"
                />
                <div
                  :class="{
                    disabled: typeModal === 'detail' || files.length === 5,
                    'text-body-regular': true,
                  }"
                >
                  <span>{{ $t('global.or') }}</span>
                  <span
                    class="text-primary cursor-pointer"
                    @click="showModalGetFile"
                    >{{ $t('workspace.wiki.upload.clickHere') }}</span
                  >
                  <span>{{ $t('workspace.wiki.upload.getFromChannel') }}</span>
                </div>
              </div>
            </template>
          </c-upload>
          <div
            v-if="files?.length > 0"
            class="text-body-regular handle-upload"
          >
            <div>
              {{
                $t('upload.totalUploaded', {
                  count: files.length,
                })
              }}
            </div>
          </div>
        </div>
        <div class="row q-gutter-sm">
          <div
            v-for="(item, index) in files"
            :key="index"
          >
            <card-file-upload
              :is-download="!['add'].includes(typeModal)"
              :default-files="item"
              :show-remove-item="typeModal !== 'detail'"
              @removeFile="removeFile"
              @showModalImg="showModalImg"
            />
          </div>
        </div>
        <div
          v-if="['edit', 'detail'].includes(typeModal)"
          class="box-detail"
        >
          <div
            v-if="typeModal === 'detail'"
            class="box-detail-comment"
          >
            <q-separator />
            <div
              v-if="['detail'].includes(typeModal) && infoTask?.ignore_mark"
              class="box-warning-edit-task"
            >
              <span>{{ $t('workspace.channel.modalTaskChannel.warningMark') }}</span>
            </div>
            <div class="box-detail-comment-action">
              <div class="box-detail-comment-action-left text-body-regular">
                <q-icon
                  size="16px"
                  name="bi-chat-dots"
                  class="box-detail-comment-action-left-icon-chat icon-chat"
                />
                <span class="box-detail-comment-action-left-comment text-body-regular">
                  {{
                    $t('workspace.channel.modalTaskChannel.comments', {
                      count: count?.comment,
                    })
                  }}
                </span>
                <q-icon
                  size="20px"
                  name="bi-dot"
                  color="black"
                />
                <q-btn-dropdown
                  dropdown-icon="bi-chevron-down"
                  class="box-detail-comment-action-left-dropdown"
                >
                  <template #label>
                    <span class="text-body-regular">{{ comment.label }}</span>
                  </template>
                  <q-list
                    dense
                    class="menu-item"
                  >
                    <q-item
                      v-for="(menuItem, index) in menuComment"
                      :key="index"
                      clickable
                      v-close-popup
                      @click="menuItem.action"
                    >
                      <q-item-section>
                        <span>{{ menuItem.title }}</span>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
              <!--              <div class="box-detail-comment-action-right text-body">-->
              <!--                <c-btn-->
              <!--                  @click="muteCommentTask"-->
              <!--                  :icon="!isMuteComment ? 'bi-bell-slash' : 'bi-bell'"-->
              <!--                  fontSizeIcon="16"-->
              <!--                  color="neutral"-->
              <!--                  flat-->
              <!--                  :label="-->
              <!--                    !isMuteComment-->
              <!--                      ? $t('workspace.channel.modalTaskChannel.muteComment')-->
              <!--                      : $t('workspace.channel.modalTaskChannel.unmuteComment')-->
              <!--                  "-->
              <!--                ></c-btn>-->
              <!--              </div>-->
            </div>
            <div class="box-detail-comment-input">
              <CAvatar
                size="32px"
                :avatar="infoUser?.avatar?.url"
                :text="
                  infoUser?.full_name?.split('')[0] || infoUser?.email?.split('')[0] || ''
                "
              />
              <commentEditAble
                ref="refCommentEditAble"
                :key="renderCommentEditAble"
                :channel-id="$route?.params?.channelId"
                class="full-width comment-edit-able"
                key-content="comment"
                type="comment"
                placeholder="Write your comment...."
                @addComment="addComment"
                show-action
              ></commentEditAble>
            </div>
            <div class="box-detail-list-comment">
              <div
                v-if="listComment.filter.total > listComment.data.length"
                class="box-detail-list-comment-view text-body"
                @click="viewAllComment"
              >
                {{ $t('workspace.wiki.view') }}
                {{ listComment.filter.total - listComment.data.length }}
                {{ $t('workspace.wiki.previousComments') }}
              </div>
              <div
                v-for="(comment, index) in listComment.data"
                :key="`comment-1-${index}`"
              >
                <CardComment
                  :formComment="comment"
                  @actionLike="actionLike"
                  @update:formComment="(e) => (comment.showComment = e.showComment)"
                >
                  <template #reply>
                    <div
                      v-for="(reply, i) in comment.children"
                      :key="`reply-1-${i}`"
                    >
                      <CardComment
                        :ref="`cardComment-${i}`"
                        :formComment="reply"
                        :show-reply="false"
                        @actionLike="actionLike"
                      >
                      </CardComment>
                    </div>
                  </template>
                  <template #comment>
                    <commentEditAble
                      class="full-width comment-edit-able"
                      :key-content="`comment-reply-1-${index}`"
                      :channel-id="$route?.params?.channelId"
                      type="comment"
                      placeholder="Write your comment...."
                      @addComment="
                        (textComment, fileComment, listTag) =>
                          addComment(textComment, fileComment, listTag, comment)
                      "
                      show-action
                    ></commentEditAble>
                  </template>
                </CardComment>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-form>
    <template #footer>
      <template
        v-if="
          ['add', 'forward'].includes(typeModal) ||
          (typeModal === 'edit' && infoTask?.type === 'DRAFT')
        "
      >
        <c-btn
          size="large"
          color="neutral"
          flat
          :label="$t('workspace.channel.modalTaskChannel.saveToDraft')"
          :loading="loading"
          @click="saveTaskToDraft"
        />
        <c-btn
          color="primary"
          size="large"
          outline
          :label="$t('workspace.channel.modalTaskChannel.scheduleLater')"
          :loading="loading"
          @click="showSchedulesModal"
        />
        <c-btn
          color="primary"
          size="large"
          :label="$t('workspace.channel.modalTaskChannel.sendBtn')"
          :loading="loading"
          @click="handleCreateTaskNow"
        />
      </template>
      <template
        v-if="
          ['edit'].includes(typeModal) &&
          ['IMMEDIATE', 'SCHEDULE'].includes(infoTask?.type)
        "
      >
        <c-btn
          v-if="infoTask?.type === 'SCHEDULE'"
          size="large"
          color="neutral"
          flat
          :label="$t('workspace.channel.modalTaskChannel.sendNow')"
          :loading="loading"
          @click="handleUpdateTaskNow"
        />
        <c-btn
          color="primary"
          size="large"
          outline
          :label="$t('global.cancel')"
          :loading="loading"
          @click="closeModal"
        />
        <c-btn
          v-if="infoTask?.type === 'IMMEDIATE'"
          color="primary"
          size="large"
          :label="$t('global.save')"
          :loading="loading"
          @click="updateTask"
        />
        <c-btn
          v-if="infoTask?.type === 'SCHEDULE'"
          color="primary"
          size="large"
          :label="$t('global.save')"
          :loading="loading"
          @click="updateTaskSchedules"
        />
      </template>
    </template>
  </CModal>
  <c-confirm
    v-model="showModalConfirm"
    :title="infoModalConfirm.title"
    :text-ok="infoModalConfirm.textOk"
    :text-cancel="infoModalConfirm.textCancel"
    :loading="loadingModal"
    :disabled="infoModalConfirm.disabled"
    :alignFooter="infoModalConfirm.alignFooter"
    @on-ok="onOk"
  >
    <div v-if="infoModalConfirm.type === 'confirm'">{{ infoModalConfirm.desc }}</div>
  </c-confirm>

  <ModalSelectFilesChannel
    v-model:default-files="files"
    :channel-id="channelName?.id"
    v-model="showModalFile"
  ></ModalSelectFilesChannel>
  <modal-chose-schedules
    ref="refModalSchedules"
    v-model="isShowModalSchedules"
    @onOk="scheduleTask"
    @close="closeSchedulesModal"
  />
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch, nextTick } from 'vue';
import { date } from 'quasar';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NotifyServices from 'src/plugins/NotifyServices';
import { useChannelStore } from 'stores/channel';
import WikiService from 'src/services/wiki';

import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import commentEditAble from 'components/general/commentEditAble.vue';
import {
  formatDateToIosString,
  formatIosStringToDate,
  checkData,
  formatDateDisplay,
  optionsFn,
  scrollToId,
  focusToId,
  validate,
  resetValidation,
} from 'src/helper/global';
import { formComment } from 'src/interface/comment';
import CardComment from 'components/common/CardComment.vue';
import ModalChoseSchedules from 'components/channel/modalChoseSchedules.vue';
import { formChannel } from 'src/interface/cardChannel';
import { bodySendReactComment, paramsCommentWiki } from 'src/services/wiki/model';
import CConfirm from 'components/common/CConfirm.vue';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
// import FileItem from 'components/general/FileItem.vue';
import { checkContenteditable } from 'src/helper/validForm';
import ModalSelectFilesChannel from 'components/upfile/ModalSelectFilesChannel.vue';

interface typeListComment {
  data: Array<formComment>;
  filter: any;
}

const maxLengthDesc = 15000;
export default defineComponent({
  name: 'modalWiki',
  methods: { checkContenteditable },
  components: {
    ModalSelectFilesChannel,
    // FileItem,
    CConfirm,
    ModalChoseSchedules,
    CardComment,
    CardFileUpload,
    commentEditAble,
  },
  props: {},
  emits: ['reload', 'createTask'],
  setup(props, { emit }) {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const { t } = useI18n();

    const menuComment = computed(() => {
      return [
        {
          title: t('workspace.channel.menuComment.allComment'),
          action: () => {
            state.listComment.filter.page_size = state.listComment.filter.total;
            findAllComment('ALL', t('workspace.channel.menuComment.allComment'));
          },
        },
        {
          title: t('workspace.channel.menuComment.topComment'),
          action: () =>
            findAllComment('TOP', t('workspace.channel.menuComment.topComment')),
        },
        {
          title: t('workspace.channel.menuComment.newComment'),
          action: () =>
            findAllComment('DESC', t('workspace.channel.menuComment.newComment')),
        },
        {
          title: t('workspace.channel.menuComment.oldComment'),
          action: () =>
            findAllComment('ASC', t('workspace.channel.menuComment.oldComment')),
        },
      ];
    });

    const state = reactive<{
      loading: boolean;
      name: any;
      channelName?: any;
      toDo: string;
      topic: string;
      dueDate: string;
      files: any;
      selectedFile: any;
      typeTask: 'DRAFT' | 'SCHEDULE' | 'IMMEDIATE';
      scheduled_at: string;
      errors: any;
      // add, forward, edit, detail
      typeModal: string;
      count: any;
      infoTask?: any | null;
      activities?: any | null;
      loadingModal: boolean;
      showModalConfirm: boolean;
      showModalFile: boolean;
      infoModalConfirm: typeInfoModalConfirm;
      loadingPopup: boolean;
      comment: any;
      listComment: typeListComment;
      isShowModalSchedules: boolean;
      isMuteComment: boolean;
      rulesName: Array<any>;
      errorMessageContent: string;
      renderEditor: number;
    }>({
      loading: false,
      channelName: '',
      name: infoUser.value,
      toDo: '',
      topic: '',
      dueDate: '',
      files: [],
      selectedFile: [],
      typeTask: 'IMMEDIATE',
      scheduled_at: '',
      errors: {
        content: '',
        due_at: '',
      },
      typeModal: 'add',
      count: {
        done: 0,
        cancel: 0,
        comment: 0,
      },
      infoTask: null,
      loadingModal: false,
      showModalFile: false,
      showModalConfirm: false,
      infoModalConfirm: {
        type: 'confirm',
        title: '',
        textOk: '',
        textCancel: '',
        alignFooter: '',
        desc: '',
        disabled: false,
      },
      loadingPopup: false,
      comment: {
        label: menuComment.value[0].title,
        type: 'All',
      },
      listComment: {
        data: [],
        filter: {
          total: 0,
          page_size: 10,
        },
      },
      activities: null,
      isShowModalSchedules: false,
      isMuteComment: false,
      rulesName: [(val: string) => !!val || t('global.messages.required')],
      errorMessageContent: '',
      renderEditor: 0,
    });
    const route = useRoute();
    const refModalSchedules = ref();
    const refContentEditAble = ref();
    const refCommentEditAble = ref();
    const renderCommentEditAble = ref(0);
    const disabledBtn = computed(() => {
      if (state.typeModal === 'forward') {
        return ['toDo', 'dueDate', 'channelName'];
      } else {
        return ['toDo', 'dueDate'];
      }
    });
    const channelStore = useChannelStore();

    const channelDetail = computed(() => {
      return channelStore.detailChanel;
    });
    const listChannel = computed(() => {
      const channel = channelStore.listChannel.map((item: any) => {
        return {
          ...item,
          label: `#${item.name}` || '',
          value: item.id || '',
          type: 'channel',
        };
      });
      return [...channel];
    });
    // const options = ref()

    watch(infoUser, () => {
      state.name = infoUser.value;
    });

    const checkLikeComment = (reactions: any) => {
      let check = false;
      reactions.forEach((item: any) => {
        if (item.user.id === infoUser.value?.id) {
          check = true;
        }
      });
      return check;
    };

    const checkCommentId = ref(false);
    const formatDataListTime = (item: any) => {
      checkCommentId.value = Number(item.id) === Number(route.query?.commentId);

      return {
        ...item,
        avatar: item?.user?.avatar?.url || '',
        name: item?.user?.full_name || item?.user?.email || '',
        time: item.created_at,
        like: {
          number: item.reactions.length,
          status: checkLikeComment(item.reactions) ? 'action' : 'basic',
        },
        showComment: false,
      };
    };
    // comment
    const findAllComment = (type: any, label: string) => {
      state.comment.label = label;
      state.comment.type = type;
      let params: paramsCommentWiki = {
        wiki_id: state.infoTask?.id,
        page: 1,
        page_size: state.listComment.filter.page_size || 10,
      };
      if (['DESC', 'ASC'].includes(type)) {
        params = {
          ...params,
          sort_by: 'id',
          order_by: type,
        };
      }
      if (type === 'ALL') {
        params = {
          ...params,
          page_size: state.listComment.filter.page_size,
        };
      }
      if (type === 'TOP') {
        params = {
          ...params,
          page_size: 10,
          sort_by: 'top_comment',
        };
      }
      getCommentTask(params);
    };

    const getCommentTask = (params: paramsCommentWiki) => {
      WikiService.getAllCommentWiki(params).then((res: any) => {
        if (res?.status_code === 200) {
          state.listComment.filter.total = res.data.total;
          state.count.comment = res.data.comment_count || 0;
          state.listComment.data = res.data.data.map((item: any) => {
            let objTime: formComment = {
              ...formatDataListTime(item),
            };
            objTime.children = item.children.map((child: any) => {
              return {
                ...formatDataListTime(child),
                tagName: item.user?.full_name || item.user?.email,
              };
            });
            return objTime;
          });
          if (route.query?.commentId && checkCommentId) {
            nextTick(() => {
              scrollToId(`cardComment-${route.query?.commentId}`);
              focusToId(`cardComment-${route.query?.commentId}`);
            });
          }
        }
      });
    };

    const viewAllComment = () => {
      let params: paramsCommentWiki = {
        wiki_id: state.infoTask?.id,
        page: 1,
        page_size: state.listComment.filter.total || 99,
      };
      getCommentTask(params);
    };

    // file
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
      console.log('listFile', listFile);
      console.log('state.files', state.files);
      if (state.files.length > 5) {
        state.files = state.files.slice(0, 5);
      }
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
      state.selectedFile = state.selectedFile.filter((item: any) => item.id !== file.id);
    };
    const removeFiles = (files: any) => {
      files.forEach((item: any) => {
        removeFile(item);
      });
    };
    const workspaceStore = useWorkspaceStore();

    const showModalImg = () => {
      workspaceStore.setListViewFile(state.files);
    };
    //
    const IsShowModal = computed(() => {
      return channelStore.IsShowModalPost;
    });

    watch(IsShowModal, () => {
      if (IsShowModal.value && !state.channelName && channelDetail.value) {
        state.channelName = {
          ...channelDetail.value,
          label: `#${channelDetail.value?.name}` || '',
          value: channelDetail.value?.id || '',
        };
      }
    });

    const resetData = () => {
      resetValidation(myForm.value);
      state.errorMessageContent = '';
      state.loading = false;
      state.name = infoUser.value;
      state.channelName = '';
      state.toDo = '';
      state.topic = '';
      state.scheduled_at = '';
      state.infoTask = null;
      state.files = [];
      state.typeModal = 'add';
      state.count = {
        done: 0,
        cancel: 0,
        comment: 0,
      };
      state.showModalConfirm = false;
      state.showModalFile = false;
      refModalSchedules.value.closeModal();
      // state.isShowModalSchedules = false;
      state.infoModalConfirm = {
        type: 'confirm',
        title: '',
        textOk: '',
        textCancel: '',
        alignFooter: '',
        desc: '',
        disabled: false,
      };
    };

    const closeModal = () => {
      resetData();
      channelStore.IsShowModalPost = false;
    };

    //

    const addToDo = (value: any) => {
      if (checkContenteditable(value) <= maxLengthDesc) {
        state.toDo = value;
      } else {
        state.renderEditor += 1;
      }
      if (value) state.errorMessageContent = '';
    };
    const getCount = (info: any) => {
      state.count = {
        ...state.count,
        done: info.mark_done_count || 0,
        cancel: info.mark_cancel_count || 0,
      };
    };
    const getActivities = (listActivities: any) => {
      state.activities = null;
      if (listActivities.length > 0) {
        state.activities = {};
        const activity = listActivities[0] as any;
        console.log(activity);
        const editTime = `${t('global.edited')} ${formatDateDisplay(
          activity.created_at,
          'MMM DD,YYYY',
        )} at ${formatDateDisplay(activity.created_at, 'h:mm A')}`;
        state.activities = {
          editTime,
        };
        console.log(' state.activities', state.activities);
      }
    };

    const markAsRead = (value: boolean, item?: formChannel) => {
      return new Promise((resolve, reject) => {
        WikiService.markReadWiki({
          workspace_id: Number(route?.params?.workspaceId),
          channel_id: Number(state.channelName.value),
          wiki_ids: item?.id ? [item?.id] : [],
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              mainStore.actionReloadSideBar();
              emit('reload');
              resolve(true);
            } else {
              NotifyServices.showMessageError(res?.errors.message);
              reject(false);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(false);
          });
      });
    };

    const setInfoModal = async (itemId: number | string, type?: string) => {
      if (type === 'detail') {
        const checkRead = await markAsRead(true, {
          id: Number(itemId),
        });
        if (!checkRead) return;
      }
      await WikiService.getDetailWiki(`${itemId}`).then((res: any) => {
        if (res?.status_code === 200) {
          resetData();
          const info: any = res.data;
          state.typeModal = type || 'add';
          state.channelName = {
            ...info.channel,
            label: `#${info.channel.name}` || '',
            value: info.channel.id || '',
          };
          state.topic = info.topic || '';
          state.toDo = info.content || '';
          state.infoTask = {
            ...info,
          };
          getActivities(info.activities);

          getCount(info);
          state.count.comment = info.comment_count || 0;
          if (
            type === 'forward' &&
            formatIosStringToDate(info.due_at) <=
              date.formatDate(new Date(), 'YYYY/MM/DD hh:mm A')
          ) {
            // const newDate = addToDate(new Date(), { days: 1 });
            // state.dueDate = date.formatDate(newDate, 'YYYY/MM/DD hh:mm A');
            state.dueDate = '';
          } else {
            state.dueDate = formatIosStringToDate(info.due_at);
            // state.dueDate = '';
          }
          state.files = info?.attachments.map((file: any) => {
            return {
              ...file,
              name: file?.originalname || '',
            };
          });
          if (type === 'detail') {
            findAllComment('ALL', t('workspace.channel.menuComment.allComment'));
          }
          channelStore.IsShowModalPost = true;
        }
      });
    };

    const reloadInfoTask = () => {
      setInfoModal(state.infoTask.id, state.typeModal);
    };

    // add task
    const handleCreateTaskNow = () => {
      state.typeTask = 'IMMEDIATE';
      if (state.infoTask?.id) {
        updateTask();
      } else {
        createTask();
      }
    };

    const handleUpdateTaskNow = () => {
      state.typeTask = 'IMMEDIATE';
      updateTask();
    };
    const myForm = ref();
    const createTask = async () => {
      const check = await validate(myForm.value);
      if (state.typeTask !== 'DRAFT') {
        if (!state.toDo) {
          state.errorMessageContent = t('global.messages.required');
          return;
        }
        state.errorMessageContent = '';
      }
      if (!check) return;
      state.loading = true;
      let fileIds = state.files.map((item: any) => item.id) || [];
      //typeModal === 'forward'
      WikiService.createWiki({
        channel_id:
          state.typeModal === 'forward'
            ? state.channelName.value
            : Number(channelDetail.value?.id),
        content: state.toDo,
        topic: state.topic,
        attachment_ids: [...fileIds],
        type: state.typeTask,
        scheduled_at: state.scheduled_at || null,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            if (state.typeTask === 'IMMEDIATE') {
              NotifyServices.showMessageSuccess(
                t('workspace.wiki.notify.createPostSuccess'),
              );
            }
            if (state.typeTask === 'DRAFT') {
              NotifyServices.showMessageSuccess(
                t('workspace.wiki.notify.createPostDraft'),
              );
            }
            if (state.typeTask === 'SCHEDULE') {
              NotifyServices.showMessageSuccess(
                t('workspace.wiki.notify.createPostSchedule'),
              );
              // state.isShowModalSchedules = false;
            }
            mainStore.actionReloadSideBar();
            emit('createTask');
            closeModal();
          } else if (res?.status_code === 400) {
            state.errors = res.errors;
            if (res?.errors?.message) {
              NotifyServices.showMessageError(res?.errors.message);
            }
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          // if (state.typeModal === 'forward') {
          //   NotifyServices.showMessageError(
          //     t('workspace.channel.notify.forwardTaskFailed'),
          //   );
          // } else {
          NotifyServices.showMessageError(t('workspace.wiki.notify.createPostFailed'));
          // }
        })
        .finally(() => {
          state.loading = false;
          closeSchedulesModal();
        });
    };
    const saveTaskToDraft = () => {
      state.typeTask = 'DRAFT';
      if (state.infoTask?.id) {
        updateTask();
      } else {
        createTask();
      }
    };
    const showSchedulesModal = async () => {
      const check = await validate(myForm.value);
      if (!state.toDo) {
        state.errorMessageContent = t('global.messages.required');
        return;
      }
      state.errorMessageContent = '';
      if (!check) return;
      state.typeTask = 'SCHEDULE';
      state.isShowModalSchedules = true;
    };
    const closeSchedulesModal = () => {
      state.typeTask = 'IMMEDIATE';
      state.isShowModalSchedules = false;
    };
    const scheduleTask = (newDate: string) => {
      state.typeTask = 'SCHEDULE';
      state.scheduled_at = formatDateToIosString(newDate);
      if (state.infoTask?.id) {
        updateTask();
      } else {
        createTask();
      }
    };
    const updateTaskSchedules = () => {
      state.typeTask = 'SCHEDULE';
      state.scheduled_at = state?.infoTask?.scheduled_at || null;
      updateTask();
    };
    // update task
    const updateTask = async () => {
      const check = await validate(myForm.value);
      if (state.typeTask !== 'DRAFT') {
        if (!state.toDo) {
          state.errorMessageContent = t('global.messages.required');
          return;
        }
        state.errorMessageContent = '';
      }
      if (!check) return;

      state.loading = true;
      let fileIds = state.files.map((item: any) => item.id) || [];
      //typeModal === 'forward'
      WikiService.updateWiki(`${state.infoTask?.id}`, {
        channel_id: Number(state.channelName.value),
        content: state.toDo,
        topic: state.topic,
        attachment_ids: [...fileIds],
        type: state.typeTask,
        scheduled_at: state.scheduled_at || null,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.wiki.notify.updatePostSuccess'),
            );
            mainStore.actionReloadSideBar();
            emit('reload');
            closeModal();
          } else if (res?.status_code === 400) {
            state.errors = res.errors;
            if (res?.errors?.message) {
              NotifyServices.showMessageError(res?.errors.message);
            }
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(t('workspace.wiki.notify.updatePostFailed'));
        })
        .finally(() => {
          state.loading = false;
          closeSchedulesModal();
        });
    };

    const removePost = () => {
      WikiService.deleteWiki(state.infoTask.id)
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.wiki.notify.removePostSuccess'),
            );
            emit('reload');
            closeModal();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(t('workspace.wiki.notify.removePostFailed'));
        });
    };

    const showPopupDelete = () => {
      state.showModalConfirm = true;
      state.infoModalConfirm = {
        type: 'confirm',
        title: t('workspace.wiki.popupDelete.title'),
        textOk: t('workspace.wiki.popupDelete.textOk'),
        textCancel: t('global.no'),
        alignFooter: 'right',
        desc: t('workspace.wiki.popupDelete.desc'),
        disabled: false,
        action: () => {
          removePost();
        },
      };
    };
    const showModalGetFile = () => {
      state.showModalFile = true;
    };

    const onOk = () => {
      state.infoModalConfirm.action();
    };

    const addComment = (
      comment: string,
      files?: any,
      listTag?: any,
      item?: formComment,
    ) => {
      const filesId = files.map((item: any) => item.id);
      WikiService.sendCommentWiki({
        wiki_id: state.infoTask?.id,
        comment_id: item?.id || undefined,
        content: comment,
        attachment_ids: [...filesId],
        mention_user_ids: listTag ? [...listTag] : undefined,
      }).then((res: any) => {
        if (res?.status_code === 200) {
          renderCommentEditAble.value += 1;
          findAllComment(state.comment.type, state.comment.label);
          emit('reload');
        }
      });
    };

    const actionLike = (item: formComment, emoji: any, isReact?: boolean) => {
      const body: bodySendReactComment = {
        wiki_id: state.infoTask?.id,
        comment_id: item.id,
        emoji: emoji?.colons || ':like:',
      };
      if (!isReact) {
        WikiService.unReactCommentWiki(body)
          .then((res: any) => {
            if (res?.status_code === 200) {
              findAllComment(state.comment.type, state.comment.label);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        WikiService.reactCommentWiki(body)
          .then((res: any) => {
            if (res?.status_code === 200) {
              findAllComment(state.comment.type, state.comment.label);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    };
    const workspaceRoleAdmin = computed(
      () => workspaceStore.workspaceRoleAdmin,
      // true
    );
    const workspaceRoleOwner = computed(
      () => workspaceStore.workspaceRoleOwner,
      // true
    );
    const checkOwnerTask = computed(() => {
      return channelStore.checkOwnerTask(state?.infoTask?.creator?.id);
    });
    const permissionEdit = computed(() => {
      return (
        channelStore.isOwner ||
        checkOwnerTask.value ||
        workspaceRoleAdmin.value ||
        workspaceRoleOwner.value
      );
    });

    const changeEditTask = () => {
      state.typeModal = 'edit';
    };
    return {
      ...toRefs(state),
      myForm,
      channelDetail,
      refModalSchedules,
      infoUser,
      IsShowModal,
      listChannel,
      refContentEditAble,
      refCommentEditAble,
      renderCommentEditAble,
      disabledBtn,
      closeModal,
      getFile,
      getFileBefore,
      removeFile,
      removeFiles,
      showModalImg,
      formatDateToIosString,
      formatIosStringToDate,
      handleCreateTaskNow,
      saveTaskToDraft,
      checkData,
      addToDo,
      scheduleTask,
      optionsFn,
      setInfoModal,
      updateTask,
      showPopupDelete,
      addComment,
      menuComment,
      actionLike,
      viewAllComment,
      showSchedulesModal,
      closeSchedulesModal,
      formatDateDisplay,
      changeEditTask,
      permissionEdit,
      checkOwnerTask,
      onOk,
      showModalGetFile,
      maxLengthDesc,
      handleUpdateTaskNow,
      updateTaskSchedules,
    };
  },
});
</script>

<style scoped lang="scss">
.text-header {
  &-title {
    color: #2f2f2f;
    margin-right: 8px;
  }

  &-name {
    color: #878b87;
  }
}

.box-detail {
  margin-top: 40px;

  &-mark-done {
    &-text {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #3c3c3c;
    }

    &-action {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 56px;

      .mark-done-check-box {
        margin-right: 8px;

        :deep(.q-checkbox__icon) {
          font-size: 32px;
          color: #565656;

          &.bi-x-circle-fill {
            color: #f44436;
          }

          &.bi-check-circle-fill {
            color: #1c8c44;
          }
        }
      }
    }
  }

  &-comment-action {
    display: flex;
    justify-content: space-between;
    padding-top: 16px;
    padding-bottom: 16px;
    align-items: center;
    height: 52px;

    &-left {
      color: #2f2f2f;

      &-icon-chat {
        margin-bottom: 4px;
        margin-right: 8px;
      }

      &-comment {
        margin-right: 8px;
      }

      &-dropdown {
        .text-body-regular {
          text-transform: none;
        }
      }
    }

    &-right {
      color: #565656;
    }
  }

  &-comment-input {
    display: flex;
    margin-bottom: 20px;

    .q-avatar {
      margin-right: 12px;
    }
  }

  &-list-comment {
    &-view {
      cursor: pointer;
      color: #565656;
      padding-left: 8px;
      padding-bottom: 20px;
    }
  }
}

:deep(.comment-edit-able) {
  //height: 82px;
}

.c-upload {
  margin-bottom: 24px;
}

.label-opt {
  color: #2f2f2f;
}

.avatar {
  border-radius: 50%;
  margin-left: 0;
}

.q-chip {
  background: #e9eae8;
  padding: 2px 4px;
}

.handle-upload {
  margin-bottom: 8px;
  color: #878b87;
}

.q-separator {
  color: #e9eae8;
}

.icon-chat {
  margin-bottom: 4px;
}

.menu-item {
  min-width: 200px;
}

.icon-edit-task {
  display: flex;

  i.q-icon {
    margin-left: 16px;
    margin-top: 16px;
  }
}

.box-upload-post {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 0;
  height: 128px;
  background: #ffffff;
  border: 1px dashed #878b87;
  border-radius: 8px;

  .text-body-regular {
    margin-top: 12px;

    .text-primary {
      font-weight: 500;
    }

    span {
      margin-right: 4px;
    }
  }
}
</style>
