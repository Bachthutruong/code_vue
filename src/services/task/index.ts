import { api } from 'boot/axios';
import {
  bodyTask,
  bodyUpdateTask,
  paramsTaskActive,
  paramsTask,
  setFlag,
  markReadTask,
  markTask,
  deleteDraft,
  typeMark,
  setMuteTask,
  bodyTaskOneToOne,
  bodyPinTask,
  bodyReminder,
} from 'src/services/task/model';
import { paramsMember } from 'src/services/channel/model';

const task = '/task';
import qs from 'qs';
class TaskService {
  createTask(body: bodyTask) {
    return api.post(`${task}`, body);
  }

  createTaskOneToOne(body: bodyTaskOneToOne) {
    return api.post(`${task}/one-to-one`, body);
  }

  getAllTask(params: paramsTask) {
    return api.get(`${task}`, {
      params,
      paramsSerializer(params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    });
  }

  getDetailTask(id: string) {
    return api.get(`${task}/${id}`);
  }

  editTask(id: string, body: bodyUpdateTask) {
    return api.put(`${task}/${id}`, body);
  }

  deleteTask(id: string) {
    return api.delete(`${task}/${id}`);
  }
  deleteDraft(body: deleteDraft) {
    return api.post(`${task}/prune-draft`, body);
  }

  deleteScheduled(body: deleteDraft) {
    return api.post(`${task}/prune-schedule`, body);
  }
  getAllActiveTask(id: string, params: paramsTaskActive) {
    return api.get(`${task}/${id}/activities`, {
      params,
    });
  }

  getMemberTask(id: string, params: paramsMember) {
    return api.get(`${task}/${id}/members`, {
      params,
    });
  }

  getCountUnreadTask(workspace_id: string) {
    return api.get(`${task}/${workspace_id}/count-unread`);
  }

  setFlagTask(body: setFlag) {
    return api.post(`${task}/flag`, body);
  }

  markReadTask(body: markReadTask) {
    return api.post(`${task}/read`, body);
  }

  markTask(body: markTask) {
    return api.post(`${task}/mark`, body);
  }
  unmarkTask(body: typeMark) {
    return api.post(`${task}/unmark`, body);
  }

  muteCommentTask(body: setMuteTask) {
    return api.post(`${task}/mute-comment`, body);
  }

  pinTask(body: bodyPinTask) {
    return api.post(`${task}/pin`, body);
  }

  unpinTask(body: bodyPinTask) {
    return api.post(`${task}/unpin`, body);
  }

  setReminderTask(body: bodyReminder) {
    return api.post(`${task}/set-reminder`, body);
  }
}

export default new TaskService();
