export type TypeRule = ((arg0: string) => boolean | string) | string;

export type TypeRuleMessage = 'require' | 'maxLength';

export type TypeMessageGlobal =
  | 'updateSuccess'
  | 'updateFail'
  | 'confirmRemove'
  | 'removeSuccess';

export interface IOwner {
  id: number;
  full_name: string;
}

export interface IAvatar {
  url: string;
}

export interface IMember extends IOwner {
  avatar: IAvatar;
  email: string;
}
