importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');
const config = {
  apiKey: 'AIzaSyDRhnn2US1qsJFviDHWIytnswB8bRqbe_M',
  authDomain: 't-message-e4e09.firebaseapp.com',
  projectId: 't-message-e4e09',
  storageBucket: 't-message-e4e09.appspot.com',
  messagingSenderId: '503680745865',
  appId: '1:503680745865:web:5c9098a54701b7f158a158',
  measurementId: 'G-PEFZ3M51T8',
};

firebase.initializeApp(config);
// const messaging = firebase.messaging();
const isSupported = firebase.messaging.isSupported();
console.log('isSupported', isSupported);
let message = null;

const wsRouter = 'workspace';
const notifyType = {
  NEW_TASK: 'NEW_TASK',
  EDIT_TASK: 'EDIT_TASK',
  REMIND_DUE_TASK: 'REMIND_DUE_TASK',
  REACT_COMMENT: 'REACT_COMMENT',
  MARK_DONE_TASK: 'MARK_DONE_TASK',
  MARK_CANCEL_TASK: 'MARK_CANCEL_TASK',

  //  Comment task
  NEW_COMMENT: 'NEW_COMMENT',
  REPLY_COMMENT: 'REPLY_COMMENT',
  REMOVE_CHANNEL: 'REMOVE_CHANNEL',
  MENTION_COMMENT: 'MENTION_COMMENT',
  JOIN_CHANNEL: 'JOIN_CHANNEL',
  //    chat
  NEW_MESSAGE: 'NEW_MESSAGE',
  REPLY_MESSAGE: 'REPLY_MESSAGE',
  FORWARD_MESSAGE: 'FORWARD_MESSAGE',
  PIN_MESSAGE: 'PIN_MESSAGE',
  REACT_MESSAGE: 'REACT_MESSAGE',
  MENTION_MESSAGE: 'MENTION_MESSAGE',
  //  poll vote
  NEW_POLL: 'NEW_POLL',
  VOTE_POLL: 'VOTE_POLL',

  //  wiki
  NEW_WIKI: 'NEW_WIKI',
  EDIT_WIKI: 'EDIT_WIKI',
  DELETE_WIKI: 'DELETE_WIKI',
  //  Comment wiki
  NEW_COMMENT_WIKI: 'NEW_COMMENT_WIKI',
  REACT_COMMENT_WIKI: 'REACT_COMMENT_WIKI',
  REPLY_COMMENT_WIKI: 'REPLY_COMMENT_WIKI',
  MENTION_COMMENT_WIKI: 'MENTION_COMMENT_WIKI',
};

const typeToTaskDetail = [
  notifyType['NEW_TASK'],
  notifyType['EDIT_TASK'],
  notifyType['REMIND_DUE_TASK'],
  notifyType['MARK_DONE_TASK'],
  notifyType['MARK_CANCEL_TASK'],
];
const typeToTaskDetailComment = [
  notifyType['NEW_COMMENT'],
  notifyType['REPLY_COMMENT'],
  notifyType['REACT_COMMENT'],
  notifyType['MENTION_COMMENT'],
];

const typeToChat = [
  notifyType['NEW_MESSAGE'],
  notifyType['REPLY_MESSAGE'],
  notifyType['FORWARD_MESSAGE'],
  notifyType['PIN_MESSAGE'],
  notifyType['REACT_MESSAGE'],
  notifyType['MENTION_MESSAGE'],
  notifyType['NEW_POLL'],
  notifyType['VOTE_POLL'],
];

const typeToWikiDetail = [
  notifyType['NEW_WIKI'],
  notifyType['EDIT_WIKI'],
  notifyType['DELETE_WIKI'],
];
const typeToWikiDetailComment = [
  notifyType['NEW_COMMENT_WIKI'],
  notifyType['REACT_COMMENT_WIKI'],
  notifyType['REPLY_COMMENT_WIKI'],
  notifyType['MENTION_COMMENT_WIKI'],
];

self.addEventListener('notificationclick', function (event) {
  const url = location.origin;
  if (!message) return url;
  const dataNotify = message.data;
  const typeNotify = dataNotify?.type;

  const channelType = dataNotify?.channel_type;
  //if (['GENERAL', 'MANUAL', 'ONE_TO_ONE]
  let path = dataNotify?.workspace_id ? `${wsRouter}/${dataNotify?.workspace_id}` : '';
  let query = '?';
  if (['GENERAL', 'MANUAL'].includes(channelType)) {
    path = `${path}/C${dataNotify.channel_id}`;
  }
  if (['ONE_TO_ONE'].includes(channelType)) {
    path = `${path}/D${dataNotify.channel_id}`;
  }
  if ([...typeToTaskDetailComment, ...typeToTaskDetail].includes(typeNotify)) {
    path = `${path}/task`;
  }
  if (typeToTaskDetail.includes(typeNotify)) {
    query = `${query}taskId=${dataNotify.task_id}`;
  }

  if (typeToTaskDetailComment.includes(typeNotify)) {
    query = `${query}taskId=${dataNotify.task_id}&commentId=${dataNotify.comment_id}`;
  }

  if (typeToWikiDetail.includes(typeNotify)) {
    query = `${query}wikiId=${dataNotify.wiki_id}`;
  }

  if (typeToWikiDetailComment.includes(typeNotify)) {
    query = `${query}wikiId=${dataNotify.wiki_id}&commentId=${dataNotify.comment_id}`;
  }

  if ([...typeToWikiDetail, ...typeToWikiDetailComment].includes(typeNotify)) {
    path = `${path}/wiki`;
  }

  if (typeToChat.includes(typeNotify)) {
    path = `${path}/chat`;
    query = `${query}chatId=${dataNotify.chat_id}`;
  }

  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        let client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(`${url}/${path}${query}`);
      }
    }),
  );
});

if (isSupported) {
  const messaging = firebase.messaging();
  const channel = new BroadcastChannel('background-message-channel');
  messaging.onBackgroundMessage((res) => {
    message = { ...res };
    channel.postMessage(res);
    const checkNotify = !!notifyType[res?.data?.type];
    if (!checkNotify) return;
    self.registration.showNotification(res.notification.title, {
      body: !['REACT_COMMENT', 'REACT_COMMENT_WIKI'].includes(res?.data?.type)
        ? res.notification.body
        : '',
      icon: 'logo-beta.svg',
    });
  });
}
