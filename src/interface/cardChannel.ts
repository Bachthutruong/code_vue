import { typeBodyRepeat } from 'src/services/task/model';

export interface formChannel {
  id: number;
  statusBackground?: string;
  radio?: string;
  date?: Date;
  content?: string;
  due?: Due;
  priority?: string;
  attachment?: string;
  markDone?: number;
  comment?: number;
  creator?: creator;
  flag?: boolean;
  warning?: boolean;
  doneTask?: boolean;
  reads?: boolean;
  statusTask?: string;
  selected?: boolean;
  channel?: channel;
  action?: string[];
  updated?: string | number;
  due_time?: string;
  is_read?: boolean;
  is_mute?: boolean;
  is_pin?: boolean;
  can_mark?: boolean;
  type?: string;
  other?: any;
  can_access?: boolean;
  attachments?: number;
  typeTask?: string;
  is_activity?: boolean;
  reminder?: TypeReminders;
  repeat?: typeBodyRepeat;
  repeatContent?: string;
}

export interface channel {
  id: number;
  name?: string;
  type?: string;
}

export interface TypeReminders {
  id: number;
  remind_at: string;
}

interface creator {
  id?: number;
  email?: string;
  name?: string;
  full_name?: string;
  avatar?: any;
}
export interface Due {
  status: string;
  date: number | string;
}

export interface Date {
  status: string;
  time: number | string;
}

export const TaskStatusType = {
  OVERDUE: 'basic',
  INDUE: 'success',
  DONE: 'success',
  CANCEL: 'disable',
  DRAFT: 'success',
  SCHEDULE: 'success',
  sent: 'success',
  received: 'basic',
};
