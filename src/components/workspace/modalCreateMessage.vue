<script lang="ts">
import { computed, defineComponent, nextTick, reactive, ref, toRefs } from 'vue';
import InputChat from 'components/chat/InputChat.vue';
import commentEditAble from 'components/general/commentEditAble.vue';
import CConfirm from 'components/common/CConfirm.vue';
import ModalPollVote from 'components/chat/ModalPollVote.vue';
import { useChannelStore } from 'stores/channel';
import { useWorkspaceStore } from 'stores/workspace';
import { resetValidation, validate } from 'src/helper/global';
import { checkContenteditable, checkMaxLengthTextDescTask } from 'src/helper/validForm';
import NotifyServices from 'src/plugins/NotifyServices';
import { actionSocket, socketChannel } from 'src/services/socket';
import ChatService from 'src/services/chat';
import { useMainStore } from 'stores/main';
import { useI18n } from 'vue-i18n';
import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
import { countDescTask } from 'src/constants/ConstantRules';
import { bodyCreateOneToOne } from 'src/services/channel/model';
import ChannelService from 'src/services/channel';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'modalCreateMessage',
  components: { ModalPollVote, CConfirm, commentEditAble, InputChat },
  props: {},
  emits: ['reload'],
  setup(props, { emit }) {
    const channelStore = useChannelStore();
    const workspaceStore = useWorkspaceStore();
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const { t } = useI18n();
    const route = useRoute();

    const refContentEditAble = ref();

    const state = reactive<{
      loading: boolean;
      selectedMember?: any;
      channelId?: string | number;
      toDo: string;
      files: any;
      mention?: any;
      renderEditor: number;
      search: string;
      errorMessageContent: string;
      showModalConfirm: boolean;
      infoModalConfirm: typeInfoModalConfirm;
      rulesName: Array<any>;
      disableSelected: boolean;
      errors: any;
    }>({
      loading: false,
      selectedMember: null,
      channelId: undefined,
      toDo: '',
      files: [],
      mention: undefined,
      renderEditor: 0,
      search: '',
      errorMessageContent: '',
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
      rulesName: [(val: string) => !!val || t('global.messages.required')],
      disableSelected: false,
      errors: null,
    });
    const IsShowModal = computed(() => {
      return workspaceStore.IsShowModalAddMessage;
    });
    const closeModal = () => {
      resetData();
      state.selectedMember = null;
      workspaceStore.IsShowModalAddMessage = false;
    };

    const createOneToOne = computed(() => {
      return workspaceStore.createOneToOne;
    });
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
          // disable: !permissionListChannel.value ,
        };
      });
      const member = channelStore.listOneToOne.map((item: any) => {
        return {
          ...item,
          img: item?.avatar?.url || '',
          label: `${item.name}` || '',
          value: item.id || '',
          type: 'member',
          // disable: !permissionListChannel.value ,
        };
      });
      return [...channel, ...member];
    });

    const myForm = ref();
    const resetData = () => {
      resetValidation(myForm.value);
      state.errorMessageContent = '';
      state.loading = false;
      state.toDo = '';
      state.renderEditor += 1;
      state.mention = undefined;
      state.files = [];
      disconnectActionSocket();
      workspaceStore.createOneToOne = false;
    };

    const socket = ref();
    const onConnect = () => {
      console.log('onConnect');
      console.log(socket.value);
      createChat();
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
      console.log('onNewMessage');
      NotifyServices.showMessageSuccess(t('workspace.chat.notify.createChatSuccess'));
      mainStore.actionReloadAllPage();
      emit('reload');
      closeModal();
    };
    const connectActionSocket = async () => {
      if (!state.channelId) return;
      socket.value = await socketChannel(state.channelId);
      if (socket.value) {
        socket.value.on(actionSocket['connect'], onConnect);
        socket.value.on(actionSocket['disconnect'], onDisconnect);
        socket.value.on(actionSocket['ERROR_MESSAGE'], onErrorMessage);
        socket.value.on(actionSocket['NEW_MESSAGE'], onNewMessage);
      }
    };
    const disconnectActionSocket = () => {
      if (socket.value) {
        state.channelId = undefined;
        socket.value.disconnect();
      }
    };

    const addMember = () => {
      state.loading = true;
      const memberIds = state.selectedMember.value;
      const body: bodyCreateOneToOne = {
        workspace_id: Number(route?.params?.workspaceId),
        user_id: memberIds,
      };
      return new Promise((resolve, reject) => {
        ChannelService.createChannelOneToOne(body)
          .then((res: any) => {
            if (res?.status_code === 200) {
              console.log(res.data.id);
              state.channelId = res.data.id;
              // mainStore.actionReloadAllPage()
              resolve(res);
            } else {
              NotifyServices.showMessageError(res?.errors.message);
              reject(false);
            }
          })
          .catch(() => {
            NotifyServices.showMessageError(t('workspace.notify.addMemberChannelFailed'));
            reject(false);
          });
      });
    };
    const createChat = async () => {
      state.loading = true;
      let fileIds = state.files.map((item: any) => item.id) || [];
      if (socket.value) {
        socket.value.emit(actionSocket['NEW_MESSAGE'], {
          channel_id: Number(state.channelId),
          content: state.toDo,
          attachment_ids: [...fileIds],
          mention_user_ids: state.mention || undefined,
        });
      } else {
        state.loading = false;
      }
    };
    const createNow = async () => {
      const check = await validate(myForm.value);
      if (!state.toDo) {
        state.errorMessageContent = t('global.messages.required');
        return;
      }
      state.errorMessageContent = '';
      if (!check) return;
      const res: any = await addMember();
      if (!res) return;
      await connectActionSocket();
    };

    const showVote = () => {
      channelStore.IsShowModalCreatePollVote = true;
    };

    const createPollVote = (body: any) => {
      ChatService.createPoll({
        ...body,
        channel_id: state.selectedMember?.value,
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
    const handleCreateTaskNow = () => {
      createNow();
    };

    const changeChannel = (val: any) => {
      if (val) {
        disconnectActionSocket();
      }
      state.selectedMember = { ...val };
      // resetData();
    };

    const addComment = (text: string, files?: any, mentions?: any) => {
      state.toDo = text;
      state.files = files || [];
      state.mention = mentions || undefined;
    };
    return {
      ...toRefs(state),
      myForm,
      IsShowModal,
      closeModal,
      handleCreateTaskNow,
      addContent,
      handleConvertTask,
      showVote,
      createPollVote,
      changeChannel,
      addComment,
      listChannel,
      filterMember,
      countDescTask,
    };
  },
});
</script>

<template>
  <CModal
    v-model="IsShowModal"
    classModal="modal-task-channel modal-invite "
    alignFooter="center"
    @close="closeModal"
  >
    <template #title>
      <div class="text-header">
        <div class="text-h4">
          <span class="text-header-title">
            {{ $t('workspace.channel.addMessage') }}
          </span>
        </div>
      </div>
    </template>
    <q-form
      @submit="handleCreateTaskNow"
      ref="myForm"
    >
      <div class="modal-invite-body">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <CSelect
              :model-value="selectedMember"
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
          <InputChat
            ref="refInputChat"
            :key="renderEditor"
            class="col-12"
            :key-content="`input-chat-modal`"
            :channel-id="selectedMember?.value"
            :errorMessage="errorMessageContent"
            type-channel="oneToOne"
            placeholder="Type your message here"
            @addComment="addComment"
            @showVote="showVote"
            show-action
          ></InputChat>
        </div>
      </div>
    </q-form>
    <template #footer>
      <c-btn
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
        hiddenTag
        :channel-id="selectedMember?.value"
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
  <ModalPollVote
    v-if="IsShowModal"
    @createPollVote="createPollVote"
  ></ModalPollVote>
</template>

<style scoped lang="scss"></style>
