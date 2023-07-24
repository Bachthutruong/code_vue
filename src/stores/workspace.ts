import { defineStore } from 'pinia';
import WorkspaceService from 'src/services/workspace';
import NotifyServices from 'src/plugins/NotifyServices';
import NotifyApiService from 'src/services/notify';
import { useMainStore } from 'stores/main';
import { checkFileType } from 'src/helper/global';
import { filename } from 'src/constants/ConstantFile';
import SearchService from 'src/services/search';
import { RoleWs } from 'src/constants/ConstantUser';

// import {useRouter} from "vue-router";
export interface State {
  listWorkspace: any;
  listWorkspaceOwned: any;
  listWorkspaceInvites: any;
  detailWorkspace: any;
  IsShowModalInvite: boolean;
  listMemberWorkspace: any;
  IsShowModalProfile: boolean;
  IsShowModalInformation: boolean;
  IsShowModalActivate: boolean;
  IsShowModalDeativate: boolean;
  InfoModalDeactivate: any;
  IsShowModalSwitchAccount: boolean;
  drawerRightProfile: boolean;
  drawerValue?: any;
  IsLoadNotify: boolean;
  IsShowModalAddTaskWs: boolean;
  IsReloadWs: 0;
  IsShowModalViewFile: boolean;
  listViewFile: Array<any> | any;
  IsShowModalTransfer: boolean;
  IsShowModalChangeRole: boolean;
  listSearchAllRecent: Array<{ id: number; keyword: string }>;
  createOneToOne: boolean;
  infoSendTask: any;
  infoForwardTask: any;
  IsShowPopupEditContent: boolean;
  IsShowModalAddAllActionWs: boolean;
  IsShowModalAddMessage: boolean;
  IsShowModalCalendarTimetable: boolean;
}

export const useWorkspaceStore = defineStore({
  id: 'workspaceStore',
  state: () =>
    ({
      listWorkspace: [],
      listWorkspaceOwned: [],
      listWorkspaceInvites: [],
      detailWorkspace: null,
      IsShowModalInvite: false,
      listMemberWorkspace: [],
      IsShowModalProfile: false,
      IsShowModalInformation: false,
      IsShowModalActivate: false,
      IsShowModalDeativate: false,
      InfoModalDeactivate: null,
      IsShowModalSwitchAccount: false,
      drawerRightProfile: false,
      drawerValue: null,
      IsLoadNotify: false,
      IsShowModalAddTaskWs: false,
      IsShowModalViewFile: false,
      listViewFile: null,
      IsReloadWs: 0,
      IsShowModalTransfer: false,
      IsShowModalChangeRole: false,
      listSearchAllRecent: [],
      createOneToOne: false,
      infoSendTask: null,
      infoForwardTask: null,
      IsShowPopupEditContent: false,
      IsShowModalAddAllActionWs: false,
      IsShowModalAddMessage: false,
      IsShowModalCalendarTimetable: false,
    } as State),

  getters: {
    getListWorkspace: (state) => {
      return state.listWorkspace;
    },
    workspaceOwnerId: (state) => {
      return state.detailWorkspace?.owner?.id;
    },
    workspaceRole: (state) => {
      return state.detailWorkspace?.role;
    },
    workspaceRoleAdmin: (state) => {
      return state.detailWorkspace?.role === RoleWs['ADMIN'];
    },
    workspaceRoleOwner: (state) => {
      return state.detailWorkspace?.role === RoleWs['OWNER'];
    },
  },

  actions: {
    getAllWorkspace() {
      return new Promise((resolve, reject) => {
        WorkspaceService.getAllWorkspace()
          .then((res: any) => {
            console.log('res', res);
            if (res?.status_code === 200) {
              this.listWorkspace = res.data;
              resolve(this.listWorkspace);
            } else {
              reject(res.message);
            }
          })
          .catch((err) => {
            reject(err.message);
            NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    getAllWorkspaceOwned() {
      return new Promise((resolve, reject) => {
        WorkspaceService.getAllWorkspaceOwner()
          .then((res: any) => {
            console.log('res', res);
            if (res?.status_code === 200) {
              this.listWorkspaceOwned = res.data;
              resolve(this.listWorkspaceOwned);
            } else {
              reject(res.message);
            }
          })
          .catch((err) => {
            reject(err.message);
            NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    getAllWorkspaceInvites() {
      return new Promise((resolve, reject) => {
        WorkspaceService.getAllWorkspaceInvites()
          .then((res: any) => {
            console.log('res', res);
            if (res?.status_code === 200) {
              this.listWorkspaceInvites = res.data;
              resolve(this.listWorkspaceInvites);
            } else {
              reject(res.message);
            }
          })
          .catch((err) => {
            reject(err.message);
            NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    getMembers(searchMember?: string) {
      return new Promise((resolve, reject) => {
        const id = this?.router?.currentRoute?.value?.params?.workspaceId as string;
        if (!id) return false;
        WorkspaceService.findAllMemberWorkspace(`${id}`, {
          page: 1,
          page_size: 99999,
          search: searchMember || '',
        })
          .then((res: any) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    getDetailWorkspace(noToken?: boolean) {
      return new Promise((resolve, reject) => {
        const id = this?.router?.currentRoute?.value?.params?.workspaceId as string;
        if (!id) return false;
        WorkspaceService[noToken ? 'getDetailWorkspaceNoAuth' : 'getDetailWorkspace'](id)
          .then((res: any) => {
            if (res?.status_code === 200) {
              console.log('res', res);
              this.detailWorkspace = { ...res.data };
              this.listMemberWorkspace = res.data.members;
              resolve(this.detailWorkspace);
            } else {
              console.log(res);
              reject(res);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err.message);
            NotifyServices.showMessageError(`${err.message}`);
          });
      });
    },
    checkWorkspaceWithLogin() {
      this.getAllWorkspace().then((res) => {
        if (this.listWorkspace.length > 0) {
          // this?.router
          //   .push({
          //     name: 'list-workspace',
          //   })
          //   .then();
          location.replace(`${location.origin}/preview/list-workspace`);
        } else {
          // this?.router
          //   .push({
          //     name: 'home',
          //   })
          //   .then();
          location.replace(`${location.origin}`);
        }
      });
    },
    showModalInvite(boolean: boolean) {
      this.IsShowModalInvite = boolean;
    },
    showModalProfile(boolean: boolean) {
      this.IsShowModalProfile = boolean;
    },
    showModalInformation(boolean: boolean) {
      this.IsShowModalInformation = boolean;
    },

    showModalActivate(boolean: boolean, info?: any) {
      this.IsShowModalActivate = boolean;
      this.InfoModalDeactivate = info || null;
    },
    showModalDeativate(boolean: boolean, info?: any) {
      this.IsShowModalDeativate = boolean;
      this.InfoModalDeactivate = info || null;
    },

    showModalTransferAdmin(boolean: boolean, info?: any) {
      this.IsShowModalTransfer = boolean;
      this.InfoModalDeactivate = info || null;
    },
    showModalChangeRole(boolean: boolean, info?: any) {
      this.IsShowModalChangeRole = boolean;
      this.InfoModalDeactivate = info || null;
    },

    showModalSwitchAccount(boolean: boolean) {
      this.IsShowModalSwitchAccount = boolean;
    },
    showDrawerRightProfile(boolean: boolean) {
      this.drawerRightProfile = boolean;
    },

    showModalAddTask(boolean: boolean) {
      this.IsShowModalAddTaskWs = boolean;
    },
    setDrawerRightProfileValue(value: any) {
      this.drawerValue = value;
    },

    readNotify(workspaceId: string, session_id: string) {
      // console.log('this.detailWorkspace',this.detailWorkspace)
      // console.log('this?.router?.currentRoute?.value?.params?.workspaceId',this?.router?.currentRoute?.value?.params?.workspaceId)
      // let workspaceId = this.detailWorkspace?.id || this?.router?.currentRoute?.value?.params?.workspaceId
      console.log('workspaceId', workspaceId);
      return new Promise((resolve, reject) => {
        NotifyApiService.readNotify(Number(workspaceId), session_id).then((res: any) => {
          if (res?.status_code === 200) {
            this.IsLoadNotify = true;
            resolve(true);
          } else {
            NotifyServices.showMessageError(res?.errors.message);
            reject(false);
          }
        });
      });
    },
    setListViewFile(list: Array<any>) {
      this.listViewFile = [];
      list.map((item: any) => {
        const _file = checkFileType(item);
        const type = filename[_file.type];
        if (type === filename['Image']) {
          this.listViewFile.push(item);
        }
      });
      this.IsShowModalViewFile = true;
    },
    searchAllRecent() {
      return new Promise((resolve, reject) => {
        SearchService.searchAllRecent({
          workspace_id: Number(
            this?.router?.currentRoute?.value?.params?.workspaceId || 0,
          ),
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              this.listSearchAllRecent = res.data;
              resolve(true);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err.message);
          });
      });
    },

    pruneRecentSearch(ids: Array<string>) {
      console.log('pruneRecentSearch');
      return new Promise((resolve, reject) => {
        SearchService.pruneRecentSearch({
          workspace_id: Number(
            this?.router?.currentRoute?.value?.params?.workspaceId || 0,
          ),
          recent_search_ids: ids,
        })
          .then((res: any) => {
            if (res?.status_code === 200) {
              // this.listSearchAllRecent = res.data
              resolve(true);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            reject(err.message);
          });
      });
    },
  },
});
