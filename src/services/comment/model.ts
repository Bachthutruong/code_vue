export interface bodyComment {
  task_id: number;
  comment_id?: number | null;
  content: string;
  attachment_ids?: Array<string>;
  mention_user_ids?: Array<number> | null;
}

export interface params {
  page: number;
  page_size: number;
  sort_by?: string;
  order_by?: string;
}

export interface paramsComment extends params {
  task_id: number;
}

export interface bodyLike {
  task_id: number;
  comment_id: number;
  emoji: string;
}
