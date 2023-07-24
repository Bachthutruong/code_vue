export interface bodyChannel {
  name: string;
  description?: string;
  is_private: boolean;
  workspace_id: number | string;
  member_ids?: string[];
}

export interface bodyUpdateChannel {
  name?: string;
  description?: string;
  topic?: string;
}

export interface paramsFiles {
  page: number;
  page_size: number;
  sort_by?: string;
  order_by?: string;
}

export interface paramsMember extends paramsFiles {
  search?: string;
}

export interface channelId {
  channel_id: string | number;
}

export interface bodyMuteChannel extends channelId {
  is_mute: boolean;
}

export interface bodyAddMember extends channelId {
  member_ids: Array<string | number>;
}

export interface bodyCreateOneToOne {
  workspace_id: number | string;
  user_id: number | string;
}

export interface paramsComment extends paramsFiles {
  task_id: number;
}

export interface bodySetRole {
  type: string;
  member_ids: Array<string | number>;
}

export interface TypePositionsChannel {
  channel_id: number | string;
  index: number | string;
}

export interface bodyArrangeChannel {
  workspace_id?: number;
  positions: TypePositionsChannel[];
}
