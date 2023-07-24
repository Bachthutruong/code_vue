import { api, axiosNoAuth } from 'boot/axios';
import {
  bodyDeactivate,
  bodyInviteWorkspace,
  bodyJoinWorkspace,
  bodyRole,
  bodyWorkspace,
  changeRoleBody,
  paramsMember,
} from 'src/services/workspace/model';
const workspace = '/workspace';
const role = 'role';
class WorkspaceService {
  createWorkspace(body: bodyWorkspace) {
    return api.post(`${workspace}`, body);
  }

  getAllWorkspace() {
    return api.get(`${workspace}`);
  }

  getAllWorkspaceInvites() {
    return api.get(`${workspace}/invites`);
  }

  getDetailWorkspace(id: string) {
    return api.get(`${workspace}/${id}`);
  }
  getDetailWorkspaceNoAuth(id: string) {
    return axiosNoAuth.get(`${workspace}/${id}`);
  }

  findAllMemberWorkspace(id: string, params: paramsMember) {
    return api.get(`${workspace}/${id}/members`, {
      params,
    });
  }
  findShareInviteWorkspace(id: string) {
    return api.get(`${workspace}/${id}/share-invite`);
  }

  editWorkspace(id: string, body: bodyWorkspace) {
    return api.put(`${workspace}/${id}`, body);
  }

  inviteWorkspace(body: bodyInviteWorkspace) {
    return api.post(`${workspace}/invite`, body);
  }

  joinWorkspace(body: bodyJoinWorkspace) {
    return api.post(`${workspace}/join`, body);
  }

  deactivateMember(body: bodyDeactivate) {
    return api.post(`${workspace}/deactivate`, body);
  }

  activateMember(body: bodyDeactivate) {
    return api.post(`${workspace}/activate`, body);
  }
  getAllWorkspaceOwner() {
    return api.get(`${workspace}/owned`);
  }

  //    role
  transferAdmin(body: bodyRole) {
    return api.post(`${workspace}/${role}/transfer-admin`, body);
  }

  changeRole(body: changeRoleBody) {
    return api.post(`${workspace}/${role}/change`, body);
  }
}

export default new WorkspaceService();
