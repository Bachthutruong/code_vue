export interface bodyCreateWiki {
  topic: string;
  content: string;
  attachment_ids?: Array<string>;
  type: 'DRAFT' | 'SCHEDULE' | 'IMMEDIATE';
  scheduled_at?: string | null;
  channel_id: string | number;
}

export interface paramsWiki {
  page: number;
  page_size: number;
  workspace_id: number | string;
  channel_id?: number | string;
  type?: Array<'DRAFT' | 'SCHEDULE' | 'IMMEDIATE'>;
  tab?: string | null;
  is_read?: boolean | undefined;
}

export interface paramsWikiActive {
  page?: number;
  page_size?: number;
  sort_by?: string;
  order_by?: string;
  type?: 'DRAFT' | 'SCHEDULE' | 'IMMEDIATE';
}

export interface typeMark {
  workspace_id: number;
  channel_id?: number;
  wiki_ids: number[];
}

export interface markReadWiki extends typeMark {}

export interface deleteDraft {
  wiki_ids: number[];
}
export interface TypePositionsWiki {
  wiki_id: number | string;
  index: number | string;
}

export interface bodyArrange {
  channel_id?: number;
  positions: TypePositionsWiki[];
}

export interface bodySendComment {
  wiki_id: number | string;
  comment_id?: number | string;
  content?: string;
  attachment_ids?: Array<string>;
  mention_user_ids?: Array<string>;
}

export interface paramsCommentWiki {
  page?: number;
  page_size?: number;
  sort_by?: string;
  order_by?: string;
  wiki_id: number | string;
}

export interface bodySendReactComment {
  wiki_id: number | string;
  comment_id?: number | string;
  emoji: string;
}
