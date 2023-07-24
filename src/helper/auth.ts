import { KEY_ACCESS_TOKEN, KEY_FCM_TOKEN, KEY_LIST_ACCOUNT } from 'src/constants';
import UserService from 'src/services/user';
import SecureLS from 'secure-ls';
const ls = new SecureLS({
  encodingType: 'aes',
  encryptionSecret: process.env.VUE_APP_LS,
});
export function getToken() {
  if (!localStorage) return false;
  if (KEY_ACCESS_TOKEN in localStorage) {
    return JSON.parse(`${localStorage.getItem(KEY_ACCESS_TOKEN) || {}}`);
  }
  return false;
}

export function setToken(data: string) {
  if (!localStorage) return;
  if (!data) {
    removeToken();
  }
  localStorage.setItem(KEY_ACCESS_TOKEN, data || '');
}

export function removeFcmToken() {
  if (!localStorage) return;
  localStorage.removeItem(KEY_FCM_TOKEN);
}

export function getFcmToken() {
  if (!localStorage) return false;
  if (KEY_FCM_TOKEN in localStorage) {
    return localStorage.getItem(KEY_FCM_TOKEN) || '';
  }
  return false;
}

export function setFcmToken(data: string) {
  if (!localStorage) return;
  if (!data) {
    removeFcmToken();
  }
  localStorage.setItem(KEY_FCM_TOKEN, data);
  if (isLogged()) {
    UserService.updateFcmToken(data).then((res) => {
      console.log(res);
    });
  }
}

export function removeToken() {
  if (!localStorage) return;
  localStorage.removeItem(KEY_ACCESS_TOKEN);
}

export function isLogged() {
  return !!getToken();
}

export function returnLogin(context: any) {
  context.router.push({
    name: 'login',
    query: {
      urlPath: context.urlPath,
    },
  });
}

export function gotoUrlPath(context: any) {
  if (context.urlPath) {
    context.router.push(context.urlPath);
  }
}

export function getListUser() {
  if (!localStorage) return false;
  return ls.get(KEY_LIST_ACCOUNT) || false;
}

export function setListUser(data: any) {
  if (!localStorage) return;
  const listUser = getListUser() as any;
  console.log('listUser', listUser);
  const token = getToken() as any;
  const dataUser = {
    ...listUser?.data,
  } as any;
  dataUser[data.id] = {
    ...data,
    token,
  };
  ls.set(KEY_LIST_ACCOUNT, {
    data: { ...dataUser },
  });

  console.log('getListUser()', getListUser());
}

export function removeListUser() {
  if (!localStorage) return;
  ls.remove(KEY_LIST_ACCOUNT);
}
