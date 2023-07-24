<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  toRaw,
} from 'vue';
import { nextTick } from '@vue/runtime-core';
import noData from 'components/general/noData.vue';
import {
  checkDue,
  checkScrollShow,
  formatDateDisplay,
  scrollToBottom,
  scrollToBottomId,
  scrollToId,
  showElement,
  sortByCreateTime,
} from 'src/helper/global';
import {
  answerItem,
  formChat,
  FormFile,
  reply,
  TypePollVote,
  votedItem,
} from 'src/interface/chat';
import { BodyCreateChat, ParamsChat, ParamsChatV2 } from 'src/services/chat/model';
import { useMainStore } from 'stores/main';
import { useRoute, useRouter, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ChatService from 'src/services/chat';
import NotifyServices from 'src/plugins/NotifyServices';
import InputChat from 'components/chat/InputChat.vue';
import { useChannelStore } from 'stores/channel';
import { actionSocket, socketChannel } from 'src/services/socket';
import ModalForwardChat from 'components/chat/ModalForwardChat.vue';
import { useWorkspaceStore } from 'stores/workspace';
import {
  checkMaxLengthTextDescTask,
  convertHtmlToText,
  copyDataToClipboard,
} from 'src/helper/validForm';
import commentEditAble from 'components/general/commentEditAble.vue';
import { countDescTask } from 'src/constants/ConstantRules';
import ScrollPage from 'components/general/scrollPage.vue';
import ModalPollVote from 'components/chat/ModalPollVote.vue';
import CardVote from 'components/chat/CardVote.vue';
import ModalVoteChat from 'components/chat/ModalVoteChat.vue';
import CardChat from 'components/chat/CardChat.vue';
import showDateTask from 'components/common/showDateTask.vue';
import TitlePin from 'components/chat/TitlePin.vue';

import { typeInfoModalConfirm } from 'src/constants/ConstantModal';
import WelcomeChannel from 'components/general/WelcomeChannel.vue';
import AddOrRemoveMember from 'components/common/addOrRemoveMember.vue';
import { extend } from 'quasar';
import * as _ from 'lodash';
import TabFixedChannel from 'components/channel/TabFixedChannel.vue';

interface activeNewItem {
  infoNewMessage: formChat;
  time: string;
}

export default defineComponent({
  name: 'chatPage',
  components: {
    TabFixedChannel,
    AddOrRemoveMember,
    WelcomeChannel,
    ModalVoteChat,
    CardVote,
    ModalPollVote,
    ScrollPage,
    TitlePin,
    commentEditAble,
    ModalForwardChat,
    InputChat,
    showDateTask,
    CardChat,
    noData,
  },
  setup() {
    const mainStore = useMainStore();
    const infoUser = computed(() => {
      return mainStore.getUser;
    });
    const channelStore = useChannelStore();
    const workspaceStore = useWorkspaceStore();

    const getRolePermissionChannel = computed(() => {
      return channelStore.getRolePermissionChannel;
    });

    const isPageActive = computed(() => mainStore.isPageActive);

    const typeIsOneToOne = computed(() => channelStore.typeIsOneToOne);

    const permissionCreateChat = computed(
      () =>
        // true
        typeIsOneToOne.value || !!getRolePermissionChannel.value?.['creatChat'] || false,
    );

    const channelOwned = computed(
      () => channelStore.isOwner,
      // true
    );
    const workspaceRoleAdmin = computed(
      () => workspaceStore.workspaceRoleAdmin,
      // true
    );
    const workspaceRoleOwner = computed(
      () => workspaceStore.workspaceRoleOwner,
      // true
    );
    const permissionEditAndRemoveChat = computed(
      () =>
        // true
        (!typeIsOneToOne.value &&
          (channelOwned.value || workspaceRoleAdmin.value || workspaceRoleOwner.value)) ||
        false,
    );
    const permissionPinChat = computed(
      () =>
        // true
        typeIsOneToOne.value || !!getRolePermissionChannel.value?.['pinChat'] || false,
    );

    const channelId = computed<number>(() => {
      return Number(route?.params?.channelId);
    });

    const isShowPin = computed(() => channelStore.isShowPin);
    const channelDetail = computed(() => channelStore.detailChanel);

    // const permissionCreateTask = computed(() =>  !!getRolePermissionChannel.value?.["createTask"] || false)
    // const permissionPinTask = computed(() =>  !!getRolePermissionChannel.value?.["pinTask"] || false)
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();

    const state = reactive<{
      loading: boolean;
      filter: ParamsChatV2;
      total: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      totalActivity: number;
      totalActivityPoll: number;
      renderOnLoad: number;
      renderInput: number;
      totalCountDate: number;
      renderList: number;
      bodyReply?: formChat;
      typeActionChat: 'edit' | 'reply' | '';
      listMessage: Array<formChat>;
      listMessageDefault: any;
      listMessagePinDefault: any;
      channelId: number;
      showModalConfirm: boolean;
      loadingModal: boolean;
      infoModalConfirm: typeInfoModalConfirm;
      selectedChat?: formChat;
      listForwardChat: Array<string | number>;
      connected: boolean;
      activeNewItem: activeNewItem | null;
      activeNewDate: any;
      objectGroupDateTime: any;
      activeScroll: boolean;
    }>({
      loading: false,
      filter: {
        workspace_id: '',
        channel_id: '',
        page_size: 20,
        around: undefined,
        before: undefined,
        after: undefined,
      },
      total: 0,
      hasNextPage: false,
      hasPreviousPage: true,
      totalActivity: 0,
      totalActivityPoll: 0,
      renderOnLoad: 0,
      renderInput: 0,
      totalCountDate: 0,
      renderList: 0,
      bodyReply: undefined,
      typeActionChat: '',
      listMessage: [],
      listMessageDefault: [],
      listMessagePinDefault: [],
      channelId: channelId.value,
      showModalConfirm: false,
      loadingModal: false,
      infoModalConfirm: {
        type: 'confirm',
        title: '',
        textOk: '',
        textCancel: '',
        alignFooter: '',
        desc: '',
        disabled: false,
      },
      selectedChat: undefined,
      listForwardChat: [],
      connected: false,
      activeNewItem: null,
      activeNewDate: null,
      objectGroupDateTime: [],
      activeScroll: false,
    });
    const resetPage = () => {
      state.renderInput += 1;
      state.renderOnLoad = 0;
      state.filter = {
        workspace_id: '',
        channel_id: '',
        page_size: 20,
        around: undefined,
        before: undefined,
        after: undefined,
      };
      channelStore.isShowPin = false;
      channelStore.totalPin = 0;
      // channelStore.totalCountUnReadChat = 0;
      state.activeNewItem = null;
      state.activeNewDate = null;
      state.activeScroll = false;
      state.objectGroupDateTime = [];
      state.listMessage = [];
    };
    const totalCountUnReadChat = computed(() => {
      return channelStore.totalCountUnReadChat;
    });
    const scrollTargetRef = ref();
    const scrollTargetPageRef = ref();
    const refInputChat = ref();
    const refContentEditAble = ref();
    const focusInput = () => {
      nextTick(() => {
        refInputChat.value?.setFocus();
        // scrollToBottomId('inputChat')
      });
    };
    const refModalVote = ref();

    const setVote = (answers: Array<answerItem>, votes: Array<votedItem>) => {
      const result = answers.map((item: answerItem) => {
        let checkVoteItem = votes.find(
          (voteItem: votedItem) =>
            voteItem.answer.id === item.id && voteItem.user?.id === infoUser.value?.id,
        );
        return {
          ...item,
          voted: !!checkVoteItem,
        };
      }) as Array<answerItem>;
      return result;
    };
    const groupDateTime = (data: any, dataTask: formChat) => {
      const formatDate = 'YYYY-MM-DD';
      const sentAt = dataTask?.other?.sent_at;
      const time = formatDateDisplay(sentAt, formatDate);
      let result = { ...data } as any;
      let dateItem = {
        type: 'dateTime',
        time: formatDateDisplay(time, 'MMM Do, YYYY'),
        id: time,
        // sentAt,
      } as any;
      if (!result[time]) {
        if (
          !dataTask.readChat &&
          !state.activeNewItem &&
          !state.objectGroupDateTime.includes(time)
        ) {
          state.activeNewDate = time;
        }
        result[time] = [dateItem, dataTask];
      } else {
        result[time] = [dateItem, ...result?.[time].slice(1), dataTask];
      }

      if (!dataTask.readChat && !state.activeNewItem) {
        state.activeNewItem = {
          time: sentAt,
          infoNewMessage: dataTask,
        };
      }
      return result;
    };

    const refactorItem = (item: any) => {
      if (item?.is_activity) {
        let dataTask: formChat = {
          ...item,
          other: item,
          // pinChat: true,
          isActivity: true,
          readChat: true,
        };
        if (item.is_poll) {
          dataTask = {
            ...dataTask,
            type: 'pollVote',
            typePoll: item.type,
          };
          return dataTask;
        }
        if (item.type === 'JOIN') {
          dataTask = {
            ...dataTask,
            type: 'JOIN',
          };
          dataTask.other.user = {
            full_name: channelDetail.value?.name || '',
            email: '',
          };
          return dataTask;
        }
        dataTask = {
          ...dataTask,
          type: 'pinTask',
        };
        return dataTask;
      } else {
        const user = item?.sender;
        const typeChat = user?.id === infoUser?.value?.id ? 'sent' : 'received';
        // const reply =
        let dataTask: formChat = {
          id: item.id,
          user: {
            id: user?.id,
            name: user?.full_name || user?.email,
            avatar: user?.avatar?.url || '',
          },
          chat: {
            typeChat: typeChat,
            statusChat: 'normal',
            time: item?.sent_at || '',
            text: item?.content || '',
            readAll: item?.read_count === item?.member_count,
          },
          files: item.attachments || undefined,
          pinChat: item?.is_pin || false,
          readChat: item?.reads?.[0]?.is_read || false,
          editChat: !!item?.edit_at || undefined,
          deleteChat: {
            isDeleted: !!item?.hide_at,
            user: {
              id: item?.hider?.id,
              name: item?.hider?.full_name || item?.hider?.email || '',
              avatar: '',
            },
            time: item?.hide_at || '',
          },
          other: item,
          type: item.is_poll ? 'pollVote' : 'message',
          isPoll: !!item.is_poll,
          reactions: item?.reactions || undefined,
        };
        dataTask.reactions = getListReact(dataTask);

        if (dataTask.editChat) {
          dataTask.editor = {
            id: item.editor.id,
            name: item.editor?.full_name || item.editor?.email || '',
          };
        }
        if (item?.parent?.id) {
          const parent = item?.parent;
          const parentUser = item?.parent?.sender;
          const replyItem: reply = {
            id: parent.id,
            files: parent.attachments,
            user: {
              id: parentUser?.id,
              name: parentUser?.full_name || parentUser?.email,
              avatar: parentUser?.avatar?.url || '',
            },
            text: parent.content,
            other: parent,
          };
          dataTask.reply = replyItem;
          dataTask.chat.statusChat = 'reply';
        }
        if (item?.forward_from?.id) {
          const parent = item?.forward_from;
          const parentUser = parent?.sender;
          const replyItem: reply = {
            id: parent.id,
            files: parent.attachments,
            user: {
              id: parentUser?.id,
              name: parentUser?.full_name || parentUser?.email,
              avatar: parentUser?.avatar?.url || '',
            },
            text: parent.content,
            other: parent,
          };
          dataTask.reply = replyItem;
          dataTask.chat.statusChat = 'forward';
        }
        if (dataTask?.isPoll) {
          dataTask.typePoll = item.type;
          dataTask.pollVote = {
            id: item.id || '',
            title: item.title || '',
            answers: setVote(item?.answers, item.votes) || [],
            votes:
              item?.votes.filter(
                (voteItem: votedItem) => voteItem.user?.id === infoUser.value?.id,
              ) || [],
            memberCount: item?.member_vote_count || 0,
            multiSelected: item.is_multi_select || false,
            closePoll: item.due_at && checkDue(item.due_at, 'second') <= 0,
            dueDate: item.due_at,
          };
        }
        dataTask.menu = getMenu(dataTask);

        //
        return dataTask;
      }
    };

    const copyText = (text: string) => {
      copyDataToClipboard(convertHtmlToText(`${text}`))
        .then(() => {
          NotifyServices.showMessageSuccess(t('workspace.chat.notify.copyText'));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const getMenu = (item: formChat) => {
      if (item?.deleteChat?.isDeleted) {
        return [];
      }
      const menu = [
        {
          icon: 'bi-card-list',
          key: 'convertToTask',
          title: t('workspace.chat.menuAction.convertToTask'),
          show: item?.chat.statusChat !== 'forward',
          action: () => handleConvertTask(item.chat?.text || '', item.files),
        },
        {
          icon: 'bi-reply',
          key: 'reply',
          title: t('workspace.chat.menuAction.reply'),
          show: permissionCreateChat.value,
          action: () => handleAction('reply', item),
        },
        {
          icon: 'bi-files',
          key: 'copyText',
          title: t('workspace.chat.menuAction.copyText'),
          show: item?.chat.statusChat !== 'forward',
          action: () => copyText(item?.chat.text),
        },
        {
          icon: 'bi-forward',
          key: 'forward',
          title: t('workspace.chat.menuAction.forward'),
          show: item?.chat.statusChat !== 'forward',
          action: () => handleAction('forward', item),
        },
        {
          icon: 'bi-pencil-square',
          key: 'edit',
          title: t('workspace.chat.menuAction.edit'),
          show:
            (((typeIsOneToOne.value || permissionCreateChat.value) &&
              item?.chat.typeChat === 'sent') ||
              permissionEditAndRemoveChat.value) &&
            item?.chat.statusChat !== 'forward',
          action: () => handleAction('edit', item),
        },
        {
          icon: 'bi-pin',
          key: 'pin',
          title: item?.pinChat
            ? t('workspace.chat.menuAction.unpin')
            : t('workspace.chat.menuAction.pin'),
          show: permissionPinChat.value,
          action: () => handlePinChat(item),
        },
        {
          icon: 'bi-trash3',
          key: 'delete',
          title: t('workspace.chat.menuAction.delete'),
          show: permissionEditAndRemoveChat.value && !item.deleteChat?.isDeleted,
          action: () => handleRemove(item),
        },
      ];
      return menu.filter((item: any) => item.show);
    };
    const getListReact = (item: formChat) => {
      if (!item?.reactions) return [];
      let objectEmoji = {} as any;
      const reactions = item?.reactions as any;
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
    };
    const refactorListItem = (data: any): Array<formChat> => {
      let result = {} as any;
      // const dataDefault = [...data];
      [...data].reverse().forEach((item: any) => {
        const dataTask = refactorItem(item) as any;
        result = groupDateTime({ ...result }, dataTask);
      });
      state.totalCountDate = Object.keys(result)?.length || 0;
      return result;
    };

    const checkNewItem = (data: any) => {
      const newItem = data.find(
        (item: any) => !item?.reads?.[0]?.is_read && !item?.is_activity,
      );
      if (newItem) {
        state.activeNewItem = null;
        state.activeNewDate = null;
      }
    };

    const calculatorListMessage = (newData: any) => {
      checkNewItem(newData);
      const newDataResult = refactorListItem([...newData]) as any;
      let arrayResult = [] as Array<formChat>;
      for (const key in newDataResult) {
        arrayResult = [...arrayResult, ...newDataResult[key]];
      }
      console.log(' state.listMessage', [...state.listMessage]);
      if (state?.filter?.before) {
        const newArrayData = _.differenceWith(arrayResult, state.listMessage, _.isEqual);

        state.listMessage.unshift(...newArrayData);
      } else if (state?.filter?.after) {
        const newArrayData = _.differenceWith(arrayResult, state.listMessage, _.isEqual);
        console.log('newArrayData', newArrayData);
        state.listMessage.push(...newArrayData);
      } else {
        state.listMessage = [...arrayResult];
      }
      const keysResult = Object.keys(newDataResult);
      state.objectGroupDateTime = state.objectGroupDateTime.concat(
        keysResult.filter((item: string) => !state.objectGroupDateTime.includes(item)),
      );
      console.log('state.listMessage', state.listMessage);
    };

    const getAllMessage = () => {
      mainStore.loadingPage = true;
      state.loading = true;
      state.activeScroll = false;

      const paramsBody: ParamsChatV2 = {
        ...state.filter,
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: channelId.value,
      };
      return new Promise((resolve, reject) => {
        ChatService.getAllMessageV2(paramsBody)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const responsive = res?.data;
              calculatorListMessage(responsive?.data || []);
              state.totalActivity = responsive.total_activity;
              state.total = responsive?.total + state.totalActivity || 0;
              state.renderOnLoad = 1;
              if (state?.filter?.before) {
                state.hasPreviousPage = responsive?.has_previous_page || false;
              } else if (state?.filter?.after) {
                state.hasNextPage = responsive?.has_next_page || false;
              } else {
                state.hasNextPage = responsive?.has_next_page || false;
                state.hasPreviousPage = responsive?.has_previous_page || false;
              }
              resolve(responsive);
            } else {
              NotifyServices.showMessageError(`${res?.message}`);
              reject(false);
            }
          })
          .catch((err) => {
            NotifyServices.showMessageError(`${err.message}`);
            reject(false);
          })
          .finally(() => {
            state.loading = false;
            mainStore.loadingPage = false;
          });
      });
    };

    const getPinMessage = () => {
      const paramsBody: ParamsChat = {
        page: 1,
        page_size: 3,
        is_pin: true,
        workspace_id: Number(route?.params?.workspaceId),
        channel_id: channelId.value,
      };
      ChatService.getAllMessage(paramsBody)
        .then((res: any) => {
          if (res?.status_code === 200) {
            const responsive = res?.data;
            state.listMessagePinDefault = [...responsive.data];
            channelStore.totalPin = state.listMessagePinDefault.length;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
    const updateListMessage = (newItem: any) => {
      const index = state.listMessage.findIndex((item: any) => item.id === newItem.id);
      const itemMessage = state.listMessage[index];
      state.listMessage[index] = {
        ...itemMessage,
        ...refactorItem(newItem),
      };
    };

    const onNewMessage = (chat: any) => {
      let itemChat = { ...chat };
      if (
        isPageActive.value &&
        (checkPositionView.value === 'bottom' ||
          chat?.sender?.id === infoUser.value?.id ||
          chat?.user?.id === infoUser.value?.id)
      ) {
        state.activeNewItem = null;
        state.activeNewDate = null;
        itemChat = {
          ...itemChat,
          reads: [
            {
              ...chat?.reads?.[0],
              is_read: true,
            },
          ],
        };
        setTimeout(() => {
          scrollToBottomId('messageBottom');
        }, 20);
        readAllMessage();
      }

      if (
        !isPageActive.value ||
        state.hasNextPage ||
        checkPositionView.value !== 'bottom'
      ) {
        channelStore.totalCountUnReadChat += 1;
      }

      if (!state.hasNextPage) {
        if (!state.activeNewItem) {
          checkNewItem([itemChat]);
        }
        console.log('state.activeNewItem', state.activeNewItem);
        const newDataResult = refactorListItem([itemChat]) as any;
        let arrayResult = [] as Array<formChat>;
        for (const key in newDataResult) {
          arrayResult = [...arrayResult, ...newDataResult[key]];
        }
        const newArrayData = _.differenceWith(arrayResult, state.listMessage, _.isEqual);
        state.listMessage.push(...newArrayData);
        const keysResult = Object.keys(newDataResult);
        state.objectGroupDateTime = state.objectGroupDateTime.concat(
          keysResult.filter((item: string) => !state.objectGroupDateTime.includes(item)),
        );
      }
    };

    const onForwardMessage = (chat: any) => {
      if (chat) {
        state.listForwardChat.push(chat.channel.id);
        if (!isPageActive.value) {
          channelStore.totalCountUnReadChat += 1;
        }
      }
    };

    const onUpdateMessage = (chat: any) => {
      updateListMessage(chat);
    };

    const onPinMessage = (chat: any) => {
      updateListMessage(chat);
      state.listMessagePinDefault.unshift(chat);
      channelStore.totalPin = state.listMessagePinDefault.length;
    };

    const onUnpinMessage = async (chat: any) => {
      await backToListChat();
      state.showModalConfirm = false;
      updateListMessage(chat);
      state.listMessagePinDefault = state.listMessagePinDefault.filter(
        (item: any) => item.id !== chat.id,
      );
      channelStore.totalPin = state.listMessagePinDefault.length;
    };
    const onUpdateReadMessage = (chat: any) => {
      chat?.chat_ids.forEach((id: number) => {
        const index = state.listMessage.findIndex((item: any) => item.id === id);
        const itemMessage = state.listMessage[index];
        state.listMessage[index] = {
          ...itemMessage,
          readChat: true,
        };
      });
      channelStore.totalCountUnReadChat =
        channelStore.totalCountUnReadChat - chat?.chat_ids.length;
      state.activeNewItem = null;
      state.activeNewDate = null;
      mainStore.actionReloadSideBar();
    };
    const onUpdateReactMessage = (chat: any) => {
      const index = state.listMessage.findIndex(
        (item: any) =>
          item.id === chat.chat.id && chat.chat.channel?.id === channelId.value,
      );
      const itemMessage = state.listMessage[index];
      let reactions = itemMessage.reactions || [];
      const indexEmoji = reactions.findIndex((item: any) => item.emoji === chat.emoji);
      if (indexEmoji < 0) {
        reactions.push({
          active: infoUser.value?.id === chat?.user?.id,
          created_at: chat.created_at,
          emoji: chat.emoji,
          listUser: [
            {
              email: chat.user?.email || '',
              full_name: chat.user?.full_name || '',
              id: chat.user?.id,
            },
          ],
        });
      } else {
        if (infoUser.value?.id === chat?.user?.id) {
          reactions[indexEmoji].active = true;
        }
        reactions[indexEmoji].listUser.push({
          email: chat.user?.email || '',
          full_name: chat.user?.full_name || '',
          id: chat.user?.id,
        });
      }
    };
    const onUpdateUnReactMessage = (chat: any) => {
      const index = state.listMessage.findIndex(
        (item: any) =>
          item.id === chat.chat.id && chat.chat.channel?.id === channelId.value,
      );
      const itemMessage = state.listMessage[index];
      const reactions = itemMessage.reactions || [];
      const indexEmoji = reactions.findIndex(
        (itemReaction: any) => itemReaction.emoji === chat.emoji,
      );
      if (infoUser.value?.id === chat?.user?.id) {
        reactions[indexEmoji].active = false;
      }
      const indexUser = reactions[indexEmoji].listUser.findIndex(
        (item: any) => item.id === chat.user.id,
      );
      reactions[indexEmoji].listUser.splice(indexUser, 1);
    };

    const onNewAction = (res: any) => {
      console.log('onNewAction', res);
    };
    const onVotePoll = (chat: any) => {
      console.log('chat', chat);
      onNewPoll(chat);
    };

    const onNewPoll = (chat: any) => {
      if (chat.is_pin) {
        const index = state.listMessagePinDefault.findIndex(
          (item: any) => item.id === chat.id,
        );
        if (index < 0) {
          state.listMessagePinDefault.unshift(chat);
          channelStore.totalPin = state.listMessagePinDefault.length;
        } else {
          state.listMessagePinDefault[index] = {
            ...state.listMessagePinDefault[index],
            ...chat,
          };
        }
      }
      const index = state.listMessage.findIndex(
        (item: formChat) =>
          item.id === chat.id && item.type === 'pollVote' && !item.isActivity,
      );
      if (index >= 0) {
        state.listMessage.splice(index, 1);
      }
      onNewMessage(chat);

      if (channelStore.IsShowModalVote) {
        refModalVote.value.createOptionDone();
        channelStore.infoVote = {
          id: chat.id || '',
          title: chat.title || '',
          answers: setVote(chat?.answers, chat.votes) || [],
          votes: chat?.votes || [],
          memberCount: chat?.memberCount || 0,
          multiSelected: chat.is_multi_select || false,
          closePoll: chat.due_at && checkDue(chat.due_at, 'second') <= 0,
          dueDate: chat.due_at,
        };
      }
    };

    const onErrorMessage = (error: any) => {
      console.log(error);
      if (error?.user_id !== infoUser.value?.id) return;
      if (error?.type === 'PIN_MESSAGE') {
        state.showModalConfirm = true;
        state.infoModalConfirm = {
          type: 'confirm',
          title: t('workspace.chat.modalMaxPin.title'),
          textOk: t('global.ok'),
          textCancel: '',
          alignFooter: 'right',
          desc: t('workspace.chat.modalMaxPin.desc'),
          disabled: false,
          action: () => {
            state.showModalConfirm = false;
          },
        };
        return;
      }
      if (
        error?.type === actionSocket['PIN_POLL'] ||
        error?.type === actionSocket['NEW_POLL']
      ) {
        state.showModalConfirm = true;
        state.infoModalConfirm = {
          type: 'confirm',
          title: t('workspace.chat.modalCreatePollVote.popupMaxPin.title'),
          textOk: t('global.ok'),
          textCancel: '',
          alignFooter: 'right',
          desc: t('workspace.chat.modalCreatePollVote.popupMaxPin.desc'),
          disabled: false,
          action: () => {
            state.showModalConfirm = false;
          },
        };
        return;
      }
      NotifyServices.showMessageError(`${error.message}`);
    };

    // let socket = null as any
    const socket = computed(() => {
      return socketChannel(channelId.value);
    });
    const onConnect = () => {
      console.log('onConnect');
      state.connected = true;
    };
    const onDisconnect = () => {
      console.log('onDisconnect');
      state.connected = false;
    };

    const connectActionSocket = async () => {
      socket.value.on(actionSocket['connect'], onConnect);
      socket.value.on(actionSocket['disconnect'], onDisconnect);
      socket.value.on(actionSocket['ERROR_MESSAGE'], onErrorMessage);
      socket.value.on(actionSocket['NEW_MESSAGE'], onNewMessage);
      socket.value.on(actionSocket['EDIT_MESSAGE'], onUpdateMessage);
      socket.value.on(actionSocket['HIDE_MESSAGE'], onUpdateMessage);
      socket.value.on(actionSocket['FORWARD_MESSAGE'], onForwardMessage);
      socket.value.on(actionSocket['REACT_MESSAGE'], onUpdateReactMessage);
      socket.value.on(actionSocket['UNREACT_MESSAGE'], onUpdateUnReactMessage);
      socket.value.on(actionSocket['READ_MESSAGE'], onUpdateReadMessage);
      socket.value.on(actionSocket['PIN_MESSAGE'], onPinMessage);
      socket.value.on(actionSocket['UNPIN_MESSAGE'], onUnpinMessage);
      socket.value.on(actionSocket['ACTIVITY_MESSAGE'], onNewMessage);

      socket.value.on(actionSocket['NEW_POLL'], onNewPoll);
      socket.value.on(actionSocket['NEW_ANSWER_POLL'], onNewPoll);
      socket.value.on(actionSocket['READ_POLL'], onNewAction);
      socket.value.on(actionSocket['VOTE_POLL'], onVotePoll);
      socket.value.on(actionSocket['CHANGE_VOTE_POLL'], onVotePoll);
      socket.value.on(actionSocket['CLOSE_POLL'], onNewPoll);
      socket.value.on(actionSocket['PIN_POLL'], onPinMessage);
      socket.value.on(actionSocket['UNPIN_POLL'], onUnpinMessage);
    };

    const disconnectActionSocket = () => {
      console.log('disconnectActionSocket');
      if (socket.value) {
        console.log('socket.value', socket.value);
        socket.value.disconnect();
      }
    };
    const readAllMessage = () => {
      if (isPageActive.value && totalCountUnReadChat.value > 0) {
        socket.value.emit(actionSocket['READ_MESSAGE'], {
          workspace_id: Number(route?.params?.workspaceId),
          channel_id: channelId.value,
          chat_ids: [],
        });
      }
    };
    const checkPositionView = ref('flexible');

    onMounted(() => {
      // try {
      mainStore.loadingPage = true;
      resetPage();
      if (route.query?.chatId) {
        state.filter = {
          ...state.filter,
          around: Number(route.query?.chatId),
          before: undefined,
          after: undefined,
        };
      }
      getAllMessage().then(() => {
        getPinMessage();

        if (route.query?.chatId) {
          setTimeout(() => {
            scrollToId(`message#${route.query?.chatId}`);
            showElement('dataTask');
          }, 10);
        } else {
          if (state.activeNewItem) {
            setTimeout(() => {
              scrollToId(`message#${state.activeNewItem?.infoNewMessage.id}`);
              showElement('dataTask');
            }, 50);
          } else {
            setTimeout(() => {
              // scrollToBottom('dataTask');
              scrollToBottomId('messageBottom');
              showElement('dataTask');
            }, 50);
          }
        }

        // focusInput();
      });

      connectActionSocket();

      const element = document.querySelector('#dataTask') as any;
      element.addEventListener(
        'scroll',
        () => {
          if (element.scrollTop + element.offsetHeight + 10 >= element.scrollHeight) {
            checkPositionView.value = 'bottom';
            readAllMessage();
          } else if (element.scrollTop === 0) {
            checkPositionView.value = 'top';
          } else {
            checkPositionView.value = 'flexible';
          }
        },
        { passive: true },
      );
    });

    const listTypeMessage = computed<Array<formChat>>(() => {
      return state.listMessage.filter((item: formChat) => item.type === 'message');
    });

    const listPinMessage = computed<Array<formChat>>(() => {
      const dataDefault = [...state.listMessagePinDefault];
      return dataDefault.reverse().map((item: any) => {
        return refactorItem(item) as any;
      });
    });
    const reloadPageChat = computed(() => {
      return channelStore.reloadPageChat;
    });

    const detailPageChat = () => {
      mainStore.loadingPage = true;
      resetPage();
      getAllMessage().then(() => {
        getPinMessage();
        if (state.activeNewItem) {
          setTimeout(() => {
            scrollToId(`message#${state.activeNewItem?.infoNewMessage.id}`);
            showElement('dataTask');
          }, 50);
          setTimeout(() => {
            const check = checkScrollShow('dataTask');
            if (!check) {
              readAllMessage();
            }
          }, 500);
        } else {
          // scrollToBottom('dataTask');
          scrollToBottomId('messageBottom');
          showElement('dataTask');
          focusInput();
        }
      });
    };

    watch(reloadPageChat, () => {
      if (reloadPageChat.value > 0) {
        if (isPageActive.value && !state.hasNextPage) {
          detailPageChat();
        }
      }
    });
    watch(route, () => {
      if (
        route.params.channelId &&
        channelDetail.value?.id !== Number(route.params.channelId)
      ) {
        detailPageChat();
        connectActionSocket();
      }
    });
    onBeforeRouteLeave(() => {
      disconnectActionSocket();
    });
    onBeforeRouteUpdate(() => {
      disconnectActionSocket();
    });
    const loadDataTop = (done: any) => {
      if (
        isShowPin.value ||
        state.renderOnLoad < 1 ||
        state.loading ||
        !state.hasPreviousPage
      ) {
        done(true);
        return;
      }
      state.loading = true;
      const lastId = listTypeMessage.value[0]?.id;

      state.filter = {
        ...state.filter,
        page_size: 20,
        before: lastId || undefined,
        after: undefined,
        around: undefined,
      };

      getAllMessage().finally(() => {
        done();
      });
    };
    const loadDataBottom = (done: any) => {
      const firstId = listTypeMessage.value[listTypeMessage.value.length - 1]?.id;
      if (!state.hasNextPage) {
        readAllMessage();
        done(true);
        return;
      }
      if (isShowPin.value || state.renderOnLoad < 1 || state.loading) {
        done(true);
        return;
      }

      state.loading = true;
      state.filter = {
        ...state.filter,
        page_size: 20,
        after: firstId || undefined,
        before: undefined,
        around: undefined,
      };
      getAllMessage().finally(() => {
        done();
      });
    };
    const sendMessage = (bodyChat: BodyCreateChat) => {
      const body: BodyCreateChat = {
        ...bodyChat,
        channel_id: channelId.value,
      };
      socket.value.emit(actionSocket['NEW_MESSAGE'], {
        ...body,
      });
      checkPositionView.value = 'bottom';
    };

    const editMessage = (bodyChat: BodyCreateChat) => {
      const body: BodyCreateChat = {
        ...bodyChat,
        channel_id: channelId.value,
        chat_id: state.bodyReply?.id || undefined,
      };
      socket.value.emit(actionSocket['EDIT_MESSAGE'], {
        ...body,
      });
    };

    const createMessage = (bodyChat: BodyCreateChat) => {
      sendMessage(bodyChat);
      clearDataInput();
    };
    const replyMessage = (bodyChat: BodyCreateChat) => {
      const body: BodyCreateChat = {
        ...bodyChat,
        chat_id: state.bodyReply?.id || undefined,
      };
      sendMessage(body);
      clearDataInput();
    };

    const actionMessage = (
      text: string,
      files?: Array<FormFile>,
      userIds?: Array<string | number>,
    ) => {
      const filesId = files?.map((item: any) => item.id) || [];
      let body: BodyCreateChat = {
        mention_user_ids: userIds ? [...userIds] : null,
        content: text || '',
        attachment_ids: filesId ? [...filesId] : null,
        channel_id: '',
        // chat_id: ''
      };
      if (state.typeActionChat === '') {
        createMessage(body);
      }
      if (state.typeActionChat === 'reply') {
        replyMessage(body);
      }

      if (state.typeActionChat === 'edit') {
        editMessage(body);
        clearDataInput();
      }
      readAllMessage();
    };

    //  remove chat
    const handleRemove = (item: formChat) => {
      state.showModalConfirm = true;
      state.infoModalConfirm = {
        type: 'confirm',
        title: t('workspace.chat.modalRemove.title'),
        textOk: t('workspace.chat.modalRemove.textOk'),
        textCancel: t('global.no'),
        alignFooter: 'right',
        desc: t('workspace.chat.modalRemove.desc'),
        disabled: false,
        action: () => onRemoveChat(),
      };
      state.selectedChat = item;
    };

    const onRemoveChat = async () => {
      await backToListChat();
      socket.value.emit(actionSocket['HIDE_MESSAGE'], {
        channel_id: channelId.value,
        chat_id: state.selectedChat?.id || undefined,
      });
      closeModal();
    };
    const closeModal = () => {
      state.showModalConfirm = false;
      state.selectedChat = undefined;
    };
    const actionScroll = () => {
      if (!state.hasNextPage) {
        scrollToId('messageBottom');
        readAllMessage();
      } else {
        mainStore.loadingPage = true;
        resetPage();
        getAllMessage().then(() => {
          if (route.query?.chatId) {
            router.replace({
              ...route,
              query: {
                ...route.query,
                chatId: undefined,
              },
            });
          }
          if (state.activeNewItem) {
            setTimeout(() => {
              scrollToId(`message#${state.activeNewItem?.infoNewMessage.id}`);
              showElement('dataTask');
            }, 50);
          } else {
            setTimeout(() => {
              scrollToBottom('dataTask');
              scrollToBottomId('messageBottom');
              showElement('dataTask');
            }, 50);
          }
        });
      }
    };

    const handleAction = async (type: string, item: formChat) => {
      await backToListChat();

      if (type === 'reply') {
        closeAction();
        state.typeActionChat = type;
        state.bodyReply = item;
        focusInput();
      }
      if (type === 'edit') {
        state.typeActionChat = type;
        state.bodyReply = item;
        refInputChat.value.setTextContent(item.chat.text, item.files);
      }
      if (type === 'forward') {
        state.listForwardChat = [];
        channelStore.IsShowModalForwardChat = true;
        state.selectedChat = item;
      }
    };

    const closeAction = () => {
      clearDataInput();
      state.renderInput += 1;
    };

    const clearDataInput = () => {
      state.typeActionChat = '';
      state.bodyReply = undefined;
      refInputChat.value.setTextContent('', []);
    };

    const reactChat = async (item: formChat, emoji: any, isReact?: boolean) => {
      await backToListChat();

      socket.value.emit(
        isReact ? actionSocket['REACT_MESSAGE'] : actionSocket['UNREACT_MESSAGE'],
        {
          channel_id: channelId.value,
          chat_id: item?.id || undefined,
          emoji: emoji.colons,
        },
      );
    };

    const forwardChat = (channelId: string | number) => {
      socket.value.emit(actionSocket['FORWARD_MESSAGE'], {
        channel_id: Number(channelId),
        chat_id: state.selectedChat?.id || undefined,
      });
    };

    const handleConvertTask = (text: string, files?: Array<FormFile>) => {
      backToListChat();
      workspaceStore.infoForwardTask = {
        channel: channelStore.detailChanel,
        text,
        files,
      };
      if (checkMaxLengthTextDescTask(text)) {
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
        };
        nextTick(() => {
          refContentEditAble.value.setTextContent(text);
        });
      }
    };

    const addContent = (text: string) => {
      if (checkMaxLengthTextDescTask(text)) {
        workspaceStore.infoForwardTask.text = text;
        state.infoModalConfirm.disabled = false;
      }
    };

    const onOk = () => {
      if (state.infoModalConfirm.type === 'confirm') {
        // onRemoveChat();
        state.infoModalConfirm.action();
      }
      if (state.infoModalConfirm.type === 'convert') {
        workspaceStore.IsShowModalAddTaskWs = true;
        state.showModalConfirm = false;
      }
    };

    const handlePinChat = (item: formChat) => {
      if (item.pinChat) {
        state.showModalConfirm = true;
        state.infoModalConfirm = {
          type: 'confirm',
          title: t('workspace.chat.modalRemovePin.title'),
          textOk: t('workspace.chat.modalRemovePin.textOk'),
          textCancel: t('global.no'),
          alignFooter: 'right',
          desc: t('workspace.chat.modalRemovePin.desc'),
          disabled: false,
          action: () => {
            socket.value.emit(actionSocket['UNPIN_MESSAGE'], {
              channel_id: Number(channelId.value),
              chat_id: item?.id || undefined,
            });
          },
        };
        state.selectedChat = item;
      } else {
        socket.value.emit(actionSocket['PIN_MESSAGE'], {
          channel_id: Number(channelId.value),
          chat_id: item?.id || undefined,
        });
      }
    };
    const handlePinPoll = (item: formChat) => {
      if (item.pinChat) {
        state.showModalConfirm = true;
        state.infoModalConfirm = {
          type: 'confirm',
          title: t('workspace.chat.modalRemovePin.title'),
          textOk: t('workspace.chat.modalRemovePin.textOk'),
          textCancel: t('global.no'),
          alignFooter: 'right',
          desc: t('workspace.chat.modalRemovePin.desc'),
          disabled: false,
          action: () => {
            socket.value.emit(actionSocket['UNPIN_POLL'], {
              channel_id: Number(channelId.value),
              poll_id: item?.id || undefined,
            });
          },
        };
        state.selectedChat = item;
      } else {
        socket.value.emit(actionSocket['PIN_POLL'], {
          channel_id: Number(channelId.value),
          poll_id: item?.id || undefined,
        });
      }
    };

    const focusMessage = (chatId: string | number) => {
      return new Promise((resolve) => {
        const getMessage = state.listMessage.find((item: any) => item.id === chatId);
        if (getMessage) {
          setTimeout(() => {
            scrollToId(`message#${chatId}`);
          }, 500);
          resolve(true);
        } else {
          state.filter = {
            ...state.filter,
            around: Number(chatId),
            before: undefined,
            after: undefined,
          };
          state.listMessage = [];
          mainStore.loadingPage = true;
          getAllMessage().then(() => {
            resolve(true);
            setTimeout(() => {
              scrollToId(`message#${chatId}`);
            }, 500);
          });
        }
      });
    };

    const actionReply = async (chatId: string | number) => {
      await focusMessage(chatId);
    };

    const backToListChat = (chatId?: number | string) => {
      return new Promise((resolve) => {
        if (chatId) {
          focusMessage(chatId).then(() => {
            channelStore.isShowPin = false;
            resolve(true);
          });
        } else {
          channelStore.isShowPin = false;
          resolve(true);
        }
      });
    };

    const showVote = () => {
      channelStore.IsShowModalCreatePollVote = true;
    };

    const createPollVote = (body: any) => {
      socket.value.emit(actionSocket['NEW_POLL'], {
        ...body,
        channel_id: channelId.value,
      });
    };
    const createOption = (body: any) => {
      socket.value.emit(actionSocket['NEW_ANSWER_POLL'], {
        ...body,
        channel_id: channelId.value,
      });
    };
    const votePoll = (body: any) => {
      socket.value.emit(actionSocket['VOTE_POLL'], {
        ...body,
        channel_id: channelId.value,
      });
      refModalVote.value.closeModal();
    };

    const showPoll = (item: formChat) => {
      const index = state.listMessage.findIndex(
        (itemChat: formChat) =>
          itemChat.type === 'pollVote' && itemChat.id === item.other?.poll?.id,
      );
      if (index >= 0) {
        channelStore.infoVote = { ...state.listMessage[index].pollVote } as TypePollVote;
        channelStore.ownerPollVote =
          state.listMessage[index]?.user?.id === infoUser.value?.id;
        channelStore.IsShowModalVote = true;
      } else {
        ChatService.getDetailPoll(`${item.other?.poll?.id}`)
          .then((res: any) => {
            if (res?.status_code === 200) {
              const itemPoll = refactorItem(res?.data);
              channelStore.infoVote = { ...itemPoll.pollVote } as TypePollVote;
              channelStore.ownerPollVote = itemPoll?.user?.id === infoUser.value?.id;
              channelStore.IsShowModalVote = true;
            } else {
              NotifyServices.showMessageError(res?.message);
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
    };

    // vote
    const changeVote = (item: formChat) => {
      const pollVote = extend(true, {}, item.pollVote) as TypePollVote;
      channelStore.infoVote = { ...pollVote };
      channelStore.ownerPollVote = item?.user?.id === infoUser.value?.id;
      channelStore.IsShowModalVote = true;
    };

    return {
      ...toRefs(state),
      scrollTargetRef,
      scrollTargetPageRef,
      // listMessage,
      listPinMessage,
      refInputChat,
      refContentEditAble,
      checkPositionView,
      actionScroll,
      loadDataTop,
      loadDataBottom,
      resetPage,
      createMessage,
      replyMessage,
      actionMessage,
      handleAction,
      focusInput,
      closeAction,
      clearDataInput,
      handleRemove,
      closeModal,
      onRemoveChat,
      permissionCreateChat,
      reactChat,
      forwardChat,
      handleConvertTask,
      channelId,
      countDescTask,
      addContent,
      onOk,
      handlePinChat,
      handlePinPoll,
      isShowPin,
      backToListChat,
      focusMessage,
      totalCountUnReadChat,
      actionReply,
      showVote,
      createPollVote,
      showPoll,
      changeVote,
      createOption,
      refModalVote,
      votePoll,
    };
  },
});
</script>

<template>
  <div class="body-chat">
    <div
      v-show="isShowPin"
      class="body-chat-pin"
    >
      <title-pin
        :countPin="listPinMessage.length"
        @action="backToListChat()"
      ></title-pin>
      <template
        v-for="(item, index) in listPinMessage"
        :key="item.id"
      >
        <CardVote
          v-if="item.type === 'pollVote' && !item?.isActivity"
          :show-pin-chat="!isShowPin"
          :id="`message#${item.id}`"
          :info-card-vote="item"
          @pin="handlePinPoll(item)"
          @changeVote="changeVote(item)"
        ></CardVote>
        <card-chat
          v-if="item?.type === 'message'"
          :info-card-chat="item"
          :show-react="false"
          :show-pin-chat="!isShowPin"
          @pinChat="handlePinChat(item)"
          @focusMessage="backToListChat(item.id)"
        />
        <q-separator
          v-if="index !== listPinMessage?.length - 1"
          class="separator"
        >
        </q-separator>
      </template>
    </div>
    <div
      v-show="!isShowPin"
      class="body-chat-list"
      :class="{
        'body-welcome-channel': total === 1 && totalActivity === 1 && !loading,
      }"
    >
      <div
        id="dataTask"
        class="data-task"
        ref="scrollTargetRef"
      >
        <WelcomeChannel
          v-if="total === 1 && totalActivity === 1 && !loading"
          class="welcome-channel"
        />
        <noData
          v-if="!listMessage.length && !loading"
          type-data="chat"
        >
          <template #bottom>
            <div class="bottom-title">
              <div class="text-body">
                {{ $t('workspace.chat.noData.title') }}
              </div>
              <div class="text-body-regular">
                {{ $t('workspace.chat.noData.content') }}
              </div>
            </div>
          </template>
        </noData>
        <scroll-page
          ref="scrollTargetPageRef"
          :offset="250"
          scroll-type="flexible"
          :activeScroll="activeScroll"
          :scrollTargetRef="scrollTargetRef"
          @loadNewDataTop="loadDataTop"
          @loadNewDataBottom="loadDataBottom"
        >
          <template
            v-for="(item, index) in listMessage"
            :key="`${item.type}${item?.isActivity ? '-activity' : ''}#${item.id}`"
          >
            <showDateTask
              v-if="item?.type === 'dateTime' && !(total === 1 && totalActivity === 1)"
              :active-new-item="
                activeNewDate && activeNewDate === item.id && totalCountUnReadChat > 0
              "
              :date-time="item"
            ></showDateTask>
            <showDateTask
              v-if="
                !activeNewDate &&
                item.id === activeNewItem?.infoNewMessage.id &&
                item?.type === 'message' &&
                totalCountUnReadChat > 0
              "
              :id="`showDateTask#${item.id}`"
              :active-new-item="true"
            ></showDateTask>
            <title-pin
              v-if="item?.isActivity && item?.type !== 'JOIN'"
              :info-task="item"
              :id="`message#${item.id}`"
              @action="showPoll(item)"
            ></title-pin>
            <add-or-remove-member
              v-if="item?.isActivity && item?.type === 'JOIN'"
              :info-task="item"
            />
            <card-chat
              v-if="item?.type === 'message'"
              :id="`message#${item.id}`"
              :info-card-chat="item"
              :show-pin-chat="!isShowPin"
              @react="reactChat"
              @actionReply="focusMessage"
            >
            </card-chat>
            <CardVote
              v-if="item.type === 'pollVote' && !item?.isActivity"
              :show-pin-chat="!isShowPin"
              :id="`message#${item.id}`"
              :info-card-vote="item"
              @pin="handlePinPoll(item)"
              @changeVote="changeVote(item)"
            ></CardVote>
            <div
              v-if="index === listMessage.length - 1"
              id="messageBottom"
            ></div>
          </template>
        </scroll-page>
      </div>
    </div>

    <div id="inputChat">
      <div
        v-if="listMessage.length"
        class="relative-position"
      >
        <div class="box-fixed">
          <TabFixedChannel />
          <div class="box-fixed-scroll">
            <c-btn
              v-if="checkPositionView != 'bottom'"
              color="primary"
              outline
              size="small"
              class="box-fixed__btn"
              @click="actionScroll"
            >
              <template #default>
                <q-icon
                  size="16px"
                  :name="'bi-chevron-double-down'"
                />
                <q-tooltip
                  :offset="[10, 10]"
                  max-width="300px"
                  max-height="50px"
                  anchor="center start"
                  self="center end"
                  class="tool-tip bg-green-1 text-black shadow-9"
                >
                  <span class="text-title">{{
                    $t('workspace.channel.toolTip.bottom')
                  }}</span>
                </q-tooltip>
              </template>
            </c-btn>
          </div>
        </div>
      </div>

      <div
        v-if="permissionCreateChat"
        class="row"
      >
        <InputChat
          v-show="!isShowPin"
          ref="refInputChat"
          :key="renderInput"
          class="col-12"
          :key-content="`input-chat`"
          :channel-id="channelId"
          type="comment"
          type-channel="oneToOne"
          placeholder="Type your message here"
          @addComment="actionMessage"
          @close-action-chat="closeAction"
          @convert-task="handleConvertTask"
          @actionReply="actionReply(bodyReply.id)"
          @showVote="showVote"
          :type-action="typeActionChat"
          :body-reply="bodyReply"
          show-action
        ></InputChat>
      </div>
    </div>
  </div>
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
        hidden-tag
        :channel-id="channelId"
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
  <modal-forward-chat
    :list-forward-chat="listForwardChat"
    @send-chat="forwardChat"
  ></modal-forward-chat>
  <ModalPollVote @createPollVote="createPollVote"></ModalPollVote>
  <ModalVoteChat
    ref="refModalVote"
    @createOption="createOption"
    @votePoll="votePoll"
  ></ModalVoteChat>
</template>

<style scoped lang="scss">
.data-task {
  .card-chat {
    padding: 0 24px;
  }

  //position: relative;
}

.box-fixed {
  position: absolute;
  right: 16px;
  //top: -30px;
  bottom: 30px;
  z-index: 100;

  &-button {
    margin-bottom: 24px;
  }

  &-scroll {
    display: flex;
    justify-content: flex-end;
  }

  .box-fixed__btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #e7f6e9 !important;

    .q-icon {
      color: #1c8c44;
    }
  }
}

#inputChat {
  padding: 16px 24px;
  position: sticky;
  bottom: 0;
  width: 100%;
  overflow-anchor: none;
  background: #ffffff;
  z-index: 120;
  //position: relative;
}

#dataTask {
  //min-height: calc(100vh - 310px);
  //max-height: calc(100vh - 310px);
  height: 100%;
  max-height: 100%;
  overflow-anchor: none;
  opacity: 0;
  margin-top: auto;
  display: flex;
  flex-direction: column;

  .page-scroll {
    width: 100%;
    //min-height: calc(100vh - 310px);
    //max-height: calc(100vh - 310px);
    overflow-anchor: auto;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}

#messageBottom {
  width: 100%;
  height: 10px;
}

.edit-content {
  margin-top: 32px;
}

.body-chat {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: 12px;

  &-pin {
    padding: 25px 32px;
  }
  &-list {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    &.body-welcome-channel {
      padding-top: 0;
    }
  }
}

:deep(.show-date-box) {
  hr {
    width: calc(100% / 2 - 74px);
  }
}

.separator {
  margin: 24px 0;
  background: #e9eae8;
}

.tool-tip .text-title {
  font-size: 12px;
  color: #2f2f2f;
}
</style>
