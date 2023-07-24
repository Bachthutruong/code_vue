<template>
  <CModal
    v-model="IsShowModalAddTask"
    classModal="modal-task-channel modal-invite "
    alignFooter="center"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">
            {{
              typeModal === 'add'
                ? $t('workspace.channel.addTask')
                : $t('workspace.channel.convertToTask')
            }}
          </span>
          <div class="box-warning-edit-task">
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
      @submit="handleCreateTaskNow"
      ref="myForm"
    >
      <div class="modal-invite-body">
        <div class="row q-col-gutter-lg">
          <div class="col">
            <CSelect
              v-model="channelName"
              :defaultOptions="listChannel"
              filterAction
              label-slot
              :rules="rulesName"
              :disable="disableSelected"
              :error="!!errors?.channel"
              :error-message="errors.channel"
              outlined
              use-input
              hide-dropdown-icon
              popup-content-class="select-height selectedItem"
              :loading="false"
              @filter="filterMember"
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
              :rules="typeTask !== 'DRAFT' ? rulesDueDate : undefined"
            >
              <template #label>
                {{ $t('workspace.channel.dueDate') }} <span class="label-require">*</span>
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
        </div>
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
      </div>
    </q-form>
    <template #footer>
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
  </CModal>
  <modal-chose-schedules
    ref="refModalSchedules"
    v-model="isShowModalSchedules"
    @onOk="scheduleTask"
    @close="closeSchedulesModal"
  />
  <c-confirm
    v-model="showModalConfirm"
    :title="$t('workspace.channel.modalPermission.title')"
    :text-ok="$t('global.ok')"
    text-cancel=""
    @on-ok="closeModalConfirm"
  >
    <div>{{ $t('workspace.channel.modalPermission.desc') }}</div>
  </c-confirm>
  <ModalSelectFilesChannel
    v-model:default-files="files"
    :channel-id="channelName?.value"
    v-model="showModalFile"
  ></ModalSelectFilesChannel>
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
import ModalChoseSchedules from 'components/channel/modalChoseSchedules.vue';
import CConfirm from 'components/common/CConfirm.vue';
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

export default defineComponent({
  name: 'modalCreateTask',
  components: {
    CConfirm,
    ModalChoseSchedules,
    CardFileUpload,
    commentEditAble,
    ModalSelectFilesChannel,
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
      dueDate: string;
      priority: typePriority;
      files: any;
      typeTask: string;
      scheduled_at: string;
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
      loadingModal: boolean;
      showModalFile: boolean;
    }>({
      loading: false,
      channelName: '',
      name: infoUser.value,
      showModalFile: false,
      toDo: '',
      dueDate: '',
      priority: {
        label: 'High',
        type: 'high',
      },
      files: [],
      typeTask: 'IMMEDIATE',
      scheduled_at: '',
      errors: {
        content: '',
        due_at: '',
      },
      typeModal: 'add',
      isShowModalSchedules: false,
      rulesName: [(val: string) => !!val || t('global.messages.required')],
      rulesDueDate: [(val: string) => !!val || t('global.messages.required')],
      errorMessageContent: '',
      search: '',
      disableSelected: false,
      showModalConfirm: false,
      loadingModal: false,
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
    const IsShowModalAddTask = computed(() => {
      return workspaceStore.IsShowModalAddTaskWs;
    });

    const setDefaultChannelSelected = () => {
      state.disableSelected = infoSendTask.value && createOneToOne.value;
      if (infoSendTask.value && createOneToOne.value) {
        const item = infoSendTask.value;
        state.channelName = {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.full_name}` || `${item.email}` || '',
          value: item.id || '',
          type: 'member',
        };
      }
    };
    const setDefaultTask = () => {
      if (infoForwardTask.value) {
        const channel = infoForwardTask.value.channel;
        state.channelName = {
          ...channel,
          img: channel?.avatar?.url || '',
          label:
            `${['ONE_TO_ONE'].includes(channel.type) ? '#' : ''}${channel.name}` || '',
          value: channel.id || '',
          type: ['ONE_TO_ONE'].includes(channel.type) ? 'member' : 'channel',
        };
        state.typeModal = 'forward';
        state.toDo = infoForwardTask.value.text || '';
        nextTick(() => {
          refContentEditAble.value.setTextContent(state.toDo);
        });
        state.files = infoForwardTask.value?.files || [];
      }
    };
    watch(IsShowModalAddTask, () => {
      setDefaultChannelSelected();
      setDefaultTask();
    });
    const channelDetail = computed(() => {
      return channelStore.detailChanel;
    });

    const listChannel = computed(() => {
      if (createOneToOne.value) {
        let member = workspaceStore.listMemberWorkspace.map((item: any) => {
          return {
            ...item,
            img: item?.avatar?.url || '',
            label: `${item.full_name}` || `${item.email}` || '',
            value: item.id || '',
            type: 'member',
          };
        });
        const needle = state.search.toLowerCase();
        member = member.filter((v: any) => {
          return (
            v.email.toLowerCase().indexOf(needle) > -1 ||
            v.full_name.toLowerCase().indexOf(needle) > -1
          );
        });
        return member;
      }
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
    const filterMember = (val: string, update?: any) => {
      if (val === '') {
        update(() => {
          state.search = '';
        });
        return;
      }
      update(() => {
        state.search = val;
      });
    };
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
      state.channelName = '';
      state.typeModal = 'add';
      state.toDo = '';
      state.dueDate = '';
      state.priority = {
        label: 'High',
        type: 'high',
      };
      state.files = [];
      workspaceStore.createOneToOne = false;
      workspaceStore.infoSendTask = null;
      workspaceStore.infoForwardTask = null;
      refModalSchedules.value.closeModal();
    };

    const closeModal = () => {
      resetData();
      workspaceStore.showModalAddTask(false);
    };

    //
    const changePriority = (priority: typePriority) => {
      state.priority = priority;
    };
    const addToDo = (value: any) => {
      state.toDo = value;
      if (value) state.errorMessageContent = '';
    };
    const myForm = ref();
    // add task
    const handleCreateTaskNow = () => {
      state.typeTask = 'IMMEDIATE';
      createTask();
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
    const scheduleTask = (newDate: string) => {
      // const newDate = addToDate(new Date(), { days: 7 });
      state.typeTask = 'SCHEDULE';
      state.scheduled_at = formatDateToIosString(newDate);
      createTask();
    };

    const closeModalConfirm = () => {
      state.showModalConfirm = false;
    };
    return {
      state,
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
</style>
