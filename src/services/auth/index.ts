import { api, axiosNoAuth } from 'boot/axios';
import {
  bodyLogin,
  bodyLoginSocial,
  fcmToken,
  bodyRefreshToken,
  bodyRegister,
  bodyOtp,
} from 'src/services/auth/model';
import { getFcmToken } from 'src/helper/auth';
const auth = '/auth';
class AuthService {
  login(body: bodyLogin) {
    return axiosNoAuth.post(`${auth}/login`, {
      ...body,
      fcm_token: getFcmToken() || '',
    });
  }

  loginSocial(body: bodyLoginSocial) {
    return axiosNoAuth.post(`${auth}/social`, {
      ...body,
      fcm_token: getFcmToken() || '',
    });
  }

  refreshToken(body: bodyRefreshToken) {
    return axiosNoAuth.post(`${auth}/refresh-token`, body);
  }

  register(body: bodyRegister) {
    return axiosNoAuth.post(`${auth}/register`, {
      ...body,
      fcm_token: getFcmToken() || '',
    });
  }

  otp(body: bodyOtp) {
    return axiosNoAuth.post(`${auth}/otp`, body);
  }

  logout() {
    return api.post(`${auth}/logout`, {
      fcm_token: getFcmToken() || '',
    });
  }
}

export default new AuthService();
