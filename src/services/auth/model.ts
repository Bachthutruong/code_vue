export interface fcmToken {
  fcm_token?: string;
}

export interface bodyLogin extends fcmToken {
  email: string;
  otp: string;
}

export interface bodyLoginSocial extends fcmToken {
  access_token: string;
  type: string;
}

export interface bodyRefreshToken {
  refresh_token: string;
}

export interface bodyOtp {
  email: string;
  type: string; // SIGN_IN, SIGN_UP
}

export interface bodyRegister extends fcmToken {
  email: string;
  full_name: string;
  otp: string;
}
