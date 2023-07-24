import { i18n } from 'boot/i18n';

const mapI18n = (path: string): string => {
  return i18n.global.t(`workspace.channel.headerFilterChannel.${path}`).toString();
};
interface typePriority {
  label: string;
  type: string;
  value: string;
}

interface typeReadTask {
  label: string;
  value: string;
}
export const ListPriority: Array<typePriority> = [
  {
    value: 'HIGH',
    type: 'high',
    label: mapI18n('high'),
  },
  {
    value: 'MEDIUM',
    type: 'medium',
    label: mapI18n('medium'),
  },
  {
    value: 'LOW',
    type: 'low',
    label: mapI18n('low'),
  },
];

export const ListReadTask: Array<typeReadTask> = [
  {
    value: 'UNREAD',
    label: mapI18n('unreadTask'),
  },
  {
    value: 'READ',
    label: mapI18n('readTask'),
  },
];
