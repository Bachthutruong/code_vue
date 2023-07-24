import { i18n } from 'boot/i18n';
import { formNotify } from 'src/interface/notify';
import { setActivePinia, createPinia } from 'pinia';
import { useWorkspaceStore } from 'stores/workspace';

setActivePinia(createPinia());
const workSpaceStore = useWorkspaceStore();

export const notifyType = {
  NEW_TASK: 'NEW_TASK',
  EDIT_TASK: 'EDIT_TASK',
  REMIND_DUE_TASK: 'REMIND_DUE_TASK',
  REACT_COMMENT: 'REACT_COMMENT',
  MARK_DONE_TASK: 'MARK_DONE_TASK',
  MARK_CANCEL_TASK: 'MARK_CANCEL_TASK',
  REMINDER_TASK: 'REMINDER_TASK',

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
} as any;
export const typeToTaskDetail = [
  notifyType['NEW_TASK'],
  notifyType['EDIT_TASK'],
  notifyType['REMIND_DUE_TASK'],
  notifyType['REMINDER_TASK'],
];
export const typeToTaskDetailComment = [
  notifyType['NEW_COMMENT'],
  notifyType['REPLY_COMMENT'],
  notifyType['REACT_COMMENT'],
  notifyType['MENTION_COMMENT'],
  notifyType['MARK_DONE_TASK'],
  notifyType['MARK_CANCEL_TASK'],
];

export const typeToChat = [
  notifyType['NEW_MESSAGE'],
  notifyType['REPLY_MESSAGE'],
  notifyType['FORWARD_MESSAGE'],
  notifyType['PIN_MESSAGE'],
  notifyType['REACT_MESSAGE'],
  notifyType['MENTION_MESSAGE'],
  notifyType['NEW_POLL'],
  notifyType['VOTE_POLL'],
];

export const typeToWikiDetail = [
  notifyType['NEW_WIKI'],
  notifyType['EDIT_WIKI'],
  notifyType['DELETE_WIKI'],
];
export const typeToWikiDetailComment = [
  notifyType['NEW_COMMENT_WIKI'],
  notifyType['REACT_COMMENT_WIKI'],
  notifyType['REPLY_COMMENT_WIKI'],
  notifyType['MENTION_COMMENT_WIKI'],
];

export function redirectNotify(payload: any) {
  const url = location.origin;
  if (!payload) return url;
  const dataNotify = payload.data;
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

  if ([...typeToWikiDetail, ...typeToWikiDetailComment].includes(typeNotify)) {
    path = `${path}/wiki`;
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

  if (typeToChat.includes(typeNotify)) {
    path = `${path}/chat`;
    if (typeNotify === notifyType['VOTE_POLL']) {
      query = `${query}pollId=${dataNotify.poll_id}`;
    } else {
      query = `${query}chatId=${dataNotify.chat_id}`;
    }
  }
  return `${url}/${path}${query}`;
}

const mapI18n = (path: string, params?: any): string => {
  return i18n.global.t(`workspace.notify.global.${path}`, params).toString();
};

export const wsRouter = 'workspace';
export const AboutTabFieldName = {
  newTask: mapI18n('newTask'),
  owner: mapI18n('owner'),
  editTask: mapI18n('editTask'),
  reminder: mapI18n('reminder'),
  reminderSchedule: mapI18n('reminderSchedule'),
  liked: mapI18n('liked'),
  markDone: mapI18n('markDone'),
  markCancel: mapI18n('markCancel'),
  replyComment: mapI18n('replyComment'),
  comment: mapI18n('comment'),
  removeChannel: mapI18n('removeChannel'),
  joinChannel: mapI18n('joinChannel'),
  mentioned: mapI18n('mentioned'),
  //  wiki
  newWiki: mapI18n('newWiki'),
  editWiki: mapI18n('editWiki'),
  deleteWiki: mapI18n('deleteWiki'),
  commentWiki: mapI18n('commentWiki'),
  replyCommentWiki: mapI18n('replyCommentWiki'),
  reactedCommentWiki: mapI18n('reactedCommentWiki'),
  mentionedCommentWiki: mapI18n('mentionedCommentWiki'),
};

export const AboutTabFieldNameChat = (params?: any) => {
  return {
    [notifyType['REPLY_MESSAGE']]: {
      lastContent: mapI18n('replyMessage', params),
    },
    [notifyType['PIN_MESSAGE']]: {
      lastContent: mapI18n('pinMessage', params),
    },
    [notifyType['REACT_MESSAGE']]: {
      lastContent: mapI18n('reactMessage', params),
    },
    [notifyType['MENTION_MESSAGE']]: {
      lastContent: mapI18n('mentionMessage', params),
    },
    [notifyType['NEW_POLL']]: {
      lastContent: mapI18n('newPoll', params),
    },
    [notifyType['VOTE_POLL']]: {
      lastContent: mapI18n('newVoted'),
    },
  };
};

const formatNotifyForChat = (payload: any) => {
  const dataNotify = payload.data as any;
  const channelType = dataNotify?.channel_type;
  const fieldName = AboutTabFieldNameChat(
    ['ONE_TO_ONE'].includes(channelType) ? 2 : 1,
  ) as any;
  let form = {
    id: dataNotify.session_id,
    title: {
      ...fieldName?.[dataNotify?.type],
      name: dataNotify?.name || '',
      project: !['ONE_TO_ONE'].includes(channelType) ? dataNotify?.channel_name : '',
    },
    content: dataNotify.type !== notifyType['REACT_MESSAGE'] ? dataNotify?.content : '',
    show: true,
    type: dataNotify.type,
    action: () => {
      workSpaceStore.readNotify(dataNotify.workspace_id, dataNotify?.session_id).then();
      window && window.open(redirectNotify(payload), '_blank');
    },
    other: dataNotify,
  } as formNotify;

  if (form.type === notifyType['NEW_MESSAGE']) {
    if (dataNotify.is_no_content === 'false') {
      form = {
        ...form,
        title: {
          ...form.title,
          lastContent: mapI18n(
            'newMessage',
            ['ONE_TO_ONE'].includes(channelType) ? 2 : 1,
          ),
        },
      };
    } else {
      form = {
        ...form,
        title: {
          ...form.title,
          lastContent: mapI18n(
            'newMessageFile',
            ['ONE_TO_ONE'].includes(channelType) ? 2 : 1,
          ),
        },
      };
    }
  }
  if (form.type === notifyType['FORWARD_MESSAGE']) {
    form = {
      ...form,
      title: {
        ...form.title,
        project: ['ONE_TO_ONE'].includes(channelType) ? '' : dataNotify?.channel_name,
        lastContent: mapI18n(
          ['ONE_TO_ONE'].includes(channelType) ? 'forwardMessageToYou' : 'forwardMessage',
          dataNotify.is_no_content === 'true' ? 2 : 1,
        ),
      },
    };
    console.log('form', form);
  }
  if (form.type === notifyType['VOTE_POLL']) {
    form = {
      ...form,
      title: {
        ...form.title,
        lastContent: `${form.title.lastContent} "${
          dataNotify?.poll_title || ''
        }" ${mapI18n('from')}`,
      },
      content: '',
    };
  }
  return form;
};

export function formatNotify(payload: any) {
  const dataNotify = payload.data;
  if (typeToChat.includes(dataNotify.type)) {
    return formatNotifyForChat(payload);
  }
  let form = {} as any;
  const channelType = dataNotify?.channel_type;
  form = {
    id: dataNotify.session_id,
    title: {
      ...typeNotify[dataNotify.type],
      name: dataNotify?.name || '',
      project: dataNotify?.channel_name || '',
      date: dataNotify?.date || '',
    },
    content: !['REACT_COMMENT', 'REACT_COMMENT_WIKI'].includes(dataNotify.type)
      ? dataNotify?.content
      : '',
    show: true,
    type: dataNotify.type,
    action: () => {
      workSpaceStore.readNotify(dataNotify.workspace_id, dataNotify?.session_id).then();
      window && window.open(redirectNotify(payload), '_blank');
    },
    other: dataNotify,
  } as formNotify;
  if (dataNotify.type === notifyType['NEW_TASK']) {
    const nameChannel = `${dataNotify?.channel_name}`;
    // if (['GENERAL', 'MANUAL'].includes(channelType)) {
    //   nameChannel = `${dataNotify?.channel_name}` || '';
    // }
    // if (['ONE_TO_ONE'].includes(channelType)) {
    //   nameChannel = `${dataNotify?.channel_name}` || '';
    // }
    form = {
      ...form,
      title: {
        ...form.title,
        project: '',
        name: nameChannel || '',
      },
    };
  }

  if (dataNotify.type === notifyType['REMIND_DUE_TASK']) {
    form = {
      ...form,
      title: {
        ...form.title,
        project: '',
      },
    };
  }
  if (dataNotify.type === notifyType['REMINDER_TASK']) {
    form = {
      ...form,
      title: {
        ...form.title,
        date: '',
      },
    };
  }

  if (dataNotify.type === notifyType['EDIT_TASK']) {
    form = {
      ...form,
      title: {
        ...form.title,
        name: dataNotify?.name || dataNotify?.first_content || '',
      },
    };
  }
  return form;
}

export const typeNotify = {
  [notifyType['NEW_TASK']]: {
    firstContent: AboutTabFieldName.newTask,
  },
  [notifyType['EDIT_TASK']]: {
    lastContent: AboutTabFieldName.editTask,
  },
  [notifyType['REMIND_DUE_TASK']]: {
    firstContent: AboutTabFieldName.reminder,
  },
  [notifyType['REMINDER_TASK']]: {
    firstContent: AboutTabFieldName.reminderSchedule,
  },
  [notifyType['REACT_COMMENT']]: {
    lastContent: AboutTabFieldName.liked,
  },
  [notifyType['MARK_DONE_TASK']]: {
    lastContent: AboutTabFieldName.markDone,
  },
  [notifyType['MARK_CANCEL_TASK']]: {
    lastContent: AboutTabFieldName.markCancel,
  },

  [notifyType['NEW_COMMENT']]: {
    lastContent: AboutTabFieldName.comment,
  },
  [notifyType['REPLY_COMMENT']]: {
    lastContent: AboutTabFieldName.replyComment,
  },
  [notifyType['MENTION_COMMENT']]: {
    firstContent: AboutTabFieldName.mentioned,
  },
  [notifyType['REMOVE_CHANNEL']]: {
    lastContent: AboutTabFieldName.removeChannel,
  },
  [notifyType['JOIN_CHANNEL']]: {
    lastContent: AboutTabFieldName.joinChannel,
  },

  //  wiki

  [notifyType['NEW_WIKI']]: {
    lastContent: AboutTabFieldName.newWiki,
  },
  [notifyType['EDIT_WIKI']]: {
    lastContent: AboutTabFieldName.editWiki,
  },
  [notifyType['DELETE_WIKI']]: {
    lastContent: AboutTabFieldName.deleteWiki,
  },
  [notifyType['NEW_COMMENT_WIKI']]: {
    lastContent: AboutTabFieldName.commentWiki,
  },
  [notifyType['REPLY_COMMENT_WIKI']]: {
    lastContent: AboutTabFieldName.replyCommentWiki,
  },
  [notifyType['REACT_COMMENT_WIKI']]: {
    lastContent: AboutTabFieldName.reactedCommentWiki,
  },
  [notifyType['MENTION_COMMENT_WIKI']]: {
    firstContent: AboutTabFieldName.mentionedCommentWiki,
  },
} as any;
