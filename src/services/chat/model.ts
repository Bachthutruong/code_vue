export interface ParamsChat {
  page: number;
  page_size: number;
  workspace_id: number | string;
  channel_id: string | number;
  is_read?: boolean;
  is_pin?: boolean;
  sort_by?: string;
  order_by?: string;
}

export interface ParamsChatV2 {
  page_size: number;
  workspace_id: number | string;
  channel_id: string | number;
  around?: string | number;
  before?: string | number;
  after?: string | number;
}

export interface BodyReadChat {
  workspace_id: number | string;
  channel_id: string | number;
  chat_ids: Array<string | number>;
}
export interface BodyChat {
  channel_id: string | number;
  chat_id?: string | number;
}

export interface BodyReaction extends BodyChat {
  emoji: string;
}
export interface BodyCreateChat extends BodyChat {
  mention_user_ids?: Array<string | number> | null;
  content: string;
  attachment_ids?: Array<string | number> | null;
}

export interface paramsMemberPoll {
  page: number;
  page_size: number;
  channel_id: string | number;
  answer_id: string | number;
}

export interface answer {
  content: string;
}

export interface BodyCreatePoll {
  channel_id: string | number;
  is_pin: boolean;
  title: string;
  answers: Array<answer>;
  due_at?: string;
  is_multi_select: boolean;
}
