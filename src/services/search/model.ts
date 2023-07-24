export interface paramSearch extends paramSearchCount {
  page: number;
  page_size: number;
  tab: string;
}

export interface paramSearchCount extends paramSearchRecent {
  keyword: string;
}

export interface paramSearchRecent {
  workspace_id: number;
}

export interface bodyPruneRecent extends paramSearchRecent {
  recent_search_ids: Array<string>;
}
