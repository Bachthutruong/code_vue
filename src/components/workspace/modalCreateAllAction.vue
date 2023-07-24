<template>
  <CModal
    v-model="IsShowModalAddAllActionWs"
    classModal="modal-task-channel modal-invite "
    alignFooter="center"
    @close="closeModal"
    :show-footer="!!channelName?.value && !!selectedType"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">
            {{ $t('workspace.channel.addNew') }}
          </span>
        </div>
      </div>
    </template>
    <q-form
      @submit="handleCreateTaskNow"
      ref="myForm"
    >
      <div class="modal-invite-body">
        <!--        <template v-if="channelName?.value">-->
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <CSelect
              :model-value="channelName"
              :defaultOptions="listChannel"
              filterAction
              label-slot
              :rules="rulesName"
              :disable="disableSelected"
              :error="!!errors?.channel"
              :error-message="errors?.channel"
              outlined
              use-input
              hide-dropdown-icon
              popup-content-class="select-height selectedItem"
              :loading="false"
              @filter="filterMember"
              @update:model-value="changeChannel"
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
                    v-if="opt.type === 'oneToOne'"
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
          </div>
          <div
            v-if="channelName?.value"
            class="col-12 box-radio"
          >
            <q-radio
              v-for="item in options"
              :key="item.value"
              color="primary"
              :val="item.value"
              :label="item.label"
              :disable="item.disable"
              size="48px"
              v-model="selectedType"
              @update:model-value="changeOption"
            ></q-radio>
          </div>
          <template v-if="selectedType === 'task'">
            <div class="col-12 box-warning-edit-task">
              <q-icon
                name="bi-info-circle"
                color="negative"
                size="16px"
              ></q-icon>
              <span>{{ $t('workspace.channel.modalTaskChannel.warningEdit') }}</span>
            </div>

            <div class="col-12 task-comment-edit">
              <commentEditAble
                ref="refContentEditAble"
                labelSlot
                :channel-id="channelName?.value"
                :count="1500"
                :errorMessage="errorMessageContent"
                @addComment="(text) => addToDo(text)"
              >
                <template #label>
                  {{ $t('workspace.channel.toDo') }} <span class="label-require">*</span>
                </template>
              </commentEditAble>
            </div>
            <div class="col-6">
              <CDateTimePicker
                v-model="dueDate"
                :error-message="errors.due_at"
                label-slot
                :options="optionsFn"
                bottom-slots
                :rules="typeTask !== 'DRAFT' ? rulesName : undefined"
              >
                <template #label>
                  {{ $t('workspace.channel.dueDate') }}
                  <span class="label-require">*</span>
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
                  </span>
                </div>
                <q-btn-dropdown
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
          </template>
          <template v-if="selectedType === 'wiki'">
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
          </template>
        </div>
        <template v-if="channelName?.value && ['task', 'wiki'].includes(selectedType)">
          <div class="box-upload">
            <c-upload
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
                :is-download="false"
                :default-files="item"
                :show-remove-item="true"
                @removeFile="removeFile"
              />
            </div>
          </div>
        </template>
        <template v-if="selectedType === 'chat'">
          <InputChat
            ref="refInputChat"
            :key="renderEditor"
            class="col-12"
            :key-content="`input-chat-modal`"
            :channel-id="channelName?.value"
            :errorMessage="errorMessageContent"
            :type-channel="channelName?.type"
            placeholder="Type your message here"
            @addComment="addComment"
            @showVote="showVote"
            show-action
          ></InputChat>
        </template>
        <!--        </template>-->
      </div>
    </q-form>
    <template #footer>
      <c-btn
        v-if="selectedType !== 'chat'"
        size="large"
        color="neutral"
        flat
        :label="$t('workspace.channel.modalTaskChannel.saveToDraft')"
        :loading="loading"
        @click="saveTaskToDraft"
      />
      <c-btn
        v-if="selectedType !== 'chat'"
        color="primary"
        size="large"
        outline
        :label="$t('workspace.channel.modalTaskChannel.scheduleLater')"
        :loading="loading"
        @click="showSchedulesModal"
      />
      <c-btn
        v-if="selectedType === 'chat'"
        color="primary"
        size="large"
        outline
        :label="$t('workspace.channel.modalTaskChannel.convertTask')"
        :loading="loading"
        @click="handleConvertTask"
      />
      <c-btn
        color="primary"
        size="large"
        :label="$t('workspace.channel.modalTaskChannel.sendBtn')"
        :loading="loading"
        @click="handleCreateTaskNow"
      />
    </template>
  </CModal>
  <modal-chose-schedules
    ref="refModalSchedules"
    v-model="isShowModalSchedules"
    :show-repeat="selectedType === 'task'"
    @onOk="scheduleTask"
    @close="closeSchedulesModal"
  />

  <c-confirm
    v-model="showModalConfirm"
    :title="infoModalConfirm.title"
    :text-ok="infoModalConfirm.textOk"
    :text-cancel="infoModalConfirm.textCancel"
    :loading="loadingModal"
    :disabled="infoModalConfirm.disabled"
    :alignFooter="infoModalConfirm.alignFooter"
    @on-ok="infoModalConfirm.action"
  >
    <div>{{ infoModalConfirm.desc }}</div>
    <template
      v-if="infoModalConfirm.type === 'convert'"
      #body
    >
      <commentEditAble
        class="edit-content"
        ref="refContentEditAble"
        labelSlot
        isEdit
        :hiddenTag="channelName?.type === 'oneToOne'"
        :channel-id="channelName?.value"
        :count="countDescTask"
        maxHeight="calc(100vh - 400px)"
        @addComment="(text) => addContent(text)"
      >
        <template #label>
          {{ infoModalConfirm.label }}
        </template>
      </commentEditAble>
    </template>
  </c-confirm>
  <ModalSelectFilesChannel
    v-model:default-files="files"
    :channel-id="channelName?.value"
    v-model="showModalFile"
  ></ModalSelectFilesChannel>

  <ModalPollVote
    v-if="IsShowModalAddAllActionWs"
    @createPollVote="createPollVote"
  ></ModalPollVote>
</template>

<script lang="ts">
import { defineComponent, computed, ref, reactive, toRefs, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import NotifyServices from 'src/plugins/NotifyServices';
import { useChannelStore } from 'stores/channel';
import { useWorkspaceStore } from 'stores/workspace';
import TaskService from 'src/services/task';
import { useMainStore } from 'stores/main';
import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import commentEditAble from 'components/general/commentEditAble.vue';
import {
  formatDateToIosString,
  formatIosStringToDate,
  checkData,
  formatDateDisplay,
  optionsFn,
  validate,
  resetValidation,
} from 'src/helper/global';
import { checkContenteditable, checkMaxLengthTextDescTask } from 'src/helper/validForm';

import ModalChoseSchedules from 'components/channel/modalChoseSchedules.vue';
import CConfirm from 'components/common/CConfirm.vue';
import ModalSelectFilesChannel from 'components/upfile/ModalSelectFilesChannel.vue';
import WikiService from 'src/services/wiki';
import ChatService from 'src/services/chat';
import InputChat from 'components/chat/InputChat.vue';
import { actionSocket, socketChannel } from 'src/services/socket';
import ModalPollVote from 'components/chat/ModalPollVote.vue';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
import { countDescTask } from 'src/constants/ConstantRules';
import { IRoleChanel, roleChannel } from 'src/model/ChannelDetail';
import { ChannelRoleFiledName } from 'src/constants/ConstantChannelDetail';
import { typeBodyRepeat } from 'src/services/task/model';

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

const maxLengthDesc = 15000;
export default defineComponent({
  name: 'modalCreateAllAction',
  components: {
    ModalPollVote,
    InputChat,
    ModalSelectFilesChannel,
    CConfirm,
    ModalChoseSchedules,
    CardFileUpload,
    commentEditAble,
  },
  props: {},
  emits: ['reload'],
  setup(props, { emit }) {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const { t } = useI18n();

    const state = reactive<{
      loading: boolean;
      name: any;
      channelName?: any;
      toDo: string;
      topic: string;
      dueDate: string;
      priority: typePriority;
      files: any;
      mention?: any;
      typeTask: 'DRAFT' | 'SCHEDULE' | 'IMMEDIATE';
      scheduled_at: string;
      repeatBody: typeBodyRepeat;
      errors: any;
      // add, forward
      typeModal: string;
      isShowModalSchedules: boolean;
      rulesName: Array<any>;
      rulesDueDate: Array<any>;
      errorMessageContent: string;
      search: string;
      disableSelected: boolean;
      showModalConfirm: boolean;
      infoModalConfirm: typeInfoModalConfirm;

      showModalFile: boolean;
      loadingModal: boolean;
      selectedType: 'wiki' | 'chat' | 'task' | null;
      renderEditor: number;
    }>({
      loading: false,
      channelName: null,
      name: infoUser.value,
      toDo: '',
      topic: '',
      dueDate: '',
      priority: {
        label: 'High',
        type: 'high',
      },
      files: [],
      mention: undefined,
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
      isShowModalSchedules: false,
      showModalFile: false,
      rulesName: [(val: string) => !!val || t('global.messages.required')],
      rulesDueDate: [(val: string) => !!val || t('global.messages.required')],
      errorMessageContent: '',
      search: '',
      disableSelected: false,
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
      loadingModal: false,
      selectedType: null,
      renderEditor: 0,
    });
    const route = useRoute();
    const router = useRouter();
    const refModalSchedules = ref();
    const refContentEditAble = ref();
    const refCommentEditAble = ref();
    const renderCommentEditAble = ref(0);
    const disabledBtn = computed(() => {
      return ['toDo', 'dueDate', 'channelName'];
    });
    const channelStore = useChannelStore();
    const workspaceStore = useWorkspaceStore();

    const infoSendTask = computed(() => {
      return workspaceStore.infoSendTask;
    });
    const infoForwardTask = computed(() => {
      return workspaceStore.infoForwardTask;
    });
    const createOneToOne = computed(() => {
      return workspaceStore.createOneToOne;
    });
    const IsShowModalAddAllActionWs = computed(() => {
      return workspaceStore.IsShowModalAddAllActionWs;
    });

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
          // disable: !permissionListChannel.value ,
        };
      });
      const member = channelStore.listOneToOne.map((item: any) => {
        return {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.name}` || '',
          value: item.id || '',
          type: 'oneToOne',
          // disable: !permissionListChannel.value ,
        };
      });
      return [...channel, ...member];
    });
    // const options = ref()
    const filterMember = (val: string, update?: any) => {
      // if (val === '') {
      //   update(() => {
      //     state.search = '';
      //   });
      //   return;
      // }
      update(() => {
        state.search = val || '';
      });
    };
    watch(infoUser, () => {
      state.name = infoUser.value;
    });

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

    //

    const resetData = () => {
      resetValidation(myForm.value);
      state.errorMessageContent = '';
      state.loading = false;
      state.name = infoUser.value;
      state.typeModal = 'add';
      state.toDo = '';
      state.topic = '';
      state.mention = undefined;
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
      workspaceStore.createOneToOne = false;
      workspaceStore.infoSendTask = null;
      workspaceStore.infoForwardTask = null;
      refModalSchedules.value.closeModal();
      if (state.selectedType === 'chat') {
        disconnectActionSocket();
      }
    };

    const closeModal = () => {
      resetData();
      state.channelName = null;
      state.selectedType = null;
      workspaceStore.IsShowModalAddAllActionWs = false;
    };

    //
    const changePriority = (priority: typePriority) => {
      state.priority = priority;
    };
    const addToDo = (value: any) => {
      if (state.selectedType === 'wiki') {
        if (checkContenteditable(value) <= maxLengthDesc) {
          state.toDo = value;
        } else {
          state.renderEditor += 1;
        }
      } else {
        state.toDo = value;
        if (value) state.errorMessageContent = '';
      }
    };
    const myForm = ref();
    // add task
    const handleCreateTaskNow = () => {
      state.typeTask = 'IMMEDIATE';
      createNow();
    };
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
      TaskService[createOneToOne.value ? 'createTaskOneToOne' : 'createTask']({
        [createOneToOne.value ? 'user_id' : 'channel_id']: state.channelName.value,
        workspace_id: createOneToOne.value ? Number(route.params.workspaceId) : undefined,
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
            if (state.typeTask === 'IMMEDIATE') {
              NotifyServices.showMessageSuccess(
                t('workspace.channel.notify.createTaskSuccess'),
              );
              if (state.typeModal === 'forward') {
                router.push({
                  name:
                    state.channelName.type === 'channel'
                      ? 'channel-task'
                      : 'one-to-one-task',
                  params: {
                    channelId: state.channelName.id,
                  },
                });
              }
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
            mainStore.actionReloadAllPage();
            emit('reload');
            closeModal();
          } else if (res?.status_code === 400) {
            state.errors = res.errors;
            if (res?.errors?.message) {
              NotifyServices.showMessageError(res?.errors.message);
            }
          } else if (res?.status_code === 406) {
            state.showModalConfirm = true;
            state.infoModalConfirm = {
              type: 'confirm',
              title: t('workspace.channel.modalPermission.title'),
              textOk: t('global.ok'),
              textCancel: '',
              alignFooter: 'right',
              desc: t('workspace.channel.modalPermission.desc'),
              disabled: false,
              action: () => {
                closeModalConfirm();
              },
            };
            state.errors = {
              ...state.errors,
              channel: res?.errors.message,
            };
            // if (res?.errors?.message) {
            //   NotifyServices.showMessageError(res?.errors.message);
            // }
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch((err) => {
          console.log(err);
          NotifyServices.showMessageError(t('workspace.notify.channel.createTaskFailed'));
        })
        .finally(() => {
          state.loading = false;
          closeSchedulesModal();
        });
    };
    const saveTaskToDraft = () => {
      state.typeTask = 'DRAFT';
      createNow();
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
    const scheduleTask = (newDate: string, repeatBody?: typeBodyRepeat) => {
      // const newDate = addToDate(new Date(), { days: 7 });
      state.typeTask = 'SCHEDULE';
      state.scheduled_at = formatDateToIosString(newDate);
      if (repeatBody) {
        state.repeatBody = {
          ...repeatBody,
          end_at: formatDateToIosString(repeatBody.end_at),
        };
      }
      createNow();
    };

    const closeModalConfirm = () => {
      state.showModalConfirm = false;
    };

    const showModalGetFile = () => {
      state.showModalFile = true;
    };

    //  wiki
    const createWiki = async () => {
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
        channel_id: Number(state.channelName?.value),
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
            mainStore.actionReloadAllPage();
            if (
              channelDetail.value &&
              Number(state.channelName?.value) === Number(channelDetail.value?.id)
            ) {
              channelStore.actionReloadPageWiki();
            }
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

    //  chat
    const socket = ref();
    // const socket = computed(() => {
    //   return socketChannel(state.channelName?.value)
    // });
    const onConnect = () => {
      console.log('onConnect');
    };
    const onDisconnect = () => {
      console.log('onDisconnect');
    };
    const onErrorMessage = (error: any) => {
      console.log('onErrorMessage', error);
      if (error?.user_id !== infoUser.value?.id) return;
      NotifyServices.showMessageError(`${error.message}`);
      state.loading = false;
    };
    const onNewMessage = () => {
      NotifyServices.showMessageSuccess(t('workspace.chat.notify.createChatSuccess'));
      mainStore.actionReloadAllPage();
      emit('reload');
      closeModal();
    };
    const connectActionSocket = async () => {
      socket.value = await socketChannel(state.channelName?.value);
      if (socket.value) {
        socket.value.on(actionSocket['connect'], onConnect);
        socket.value.on(actionSocket['disconnect'], onDisconnect);
        socket.value.on(actionSocket['ERROR_MESSAGE'], onErrorMessage);
        socket.value.on(actionSocket['NEW_MESSAGE'], onNewMessage);
      }
    };
    const disconnectActionSocket = () => {
      if (socket.value) {
        socket.value.disconnect();
      }
    };
    const createChat = async () => {
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
      if (socket.value) {
        socket.value.emit(actionSocket['NEW_MESSAGE'], {
          channel_id: Number(state.channelName?.value),
          content: state.toDo,
          attachment_ids: [...fileIds],
          mention_user_ids: state.mention || undefined,
        });
      } else {
        state.loading = false;
      }
    };

    const createNow = () => {
      if (state.selectedType === 'task') {
        createTask();
      }
      if (state.selectedType === 'wiki') {
        createWiki();
      }
      if (state.selectedType === 'chat') {
        createChat();
      }
    };

    const permissionChannel = computed<IRoleChanel>(() => {
      const roles = state.channelName?.roles as Array<roleChannel>;
      let permission = {} as IRoleChanel;
      roles?.forEach((item: roleChannel) => {
        // @ts-ignore
        permission[ChannelRoleFiledName[item.name]] = item;
      });
      return permission;
    });

    const options = computed(() => {
      if (!state.channelName) return [];
      const typeList = [
        {
          label: 'Chat',
          value: 'chat',
          disable:
            state.channelName?.type === 'channel' && !permissionChannel.value?.creatChat,
        },
        {
          label: 'Task',
          value: 'task',
          disable:
            state.channelName?.type === 'channel' && !permissionChannel.value?.createTask,
        },
      ];
      if (state.channelName.type === 'channel') {
        typeList.push({
          label: 'Wiki',
          value: 'wiki',
          disable: !permissionChannel.value?.createWiki,
        });
      }
      return typeList;
    });

    const changeOption = () => {
      resetData();
      if (state.selectedType === 'chat') {
        console.log('changeOption');
        connectActionSocket();
      }
    };
    const changeChannel = (val: any) => {
      // if (state?.channelName?.type !== val?.type) {
      //   resetData();
      //   state.selectedType = null;
      // }
      if (val) {
        if (state.selectedType === 'chat') {
          disconnectActionSocket();
        }
      }
      state.channelName = { ...val };
      if (state.selectedType === 'chat') {
        connectActionSocket();
      }
      resetData();
      state.selectedType = null;
    };

    const addComment = (text: string, files?: any, mentions?: any) => {
      state.toDo = text;
      state.files = files || [];
      state.mention = mentions || undefined;
    };
    const showVote = () => {
      channelStore.IsShowModalCreatePollVote = true;
    };

    const createPollVote = (body: any) => {
      ChatService.createPoll({
        ...body,
        channel_id: state.channelName?.value,
      })
        .then((res: any) => {
          if (res?.status_code === 200) {
            NotifyServices.showMessageSuccess(
              t('workspace.chat.notify.createPollVoteSuccess'),
            );
            mainStore.actionReloadAllPage();
            channelStore.actionReloadPageChat();
            emit('reload');
            closeModal();
          } else {
            NotifyServices.showMessageError(res?.errors.message);
          }
        })
        .catch(() => {
          NotifyServices.showMessageError(
            t('workspace.chat.notify.createPollVoteFailed'),
          );
        });
    };

    const handleConvertTask = () => {
      if (!state.toDo && state.files.length === 0) {
        return;
      }
      workspaceStore.infoForwardTask = {
        channel: channelStore.detailChanel,
        text: state.toDo,
        files: state.files,
      };
      if (checkMaxLengthTextDescTask(state.toDo)) {
        workspaceStore.IsShowModalAddTaskWs = true;
      } else {
        state.showModalConfirm = true;
        state.infoModalConfirm = {
          type: 'convert',
          title: t('workspace.chat.modalEditContent.title'),
          textOk: t('workspace.chat.modalEditContent.textOk'),
          textCancel: t('global.cancel'),
          alignFooter: 'center',
          desc: t('workspace.chat.modalEditContent.desc'),
          label: t('workspace.chat.modalEditContent.label'),
          disabled: true,
          action: () => {
            workspaceStore.IsShowModalAddTaskWs = true;
            state.showModalConfirm = false;
          },
        };
        nextTick(() => {
          refContentEditAble.value.setTextContent(state.toDo);
        });
      }
    };
    const addContent = (text: string) => {
      if (checkMaxLengthTextDescTask(text)) {
        workspaceStore.infoForwardTask.text = text;
        state.infoModalConfirm.disabled = false;
      }
    };
    return {
      state,
      ...toRefs(state),
      myForm,
      listPriority,
      channelDetail,
      refModalSchedules,
      infoUser,
      IsShowModalAddAllActionWs,
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
      formatDateToIosString,
      formatIosStringToDate,
      changePriority,
      handleCreateTaskNow,
      saveTaskToDraft,
      checkData,
      addToDo,
      scheduleTask,
      optionsFn,
      showSchedulesModal,
      closeSchedulesModal,
      formatDateDisplay,
      filterMember,
      closeModalConfirm,
      showModalGetFile,
      options,
      changeOption,
      checkContenteditable,
      maxLengthDesc,
      changeChannel,
      addComment,
      showVote,
      createPollVote,
      handleConvertTask,
      countDescTask,
      addContent,
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

.box-radio {
  padding-top: 0;

  :deep(.q-radio) {
    margin-right: 60px;

    .q-radio__label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #2f2f2f;
    }
  }
}
</style>
