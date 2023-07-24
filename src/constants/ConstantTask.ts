import { i18n } from 'boot/i18n';

const mapI18n = (path: string): string => {
  return i18n.global.t(`workspace.channel.modalTaskChannel.${path}`).toString();
};

export const ListStatusTask = {
  INDUE: {
    text: mapI18n('indueTask'),
    class: 'indue-task',
  },
  CANCEL: {
    text: mapI18n('cancelTask'),
    class: 'cancel-task',
  },
  DONE: {
    text: mapI18n('doneTask'),
    class: 'done-task',
  },
  OVERDUE: {
    text: mapI18n('overdueTask'),
    class: 'overdue-task',
  },
};

export interface typeRepeat {
  label: string;
  type: 'NONE' | 'WEEKDAY' | 'WEEKEND' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
}

// export enum TaskRepeatType {
//   NONE = 'NONE',
//   WEEKDAY = 'WEEKDAY',
//   WEEKEND = 'WEEKEND',
//   DAILY = 'DAILY',
//   WEEKLY = 'WEEKLY',
//   MONTHLY = 'MONTHLY',
// }
export const listRepeat: Array<typeRepeat> = [
  {
    label: mapI18n('none'),
    type: 'NONE',
  },
  {
    label: mapI18n('weekday'),
    type: 'WEEKDAY',
  },
  {
    label: mapI18n('weekend'),
    type: 'WEEKEND',
  },
  {
    label: mapI18n('daily'),
    type: 'DAILY',
  },
  {
    label: mapI18n('weekly'),
    type: 'WEEKLY',
  },
  {
    label: mapI18n('monthly'),
    type: 'MONTHLY',
  },
];
