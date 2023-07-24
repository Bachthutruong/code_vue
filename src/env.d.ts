/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    ENVIRONMENT: string | undefined;
    VUE_APP_API_BASE_URL: string | undefined;
    // firebase
    VUE_APP_API_KEY: string | undefined;
    VUE_APP_AUTH_DOMAIN: string | undefined;
    VUE_APP_PR_ID: string | undefined;
    VUE_APP_STORE_BUCKET: string | undefined;
    VUE_APP_MESS_SENDER_ID: string | undefined;
    VUE_APP_FIREBASE_APP_ID: string | undefined;
    VUE_APP_MEASUREMENT_ID: string | undefined;
    VUE_APP_VAPID_KEY: string | undefined;
    // ls base64
    VUE_APP_LS: string | undefined;
    // text valid
    VUE_APP_COUNT_DESC_TASK: string | number;
    //  constant
    VUE_APP_TITLE: string;
  }
}
