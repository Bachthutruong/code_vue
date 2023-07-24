import { api } from 'boot/axios';
import {
  bodyAddMember,
  bodyArrangeChannel,
  bodyChannel,
  bodyCreateOneToOne,
  bodyMuteChannel,
  bodySetRole,
  bodyUpdateChannel,
  channelId,
  paramsFiles,
  paramsMember,
} from 'src/services/channel/model';
const channel = '/channel';

class ChannelService {
  createChannel(body: bodyChannel) {
    return api.post(`${channel}`, body);
  }

  getAllChannel(workspaceId: string) {
    return api.get(`${channel}/joined/${workspaceId}`);
  }

  getSideBar(workspaceId: string) {
    return api.get(`/sidebar/${workspaceId}`);
  }

  getDetailChannel(id: string) {
    return api.get(`${channel}/${id}`);
  }

  editChannel(id: string, body: bodyUpdateChannel) {
    return api.put(`${channel}/${id}`, body);
  }

  findAllFileChannel(id: string, params: paramsFiles) {
    return api.get(`${channel}/${id}/files`, {
      params,
    });
  }

  findAllMemberChannel(id: string, params: paramsMember) {
    return api.get(`${channel}/${id}/members`, {
      params,
    });
  }

  addMemberChannel(body: bodyAddMember) {
    return api.post(`${channel}/add-member`, body);
  }

  removeMemberChannel(body: bodyAddMember) {
    return api.post(`${channel}/remove-member`, body);
  }

  leaveChannel(body: channelId) {
    return api.post(`${channel}/leave`, body);
  }

  muteChannel(body: bodyMuteChannel) {
    return api.post(`${channel}/mute`, body);
  }

  createChannelOneToOne(body: bodyCreateOneToOne) {
    return api.post(`${channel}/one-to-one`, body);
  }

  closeChannelOnoToOne(body: channelId) {
    return api.post(`${channel}/one-to-one/close`, body);
  }

  getFilesInChannel(id: string | number, params: paramsFiles) {
    return api.get(`${channel}/${id}/files`, {
      params,
    });
  }

  //    role
  getRoleChannel(id: string) {
    return api.get(`${channel}/${id}/roles`);
  }

  getDetailOneRoleChannel(channelId: string, roleId: string) {
    return api.get(`${channel}/${channelId}/roles/${roleId}`);
  }

  setDetailOneRoleChannel(channelId: string, roleId: string, body: bodySetRole) {
    return api.put(`${channel}/${channelId}/roles/${roleId}`, body);
  }

  arrangeChannel(body: bodyArrangeChannel) {
    return api.post(`${channel}/arrange`, body);
  }
}
// @ts-ignore
export default new ChannelService();
