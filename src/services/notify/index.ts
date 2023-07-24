import { api } from 'boot/axios';
import { sendTest, paramsNotify } from 'src/services/notify/model';

const notification = '/notification';

class NotifyApiService {
  sendTestNotify(body: sendTest) {
    return api.post(`${notification}/send-test`, body);
  }

  findAllNotify(params: paramsNotify) {
    return api.get(`${notification}`, {
      params,
    });
  }

  getCount(workspace_id: number | string) {
    return api.get(`${notification}/count/${workspace_id}`);
  }

  readNotify(workspace_id: number, session_id: string) {
    return api.post(`${notification}/read`, {
      workspace_id,
      session_id,
    });
  }

  readAll(workspace_id: number | string) {
    return api.post(`${notification}/read-all`, {
      workspace_id,
    });
  }
}

export default new NotifyApiService();
