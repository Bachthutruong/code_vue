import { api } from 'boot/axios';
import { bodyProfile, uploadAvatar } from 'src/services/user/model';
const user = '/user';
class UserService {
  profile() {
    return api.get(`${user}/profile`);
  }

  editProfile(body: bodyProfile) {
    return api.put(`${user}/profile`, body);
  }

  editAvatarProfile(body: uploadAvatar) {
    return api.post(`${user}/avatar`, body);
  }

  updateFcmToken(fcm_token: string) {
    return api.put(`${user}/fcm-token`, {
      fcm_token,
    });
  }
}

export default new UserService();
