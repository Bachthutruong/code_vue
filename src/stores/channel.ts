import { defineStore } from 'pinia';
import ChannelService from 'src/services/channel';
import TaskService from 'src/services/task';
import {
  paramsMember,
  paramsFiles,
  bodyChannel,
  bodyUpdateChannel,
} from 'src/services/channel/model';
import NotifyServices from 'src/plugins/NotifyServices';
import { paramsTask } from 'src/services/task/model';
import { useMainStore } from 'stores/main';
import {
  IChannel,
  IRoleChanel,
  roleChannel,
  TypeFieldEditRole,
  TypeFieldRole,
  typeNotifyWs,
} from 'src/model/ChannelDetail';
// import {useRouter} from "vue-router";
import { IFileItem } from 'src/model/ModelFile';
import { ChannelRoleFiledName } from 'src/constants/ConstantChannelDetail';
import { TypePollVote } from 'src/interface/chat';
import { typeChannel } from 'src/interface/constStatus';

interface State {
  listChannel: any;
  listOneToOne: any;
  menuCalendar: any;
  IsShowModal: boolean;
  IsShowModalAddPeople: boolean;
  IsShowModalAddOneToOne: boolean;
  IsShowModalAddTask: boolean;
  IsShowModalDraftTask: boolean;
  IsShowModalPost: boolean;
  detailChanel: IChannel | null;
  roleDetailChanel: IRoleChanel | any;
  listMemberChannel: any;
  listTaskChannel: any;
  filesInChannel: IFileItem[];
  notifyWs: typeNotifyWs;
  IsShowModalDetailChannel: boolean;
  totalTask: number;
  totalPin: number;
  IsShowModalForwardChat: boolean;
  isShowPin: boolean;
  isShowArrange: boolean;
  filter?: paramsTask;
  IsFilter: boolean;
  totalCountUnReadChat: number;
  totalCountUnReadTask: number;
  totalCountDraftTask: number;
  totalCountUnReadWiki: number;
  totalCountDraftWiki: number;
  IsShowModalCreatePollVote: boolean;
  IsShowModalVote: boolean;
  infoVote: TypePollVote | null;
  ownerPollVote: boolean;
  reloadPageTask: number;
  reloadPageChat: number;
  reloadPageWiki: number;
  tabChannel: typeChannel | '';
}

const mainStore = useMainStore();

export const useChannelStore = defineStore({
  id: 'channelStore',
  state: () =>
    ({
      listChannel: [],
      listOneToOne: [],
      menuCalendar: [],
      detailChanel: null,
      IsShowModal: false,
      IsShowModalAddPeople: false,
      IsShowModalAddTask: false,
      IsShowModalDraftTask: false,
      IsShowModalPost: false,
      IsShowModalAddOneToOne: false,
      listMemberChannel: [],
      listTaskChannel: [],
      filesInChannel: [],
      notifyWs: {
        calendar: {
          done: 0,
          indue: 0,
          overdue: 0,
        },
        draft: 0,
        comment: 0,
        unreadTasks: 0,
        unreadChats: 0,
        unreadWiki: 0,
      },
      roleDetailChanel: null,
      IsShowModalDetailChannel: false,
      totalTask: 0,
      totalPin: 0,
      IsShowModalForwardChat: false,
      isShowPin: false,
      isShowArrange: false,
      filter: {
        page: 1,
        page_size: 12,
        status: undefined,
        is_flag: undefined,
        priority: undefined,
        is_read: undefined,
        start_date: undefined,
        end_date: undefined,
      },
      IsFilter: false,
      totalCountUnReadChat: 0,
      totalCountUnReadTask: 0,
      totalCountUnReadWiki: 0,
      IsShowModalCreatePollVote: false,
      IsShowModalVote: false,
      infoVote: null,
      totalCountDraftTask: 0,
      totalCountDraftWiki: 0,
      ownerPollVote: false,
      reloadPageTask: 0,
      reloadPageChat: 0,
      reloadPageWiki: 0,
      tabChannel: '',
    } as State),

  getters: {
    isOwner(state) {
      const channelOwnerId = state.detailChanel?.owner?.id;
      const userId = mainStore.getUser?.id;
      return channelOwnerId === userId;
    },
    generalChannel(state) {
      if (state.listChannel.length === 0) return null;
      const getGeneralChannel = state.listChannel.find(
        (channel: IChannel) => channel.type === 'GENERAL',
      );
      return getGeneralChannel || null;
    },
    channelOwnerId(state) {
      return state.detailChanel?.owner?.id;
    },
    getRolePermissionChannel(state): IRoleChanel {
      const roles = state.detailChanel?.roles as Array<roleChannel>;
      let permission = {} as IRoleChanel;
      roles?.forEach((item: roleChannel) => {
        // @ts-ignore
        permission[ChannelRoleFiledName[item.name]] = item;
      });
      return permission;
    },
    typeIsOneToOne(state): boolean {
      return state.detailChanel?.type === 'ONE_TO_ONE';
    },
  },

  actions: {
    // getSidebarInWS
    getChannelInWs(workspaceId: string) {
      return new Promise((resolve, reject) => {
        ChannelService.getSideBar(workspaceId)
          .then((res: any) => {
            if (res?.status_code === 200) {
              this.listChannel = [];
              this.listOneToOne = [];
              this.notifyWs = {
                calendar: res.data.calendar,
                draft: res?.data?.draft_schedule_sent || 0,
                comment: res?.data?.notifications || 0,
                unreadTasks: res?.data?.unread_tasks || 0,
                unreadChats: res?.data?.unread_chats || 0,
                unreadWiki: res?.data?.unread_wiki || 0,
              };
              this.totalCountDraftTask = res?.data?.draft_schedule_sent_task || 0;
              this.totalCountDraftWiki = res?.data?.draft_schedule_sent_wiki || 0;
              const userId = mainStore.getUser?.id;
              const dataChannel = res.data.channels;
              dataChannel.map((item: any) => {
                if (['GENERAL', 'MANUAL'].includes(item.type)) {
                  this.listChannel.push({
                    ...item,
                    total: item.total_unread,
                  });
                }
                if (['ONE_TO_ONE'].includes(item.type)) {
                  const member = item?.members[0];
                  this.listOneToOne.push({
                    ...item,
                    total: item.total_unread,
                    avatar: member.avatar || '',
                    isOwner: member?.id === userId,
                    is_mute: item?.mutes?.[0]?.is_mute || false,
                  });
                }
              });
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch((err: any) => {
            reject(err.message);
            // NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    getChannelDetail(id: string) {
      return new Promise((resolve, reject) => {
        ChannelService.getDetailChannel(id)
          .then((res: any) => {
            if (res?.status_code === 200) {
              console.log('res.data', res.data);
              this.detailChanel = {
                ...res.data,
                avatar: {
                  ...res.data?.members?.[0]?.avatar,
                },
              };
              console.log('this.detailChanel', this.detailChanel);
              this.totalCountUnReadChat = this.detailChanel?.unread_chats || 0;
              this.totalCountUnReadTask = this.detailChanel?.unread_tasks || 0;
              this.totalCountUnReadWiki = this.detailChanel?.unread_wiki || 0;
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch((err: any) => {
            reject(err);
            // NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    getAllMemberChannel(id: string, params: paramsMember) {
      return new Promise((resolve, reject) => {
        ChannelService.findAllMemberChannel(id, params)
          .then((res: any) => {
            if (res?.status_code === 200) {
              this.listMemberChannel = [...res.data.data];
              resolve(res.data);
            } else {
              reject(res);
            }
          })
          .catch((err: any) => {
            reject(err.message);
            // NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    getRoleChannel(id: string) {
      return new Promise((resolve, reject) => {
        ChannelService.getRoleChannel(id).then((res: any) => {
          this.roleDetailChanel = {};
          if (res?.status_code === 200) {
            const data = res.data;
            data.forEach((item: roleChannel) => {
              // @ts-ignore
              this.roleDetailChanel[ChannelRoleFiledName[item.name]] = item;
            });
            resolve(res.data);
          }
          // else {
          //   reject(res);
          // }
        });
      });
    },
    updateRoleChannel(fieldName: TypeFieldRole, type: roleChannel) {
      // @ts-ignore
      this.roleDetailChanel[fieldName] = type;
    },
    createChannel(body: bodyChannel) {
      this.listChannel.push(body);
    },
    showModalAddChannel(boolean: boolean) {
      this.IsShowModal = boolean;
    },
    showModalAddOneToOne(boolean: boolean) {
      this.IsShowModalAddOneToOne = boolean;
    },
    showModalAddPeople(boolean: boolean) {
      this.IsShowModalAddPeople = boolean;
    },
    getAllTaskChannel(params: paramsTask) {
      return new Promise((resolve, reject) => {
        TaskService.getAllTask(params)
          .then((res: any) => {
            console.log('res', res);
            if (res?.status_code === 200) {
              this.listTaskChannel = [...res.data.data];
              resolve(res.data);
            } else {
              console.log(res);
              reject(res?.message);
            }
          })
          .catch((err: any) => {
            console.log('err', err);
            reject(err.message);
            // NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    checkOwnerTask(creatorTaskId: number | string) {
      const userId = mainStore.getUser?.id;
      return creatorTaskId === userId;
      // this.listTaskChannel.push(body);
    },
    showModalAddTask(boolean: boolean) {
      this.IsShowModalAddTask = boolean;
    },
    showModalEditChannel(boolean: boolean) {
      console.log(1);
      this.IsShowModal = boolean;
    },
    getFilesInChanel(id: string | number, params: paramsFiles) {
      return new Promise((resolve, reject) => {
        ChannelService.getFilesInChannel(id, params)
          .then((res: any) => {
            if (res?.status_code === 200 && res?.data?.data) {
              this.filesInChannel = res?.data?.data;
              resolve(res?.data?.data);
              return;
            }
            // NotifyServices.showMessageError(res.message);
            reject(res);
          })
          .catch((err: any) => {
            // NotifyServices.showMessageError(err.message);
            reject(err);
          });
      });
    },
    updateChannel(id: string, body: bodyUpdateChannel) {
      return new Promise((resolve, reject) => {
        ChannelService.editChannel(id, body)
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res);
              return;
            }
            if (res?.message) NotifyServices.showMessageError(res.message);
            reject(res);
          })
          .catch((err) => {
            if (err?.message) NotifyServices.showMessageError(err.message);
            reject(err);
          });
      });
    },
    leaveChannel(id: number) {
      return new Promise((resolve, reject) => {
        ChannelService.leaveChannel({
          channel_id: id,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res);
              return;
            }
            if (res?.message) NotifyServices.showMessageError(res.message);
            reject(res);
          })
          .catch((err: any) => {
            if (err?.message) NotifyServices.showMessageError(err.message);
            reject(err);
          });
      });
    },
    removeMembers(channelId: number, memberIds: number[]) {
      return new Promise((resolve, reject) => {
        ChannelService.removeMemberChannel({
          channel_id: channelId,
          member_ids: memberIds,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res);
              return;
            }
            if (res?.message) NotifyServices.showMessageError(res.message);
            reject(res);
          })
          .catch((err: any) => {
            if (err?.message) NotifyServices.showMessageError(err.message);
            reject(err);
          });
      });
    },
    searchMemberChannel(id: string, params: paramsMember) {
      return new Promise((resolve, reject) => {
        ChannelService.findAllMemberChannel(id, params)
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res.data);
            } else {
              reject(res.message);
            }
          })
          .catch((err: any) => {
            reject(err.message);
          });
      });
    },
    muteCommentTask(task_id: number, is_mute: boolean) {
      return new Promise((resolve, reject) => {
        TaskService.muteCommentTask({
          task_id,
          is_mute,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              resolve(res);
              return;
            }
            if (res?.errors) NotifyServices.showMessageError(res?.errors.message);
            reject(res);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    },
    actionReloadPageTask() {
      this.reloadPageTask += 1;
    },
    actionReloadPageChat() {
      this.reloadPageChat += 1;
    },
    actionReloadPageWiki() {
      this.reloadPageWiki += 1;
    },
  },
});
