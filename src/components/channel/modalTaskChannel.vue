<template>
  <CModal
    v-model="IsShowModalAddTask"
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
            {{ $t('workspace.channel.addTask') }}
          </span>
          <span
            class="text-header-title"
            v-if="typeModal === 'forward'"
            >{{ $t('workspace.channel.forwardTask') }}</span
          >
          <div
            v-if="['edit', 'detail'].includes(typeModal)"
            class="flex"
          >
            <span
              v-if="typeModal === 'edit'"
              class="text-header-title"
            >
              {{ $t('workspace.channel.editTask') }}
            </span>
            <div>
              <div class="block-priority">
                <div
                  class="block-priority__tag text-body"
                  :class="ListStatusTask[statusTask]?.class"
                >
                  {{ ListStatusTask[statusTask]?.text }}
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              typeModal === 'add' ||
              (['detail'].includes(typeModal) && infoTask?.can_edit)
            "
            class="box-warning-edit-task"
          >
            <q-icon
              name="bi-info-circle"
              color="negative"
              size="16px"
            ></q-icon>
            <span>{{ $t('workspace.channel.modalTaskChannel.warningEdit') }}</span>
          </div>
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
              v-if="typeModal === 'forward'"
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
              <template #option="{ opt, selected, toggleOption }">
                <q-item
                  clickable
                  :active="selected"
                  @click="toggleOption(opt)"
                  active-class="active-item-selected"
                >
                  <q-item-section
                    avatar
                    v-if="opt.type === 'member'"
                  >
                    <CAvatar
                      size="32px"
                      :avatar="opt?.img"
                      :text="opt?.label?.split('')[0] || 'A'"
                    ></CAvatar>
                  </q-item-section>
                  <q-item-section class="text-body-regular label-opt"
                    >{{ opt?.label || '' }}
                  </q-item-section>
                </q-item>
              </template>
            </CSelect>
            <c-text-field
              v-else
              :model-value="channelDetail?.name || ''"
              readonly
              disable
              :label="$t('workspace.channel.toChannelName')"
            >
            </c-text-field>
          </div>
          <div
            v-if="!['add', 'forward'].includes(typeModal)"
            :class="typeModal !== 'detail' ? 'col-6' : 'col'"
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
            class="col-6"
          >
            <div class="justify-between d-flex">
              <c-text-field
                :model-value="
                  formatDateDisplay(infoTask?.released_at, 'HH:mm, MMM Do YYYY') || ''
                "
                class="w-100"
                readonly
                disable
                :label="$t('workspace.channel.sentDateTime')"
              >
              </c-text-field>
              <div
                v-if="permissionEdit && infoTask?.can_edit"
                class="icon-edit-task"
              >
                <q-icon
                  name="bi-gear"
                  class="cursor-pointer"
                  color="primary"
                  size="24px"
                  @click="changeEditTask"
                />
              </div>
            </div>
          </div>
          <div class="col-12 task-comment-edit">
            <commentEditAble
              ref="refContentEditAble"
              :disabled="typeModal === 'detail'"
              :channel-id="$route?.params?.channelId"
              :count="typeModal === 'detail' ? 0 : 1500"
              labelSlot
              :errorMessage="errorMessageContent"
              @addComment="(text) => addToDo(text)"
              :text-bottom="
                typeModal === 'detail' && activities?.content
                  ? activities?.content?.editTime
                  : ''
              "
            >
              <template #label>
                {{ $t('workspace.channel.toDo') }} <span class="label-require">*</span>
              </template>
            </commentEditAble>
          </div>
          <div class="col-6">
            <CDateTimePicker
              :disable="typeModal === 'detail'"
              v-model="dueDate"
              :error-message="errors.due_at"
              label-slot
              :options="optionsFn"
              bottom-slots
              :rules="typeTask !== 'DRAFT' ? rulesDueDate : undefined"
            >
              <template #label>
                {{ $t('workspace.channel.dueDate') }} <span class="label-require">*</span>
              </template>
              <template
                v-if="typeModal === 'detail'"
                #counter
              >
                {{ activities?.due_at?.editTime || '' }}
              </template>
            </CDateTimePicker>
          </div>
          <div class="col-6">
            <div class="box-priority">
              <div>
                <q-icon
                  name="bi-bookmark-star"
                  size="14px"
                />
                <span class="text-body-regular box-priority-text">
                  {{ $t('workspace.channel.priority') }}
                  <span class="label-require">*</span>
                </span>
              </div>
              <div
                v-if="typeModal === 'detail'"
                class="block-priority box-priority-action"
              >
                <span
                  class="block-priority-selected block-priority__tag text-body"
                  :class="priority.type"
                >
                  {{ priority.label }}
                </span>
              </div>
              <q-btn-dropdown
                v-else
                :disabled="typeModal === 'detail'"
                dropdown-icon="bi-chevron-down"
                class="block-priority box-priority-action"
              >
                <template #label>
                  <span
                    class="block-priority-selected block-priority__tag text-body"
                    :class="priority.type"
                  >
                    {{ priority.label }}</span
                  >
                </template>
                <q-list class="block-priority">
                  <q-item
                    v-for="(item, index) in listPriority"
                    :key="index"
                    v-close-popup
                    clickable
                    @click="changePriority(item)"
                  >
                    <q-item-section>
                      <q-item-label
                        class="block-priority__tag text-body"
                        :class="item.type"
                      >
                        {{ item.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
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
                  :disabled="files.length === 5"
                  @click="handleUpload"
                />
                <div
                  :class="{
                    disabled: files.length === 5,
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
            v-else-if="files?.length > 0"
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
          <div class="box-detail-mark-done">
            <div class="box-detail-mark-done-text">
              <list-mark-task :list-mark="infoTask.marks">
                <template #markDone>
                  <span class="text-body-regular cursor-pointer">
                    {{
                      $t('workspace.channel.modalTaskChannel.peopleDone', {
                        count: count.done,
                      })
                    }}
                  </span>
                </template>
                <template #markCancel>
                  <span class="text-body-regular cursor-pointer">
                    {{
                      $t('workspace.channel.modalTaskChannel.peopleCancel', {
                        count: count.cancel,
                      })
                    }}
                  </span>
                </template>
              </list-mark-task>
            </div>

            <q-separator />
            <div
              class="box-detail-mark-done-action"
              :style="!infoTask?.can_mark ? 'opacity: 0.5' : ''"
            >
              <div>
                <q-checkbox
                  checked-icon="bi-check-circle-fill"
                  unchecked-icon="bi-check-circle"
                  :model-value="statusTask === 'DONE'"
                  color="primary"
                  class="mark-done-check-box"
                  :class="
                    !infoTask?.can_mark || statusTask === 'CANCEL' ? 'disabled' : ''
                  "
                  @click="toggleStatusTask('DONE')"
                />
                <span
                  :style="statusTask === 'DONE' ? 'color: #1C8C44' : ''"
                  :class="
                    !infoTask?.can_mark || statusTask === 'CANCEL' ? 'disabled' : ''
                  "
                >
                  {{ $t('workspace.channel.modalTaskChannel.markDone') }}</span
                >
              </div>

              <div>
                <q-checkbox
                  checked-icon="bi-x-circle-fill"
                  unchecked-icon="bi-x-circle"
                  :model-value="statusTask === 'CANCEL'"
                  class="mark-done-check-box"
                  :class="!infoTask?.can_mark || statusTask === 'DONE' ? 'disabled' : ''"
                  @click="toggleStatusTask('CANCEL')"
                />
                <span
                  :style="statusTask === 'CANCEL' ? 'color: #F44436' : ''"
                  :class="!infoTask?.can_mark || statusTask === 'DONE' ? 'disabled' : ''"
                  >{{ $t('workspace.channel.modalTaskChannel.markCancel') }}</span
                >
              </div>
            </div>
          </div>
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
              <div class="box-detail-comment-action-right text-body">
                <c-btn
                  @click="muteCommentTask"
                  :icon="!isMuteComment ? 'bi-bell-slash' : 'bi-bell'"
                  fontSizeIcon="16"
                  color="neutral"
                  flat
                  :label="
                    !isMuteComment
                      ? $t('workspace.channel.modalTaskChannel.muteComment')
                      : $t('workspace.channel.modalTaskChannel.unmuteComment')
                  "
                ></c-btn>
              </div>
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
                View {{ listComment.filter.total - listComment.data.length }} previous
                comments
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
      <template v-if="['add', 'forward'].includes(typeModal)">
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
      <template v-if="['edit'].includes(typeModal)">
        <c-btn
          color="primary"
          size="large"
          outline
          :label="$t('global.cancel')"
          :loading="loading"
          @click="closeModal"
        />
        <c-btn
          color="primary"
          size="large"
          :label="$t('global.save')"
          :loading="loading"
          @click="updateTask"
        />
      </template>
    </template>
  </CModal>
  <c-confirm
    v-model="IsShowPopup"
    :title="$t('workspace.task.popupCancel.title')"
    :sub-title="$t('workspace.task.popupCancel.desc')"
    :text-ok="$t('workspace.task.popupCancel.textAction')"
    :text-cancel="$t('global.no')"
    :loading="loadingPopup"
    @on-ok="cancelTask()"
    @close="closePopup()"
  />
  <modal-chose-schedules
    ref="refModalSchedules"
    v-model="isShowModalSchedules"
    @onOk="scheduleTask"
    @close="closeSchedulesModal"
    show-repeat
  />
  <ModalSelectFilesChannel
    v-model:default-files="files"
    :channel-id="channelName?.value"
    v-model="showModalFile"
  ></ModalSelectFilesChannel>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch, nextTick } from 'vue';
import { date } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NotifyServices from 'src/plugins/NotifyServices';
import { useChannelStore } from 'stores/channel';
import TaskService from 'src/services/task';
import CommentService from 'src/services/comment';
import { useMainStore } from 'stores/main';
import { useWorkspaceStore } from 'stores/workspace';
import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import commentEditAble from 'components/general/commentEditAble.vue';
import {
  formatDateToIosString,
  formatIosStringToDate,
  checkData,
  capitalizeFirstLetter,
  formatDateDisplay,
  optionsFn,
  scrollToId,
  focusToId,
  validate,
  resetValidation,
} from 'src/helper/global';
import { bodyLike, paramsComment } from 'src/services/comment/model';
import { formComment } from 'src/interface/comment';
import CardComment from 'components/common/CardComment.vue';
import ModalChoseSchedules from 'components/channel/modalChoseSchedules.vue';
import { formChannel } from 'src/interface/cardChannel';
import { ListStatusTask } from 'src/constants/ConstantTask';
import ListMarkTask from 'components/task/ListMarkTask.vue';
import { typeBodyRepeat } from 'src/services/task/model';
import ModalSelectFilesChannel from 'components/upfile/ModalSelectFilesChannel.vue';

const listPriority: Array<typePriority> = [
  {
    label: 'Medium',
    type: 'medium',
  },
  {
    label: 'Low',
    type: 'low',
  },
  {
    label: 'High',
    type: 'high',
  },
];

interface typePriority {
  label: string;
  type: string;
}

interface typeListComment {
  data: Array<formComment>;
  filter: any;
}

export default defineComponent({
  name: 'modalTaskChannel',
  components: {
    ListMarkTask,
    ModalChoseSchedules,
    CardComment,
    CardFileUpload,
    commentEditAble,
    ModalSelectFilesChannel,
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
      dueDate: string;
      priority: typePriority;
      files: any;
      typeTask: string;
      scheduled_at: string;
      repeatBody: typeBodyRepeat;
      errors: any;
      // add, forward, edit, detail
      typeModal: string;
      statusTask: string;
      count: any;
      infoTask?: any | null;
      activities?: any | null;
      IsShowPopup: boolean;
      loadingPopup: boolean;
      comment: any;
      listComment: typeListComment;
      isShowModalSchedules: boolean;
      isMuteComment: boolean;
      rulesName: Array<any>;
      rulesDueDate: Array<any>;
      errorMessageContent: string;
      showModalFile: boolean;
    }>({
      loading: false,
      channelName: '',
      name: infoUser.value,
      toDo: '',
      dueDate: '',
      showModalFile: false,
      priority: {
        label: 'High',
        type: 'high',
      },
      files: [],
      typeTask: 'IMMEDIATE',
      scheduled_at: '',
      repeatBody: {
        type: 'NONE',
        end_at: '',
      },
      errors: {
        content: '',
        due_at: '',
      },
      typeModal: 'add',
      statusTask: '',
      count: {
        done: 0,
        cancel: 0,
        comment: 0,
      },
      infoTask: null,
      IsShowPopup: false,
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
      rulesDueDate: [(val: string) => !!val || t('global.messages.required')],
      errorMessageContent: '',
    });
    const route = useRoute();
    const router = useRouter();
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
      const member = channelStore.listOneToOne.map((item: any) => {
        return {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.name}` || '',
          value: item.id || '',
          type: 'member',
        };
      });
      return [...channel, ...member];
    });
    // const options = ref()

    watch(infoUser, () => {
      state.name = infoUser.value;
    });

    const showModalGetFile = () => {
      state.channelName = {
        ...channelDetail.value,
        value: channelDetail.value?.id,
      };

      state.showModalFile = true;
    };
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
      let params: paramsComment = {
        task_id: state.infoTask?.id,
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

    const getCommentTask = (params: paramsComment) => {
      CommentService.getAllComment(params).then((res: any) => {
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
      let params: paramsComment = {
        task_id: state.infoTask?.id,
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
    const IsShowModalAddTask = computed(() => {
      return channelStore.IsShowModalAddTask;
    });

    const resetData = () => {
      resetValidation(myForm.value);
      state.errorMessageContent = '';
      state.loading = false;
      state.name = infoUser.value;
      state.channelName = '';
      state.toDo = '';
      state.dueDate = '';
      state.priority = {
        label: 'High',
        type: 'high',
      };
      state.repeatBody = {
        type: 'NONE',
        end_at: '',
      };
      state.files = [];
      state.typeModal = 'add';
      state.statusTask = '';
      state.count = {
        done: 0,
        cancel: 0,
        comment: 0,
      };
      router.replace({
        ...route,
        query: {
          ...route.query,
          taskId: undefined,
        },
      });
      refModalSchedules.value.closeModal();
    };

    const closeModal = () => {
      resetData();
      channelStore.showModalAddTask(false);
    };

    //
    const changePriority = (priority: typePriority) => {
      state.priority = priority;
    };
    const addToDo = (value: any) => {
      state.toDo = value;
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
        const activity = {} as any;
        listActivities.forEach((item: any) => {
          const action = item.description;
          if (item.type === 'EDIT') {
            const editTime = `${t('global.edited')} ${formatDateDisplay(
              item.created_at,
              'MMM DD,YYYY',
            )} at ${formatDateDisplay(item.created_at, 'h:mm A')}`;
            if (!activity['content'] && action['content']) {
              activity.content = {
                editTime: editTime,
              };
            }
            if (!activity['due_at'] && action['due_at']) {
              activity.due_at = {
                editTime: editTime,
              };
            }
          }
        });
        state.activities = {
          ...activity,
        };
      }
    };

    const markAsRead = (value: boolean, item?: formChannel) => {
      return new Promise((resolve, reject) => {
        TaskService.markReadTask({
          workspace_id: Number(route?.params?.workspaceId),
          channel_id: Number(route?.params?.channelId),
          task_ids: item?.id ? [item?.id] : [],
          is_read: value,
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

    const setInfoModal = async (itemId: any, type?: string) => {
      if (type === 'detail') {
        const checkRead = await markAsRead(true, {
          id: itemId,
        });
        if (!checkRead) return;
      }
      await TaskService.getDetailTask(`${itemId}`).then((res: any) => {
        if (res?.status_code === 200) {
          resetData();
          const info: any = res.data;
          state.typeModal = type || 'add';
          state.channelName = '';
          state.toDo = info.content || '';
          state.statusTask = info.status?.[0]?.type;
          state.infoTask = {
            ...info,
          };
          state.isMuteComment = info?.mute_comments?.[0]?.is_mute || false;
          getActivities(info.activities);

          getCount(info);
          state.count.comment = info.comment_count || 0;
          nextTick(() => {
            refContentEditAble.value.setTextContent(state.toDo);
          });
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
          state.priority = {
            label: capitalizeFirstLetter(info?.priority) || '',
            type: info?.priority.toLowerCase() || '',
          };
          state.files = info?.attachments.map((file: any) => {
            return {
              ...file,
              name: file?.originalname || '',
            };
          });
          if (type === 'detail') {
            findAllComment('ALL', t('workspace.channel.menuComment.allComment'));
          }
          channelStore.showModalAddTask(true);
          router.replace({
            ...route,
            query: {
              ...route.query,
              taskId: itemId || undefined,
            },
          });
        }
      });
    };

    const reloadInfoTask = () => {
      setInfoModal(state.infoTask.id, state.typeModal);
    };

    // add task
    const handleCreateTaskNow = () => {
      state.typeTask = 'IMMEDIATE';
      createTask();
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
      TaskService.createTask({
        channel_id:
          state.typeModal === 'forward'
            ? state.channelName.value
            : Number(route?.params?.channelId),
        content: state.toDo,
        due_at: formatDateToIosString(state.dueDate),
        priority: state.priority.type.toUpperCase(),
        attachment_ids: [...fileIds],
        type: state.typeTask,
        scheduled_at: state.scheduled_at || null,
        repeat:
          state.repeatBody.type !== 'NONE' && state.typeTask === 'SCHEDULE'
            ? state.repeatBody
            : undefined,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            if (state.typeModal === 'forward') {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.forwardTaskSuccess'),
              );
            } else {
              if (state.typeTask === 'IMMEDIATE') {
                NotifyServices.showMessageSuccess(
                  t('workspace.channel.notify.createTaskSuccess'),
                );
              }
              if (state.typeTask === 'DRAFT') {
                NotifyServices.showMessageSuccess(
                  t('workspace.channel.notify.createTaskDraft'),
                );
              }
              if (state.typeTask === 'SCHEDULE') {
                NotifyServices.showMessageSuccess(
                  t('workspace.channel.notify.createTaskSchedule'),
                );
                state.isShowModalSchedules = false;
              }
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
          if (state.typeModal === 'forward') {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.forwardTaskFailed'),
            );
          } else {
            NotifyServices.showMessageError(
              t('workspace.notify.channel.createTaskFailed'),
            );
          }
        })
        .finally(() => {
          state.loading = false;
          closeSchedulesModal();
        });
    };
    const saveTaskToDraft = () => {
      state.typeTask = 'DRAFT';
      createTask();
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
    const scheduleTask = (newDate: string, repeatBody: typeBodyRepeat) => {
      // const newDate = addToDate(new Date(), { days: 7 });
      state.typeTask = 'SCHEDULE';
      state.scheduled_at = formatDateToIosString(newDate);
      state.repeatBody = {
        ...repeatBody,
        end_at: formatDateToIosString(repeatBody.end_at),
      };
      createTask();
    };

    // update task
    const updateTask = async () => {
      const check = await validate(myForm.value);
      if (!state.toDo) {
        state.errorMessageContent = t('global.messages.required');
        return;
      }
      state.errorMessageContent = '';
      if (!check) return;
      state.loading = true;
      let fileIds = state.files.map((item: any) => item.id) || [];
      //typeModal === 'forward'
      TaskService.editTask(`${state.infoTask?.id}`, {
        content: state.toDo,
        due_at: formatDateToIosString(state.dueDate),
        priority: state.priority.type.toUpperCase(),
        attachment_ids: [...fileIds],
        type: state.typeTask,
        scheduled_at: state.scheduled_at || null,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.updateTaskSuccess'),
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
          NotifyServices.showMessageError(t('workspace.notify.channel.updateTaskFailed'));
        })
        .finally(() => {
          state.loading = false;
          closeSchedulesModal();
        });
    };

    const toggleStatusTask = (type: string) => {
      if (!state.infoTask?.can_mark) {
        return;
      }
      if (!state.statusTask || !['DONE', 'CANCEL'].includes(state.statusTask)) {
        if (type === 'DONE') {
          markDoneTask();
        }
        if (type === 'CANCEL') {
          showPopupCancel();
        }
      }
      if (state.statusTask === type) {
        unMarkTask();
      }
    };

    const unMarkTask = () => {
      state.loading = true;
      TaskService.unmarkTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        task_ids: [state.infoTask?.id],
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            emit('reload');
            mainStore.actionReloadSideBar();
            if (state.statusTask === 'DONE') {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.markUnDoneTaskSuccess'),
              );
              state.count.done -= 1;
            }
            if (state.statusTask === 'CANCEL') {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.markUnCancelTaskSuccess'),
              );
              state.count.cancel -= 1;
            }
            state.statusTask = '';
            reloadInfoTask();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          if (state.statusTask === 'DONE') {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.markUnDoneTaskFailed'),
            );
          }
          if (state.statusTask === 'CANCEL') {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.markUnCancelTaskFailed'),
            );
          }
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const markDoneTask = () => {
      state.loading = true;
      TaskService.markTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        task_ids: [state.infoTask?.id],
        type: 'DONE',
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.markDoneTaskSuccess'),
            );
            state.statusTask = 'DONE';
            state.count.done += 1;
            reloadInfoTask();
            // state.count.cancel -= 1
            mainStore.actionReloadSideBar();
            emit('reload');
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.channel.notify.markDoneTaskFailed'),
          );
        })
        .finally(() => {
          state.loading = false;
        });
    };
    const cancelTask = () => {
      TaskService.markTask({
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: Number(route?.params?.channelId),
        task_ids: [state.infoTask?.id],
        type: 'CANCEL',
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.markCancelTaskSuccess'),
            );
            state.statusTask = 'CANCEL';
            state.IsShowPopup = false;
            // state.count.done -= 1
            state.count.cancel += 1;
            reloadInfoTask();
            mainStore.actionReloadSideBar();
            emit('reload');
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(
            t('workspace.channel.notify.markCancelTaskFailed'),
          );
        });
    };
    const closePopup = () => {
      state.IsShowPopup = false;
    };
    const showPopupCancel = () => {
      state.IsShowPopup = true;
    };

    const addComment = (
      comment: string,
      files?: any,
      listTag?: any,
      item?: formComment,
    ) => {
      const filesId = files.map((item: any) => item.id);
      CommentService.createComment({
        task_id: state.infoTask?.id,
        comment_id: item?.id || null,
        content: comment,
        attachment_ids: [...filesId],
        mention_user_ids: listTag ? [...listTag] : null,
      }).then((res: any) => {
        if (res?.status_code === 200) {
          renderCommentEditAble.value += 1;
          findAllComment(state.comment.type, state.comment.label);
          emit('reload');
        }
      });
    };

    const actionLike = (item: formComment, emoji: any, isReact?: boolean) => {
      const body: bodyLike = {
        task_id: state.infoTask?.id,
        comment_id: item.id,
        emoji: emoji?.colons || ':like:',
      };
      if (!isReact) {
        CommentService.unlikeComment(body)
          .then((res: any) => {
            if (res?.status_code === 200) {
              findAllComment(state.comment.type, state.comment.label);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        CommentService.likeComment(body)
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
    const muteCommentTask = () => {
      channelStore
        .muteCommentTask(state.infoTask.id, !state.isMuteComment)
        .then(() => {
          if (state.isMuteComment) {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.unmuteCommentTaskSuccess'),
            );
          } else {
            NotifyServices.showMessageSuccess(
              t('workspace.channel.notify.muteCommentTaskSuccess'),
            );
          }
          state.isMuteComment = !state.isMuteComment;
          emit('reload');
        })
        .catch(() => {
          if (state.isMuteComment) {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.muteCommentTaskFailed'),
            );
          } else {
            NotifyServices.showMessageError(
              t('workspace.channel.notify.unmuteCommentTaskFailed'),
            );
          }
        });
    };
    // 2023-03-10T02:24:25.203Z
    const checkOwnerTask = computed(() => {
      return channelStore.checkOwnerTask(state?.infoTask?.creator?.id);
    });
    const permissionEdit = computed(() => {
      return channelStore.isOwner || checkOwnerTask.value;
    });

    const changeEditTask = () => {
      state.typeModal = 'edit';
    };

    return {
      ...toRefs(state),
      myForm,
      listPriority,
      channelDetail,
      refModalSchedules,
      infoUser,
      IsShowModalAddTask,
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
      changePriority,
      handleCreateTaskNow,
      saveTaskToDraft,
      checkData,
      addToDo,
      scheduleTask,
      optionsFn,
      setInfoModal,
      updateTask,
      markDoneTask,
      unMarkTask,
      cancelTask,
      closePopup,
      showPopupCancel,
      addComment,
      menuComment,
      actionLike,
      viewAllComment,
      showSchedulesModal,
      closeSchedulesModal,
      toggleStatusTask,
      formatDateDisplay,
      muteCommentTask,
      changeEditTask,
      permissionEdit,
      ListStatusTask,
      checkOwnerTask,
      showModalGetFile,
    };
  },
});
</script>

<style scoped lang="scss">
.block-priority-selected {
  padding: 4px 16px;
}

.box-priority {
  height: 56px;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;

  &-text {
    color: #565656;
    margin-left: 8px;
    margin-right: 16px;
  }

  &-action {
    padding: 0 8px;
    //min-height: 24px;
  }
}

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

.block-priority.ml-1 {
  margin-left: 8px;
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
  margin-left: 16px;

  i.q-icon {
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
