import { i18n } from 'boot/i18n';

const mapI18n = (path: string): string => {
  return i18n.global.t(`workspace.calendar.${path}`).toString();
};

export const ShareCalender = {
  PUBLIC: { label: mapI18n('roleCalender.public'), value: 'PUBLIC' },
  SHARE: { label: mapI18n('roleCalender.share'), value: 'SPECIFIC' },
  PRIVATE: {
    label: mapI18n('roleCalender.private'),
    value: 'PRIVATE',
  },
};
