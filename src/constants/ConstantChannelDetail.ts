import { TypeFieldEdit } from 'src/model/ChannelDetail';
import { TypeRule } from 'src/model/Global';
import { mapI18nRule } from 'src/helper/global';
import { i18n } from 'boot/i18n';

const mapI18n = (path: string): string => {
  return i18n.global.t(`workspace.channel.modalChannelDetail.${path}`).toString();
};

export const AboutTabFieldName = {
  name: mapI18n('aboutTab.field.name'),
  topic: mapI18n('aboutTab.field.topic'),
  description: mapI18n('aboutTab.field.description'),
  createdBy: mapI18n('aboutTab.field.createdBy'),
  files: mapI18n('aboutTab.field.files'),
};

export const RuleMaxLengthField = {
  name: 80,
  topic: 250,
  description: 250,
};

export const RulesEditField: Record<TypeFieldEdit, TypeRule[]> = {
  name: [
    (val: string) => !!val || mapI18nRule('require', [mapI18n('aboutTab.field.name')]),
    (val: string) =>
      val.length <= RuleMaxLengthField.name ||
      mapI18nRule('maxLength', [AboutTabFieldName.name, RuleMaxLengthField.name]),
  ],
  topic: [
    (val: string) => !!val || mapI18nRule('require', [mapI18n('aboutTab.field.topic')]),
  ],
  description: [
    (val: string) =>
      !!val || mapI18nRule('require', [mapI18n('aboutTab.field.description')]),
  ],
};

export const RoleTabFieldName = {
  AddOrRemoveUsers: mapI18n('roleTab.field.AddOrRemoveUsers'),
  creatChat: mapI18n('roleTab.field.creatChat'),
  createTask: mapI18n('roleTab.field.createTask'),
  createWiki: mapI18n('roleTab.field.createWiki'),
  pinChat: mapI18n('roleTab.field.pinChat'),
  pinTask: mapI18n('roleTab.field.pinTask'),
};

export const RoleChannel = {
  EVERYONE: { label: mapI18n('roleChannel.everyone'), value: 'EVERYONE' },
  ADMIN: { label: mapI18n('roleChannel.wsAdminAndChannelOwner'), value: 'ADMIN' },
  SPECIFIC: {
    label: mapI18n('roleChannel.wsAdminAndChannelOwnerAndPeople'),
    value: 'SPECIFIC',
  },
};

export const ChannelRoleName = {
  ADD_REMOVE_MEMBER: 'ADD_REMOVE_MEMBER',
  CREATE_TASK: 'CREATE_TASK',
  CREATE_CHAT: 'CREATE_CHAT',
  CREATE_WIKI: 'CREATE_WIKI',
  PIN_TASK: 'PIN_TASK',
  PIN_CHAT: 'PIN_CHAT',
};

export const ChannelRoleFiledName = {
  ADD_REMOVE_MEMBER: 'AddOrRemoveUsers',
  CREATE_TASK: 'createTask',
  CREATE_CHAT: 'creatChat',
  CREATE_WIKI: 'createWiki',
  PIN_TASK: 'pinTask',
  PIN_CHAT: 'pinChat',
};
