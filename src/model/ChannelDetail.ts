import { IAvatar, IOwner } from 'src/model/Global';

export type TypeFieldEdit = 'name' | 'topic' | 'description';
export type TypeFieldEditRole = 'EVERYONE' | 'SPECIFIC' | 'ADMIN';
export type TypeFieldRole =
  | 'AddOrRemoveUsers'
  | 'creatChat'
  | 'createTask'
  | 'createWiki'
  | 'pinChat'
  | 'pinTask';

export interface IChannel {
  id: number;
  name: string;
  alias: string;
  topic: string;
  description: string;
  search_name: string;
  type: string;
  is_private: boolean;
  members_alias: string;
  created_at: Date;
  deleted_at?: any;
  owner: IOwner;
  roles: Array<roleChannel>;
  members: IMember[];
  draft_schedule_count?: number;
  unread_chats?: number;
  unread_tasks?: number;
  unread_wiki?: number;
}

export interface IMember {
  id: number;
  email: string;
  full_name: string;
  created_at: Date;
  avatar: IAvatar;
}

export interface calendarNotify {
  done: number;
  indue: number;
  overdue: number;
}

export interface typeNotifyWs {
  calendar: calendarNotify;
  draft: number;
  comment: number;
  unreadTasks: number;
  unreadChats: number;
  unreadWiki: number;
}

export interface IRoleChanel {
  AddOrRemoveUsers: roleChannel;
  creatChat: roleChannel;
  createTask: roleChannel;
  createWiki: roleChannel;
  pinChat: roleChannel;
  pinTask: roleChannel;
}

export interface roleChannel {
  id: number;
  name: string;
  type: TypeFieldEditRole;
}
