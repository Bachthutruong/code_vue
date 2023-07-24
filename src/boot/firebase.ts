import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getFcmToken, setFcmToken, removeFcmToken, isLogged } from 'src/helper/auth';
import { boot } from 'quasar/wrappers';

const firebaseConfig: any = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PR_ID,
  storageBucket: process.env.VUE_APP_STORE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESS_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_MEASUREMENT_ID,
};
console.log('firebaseConfig', firebaseConfig);
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const channel = new BroadcastChannel('background-message-channel');
onMessage(messaging, function (payload: any) {
  console.log('onMessage', payload);
  channel.postMessage(payload);
});

function requestPermission() {
  return new Promise((resolve, reject) => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        resolve(true);
      } else {
        removeFcmToken();
        reject(false);
      }
    });
  });
}

function getFcmFirebaseToken() {
  console.log('getFcmFirebaseToken');
  getToken(messaging, {
    vapidKey: process.env.VUE_APP_VAPID_KEY,
  })
    .then((token: string) => {
      console.log(token);
      setFcmToken(token);
      return token;
    })
    .catch(function (reason: any) {
      console.log(reason);
    });
}

async function InitializeFireBaseMessaging() {
  // await deleteToken(messaging)
  // await removeFcmToken()
  const getTokenFcm = await getFcmToken();
  if ('serviceWorker' in navigator) {
    const permission = await requestPermission();
    console.log('permission', permission);
    console.log('getTokenFcm', getTokenFcm);
    console.log('isLogged', isLogged());
    if (!permission || !!getTokenFcm || !isLogged()) {
      return;
    }
    getFcmFirebaseToken();
  }
}

export default boot(({ app, router, redirect, store }) => {
  InitializeFireBaseMessaging().then();
});
export { firebaseConfig, InitializeFireBaseMessaging };
