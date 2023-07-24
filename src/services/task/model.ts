export interface bodyTask extends bodyUpdateTask {
  channel_id?: string;
  workspace_id?: number;
}

export interface bodyTaskOneToOne extends bodyUpdateTask {
  user_id?: number;
  workspace_id?: number;
}

export interface typeBodyRepeat {
  type: 'NONE' | 'WEEKDAY' | 'WEEKEND' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  end_at: string;
}

export interface bodyUpdateTask {
  content: string;
  due_at: string;
  priority?: string;
  attachment_ids?: Array<string>;
  type: string;
  scheduled_at?: string | null;
  repeat?: typeBodyRepeat;
}

export interface paramsTaskActive {
  page?: number;
  page_size?: number;
  sort_by?: string;
  order_by?: string;
  type?: Array<string> | null;
}

export interface paramsTask extends paramsTaskActive {
  workspace_id?: number;
  channel_id?: number;
  status?: Array<string> | undefined;
  priority?: Array<string> | undefined;
  is_flag?: boolean | Array<string> | undefined | string;
  readTask?: Array<string> | string | undefined;
  is_read?: boolean | undefined;
  is_pin?: boolean | undefined;
  tab?: string | null;
  start_date?: string | undefined;
  end_date?: string | undefined;
}

export interface setFlag {
  task_id: number;
  is_flag: boolean;
}
export interface deleteDraft {
  task_ids: number[];
}

export interface typeMark {
  workspace_id: number;
  channel_id?: number;
  task_ids: Array<number | null>;
}

export interface markReadTask extends typeMark {
  is_read: boolean;
}

export interface markTask extends typeMark {
  type: string;
}

export interface setMuteTask {
  task_id: number;
  is_mute: boolean;
}

export interface bodyPinTask {
  task_id: number;
  channel_id: number;
}

export interface bodyReminder extends bodyPinTask {
  remind_at: string;
}
