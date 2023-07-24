import global from 'src/i18n/en/global.json';
import valid from 'src/i18n/en/valid.json';
import auth from 'src/i18n/en/auth.json';
import upload from 'src/i18n/en/upload.json';
import menuDetail from 'src/i18n/en/workspace/menuDetail.json';
import peoples from 'src/i18n/en/workspace/peoples.json';
import notify from 'src/i18n/en/workspace/notify.json';
import channel from 'src/i18n/en/workspace/channel.json';
import profile from 'src/i18n/en/workspace/profile.json';
import information from 'src/i18n/en/workspace/information.json';
import deativate from 'src/i18n/en/workspace/deativate.json';
import activate from 'src/i18n/en/workspace/activate.json';
import task from 'src/i18n/en/workspace/task.json';
import oneToOne from 'src/i18n/en/workspace/oneToOne.json';
import unread from 'src/i18n/en/workspace/unread.json';
import draft from 'src/i18n/en/workspace/draft.json';
import comment from 'src/i18n/en/workspace/comment.json';
import calendar from 'src/i18n/en/workspace/calendar.json';
import chart from 'src/i18n/en/workspace/chart.json';
import statistic from 'src/i18n/en/workspace/statistic.json';
import admin from 'src/i18n/en/workspace/admin.json';
import search from 'src/i18n/en/workspace/search.json';
import chat from 'src/i18n/en/workspace/chat.json';
import wiki from 'src/i18n/en/workspace/wiki.json';
import drawer from 'src/i18n/en/workspace/drawer.json';
import workspace from 'src/i18n/en/workspace/workspace.json';

export default {
  global: global,
  valid: valid,
  auth: auth,
  workspace: {
    menuDetail: { ...menuDetail },
    peoples: { ...peoples },
    notify: { ...notify },
    channel: { ...channel },
    profile: { ...profile },
    information: { ...information },
    deativate: { ...deativate },
    activate: { ...activate },
    task: { ...task },
    oneToOne: { ...oneToOne },
    unread: { ...unread },
    draft: { ...draft },
    comment: { ...comment },
    calendar: { ...calendar },
    chart: { ...chart },
    statistic: { ...statistic },
    admin: { ...admin },
    search: { ...search },
    chat: { ...chat },
    wiki: { ...wiki },
    drawer: { ...drawer },
    workspace: { ...workspace },
  },
  upload: upload,
};
