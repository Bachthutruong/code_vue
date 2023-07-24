export interface paramsStatics extends paramsMyStatisticWs {
  search?: string;
  sort_by?: string;
  order_by?: string;
  page?: number;
  page_size?: number;
}

export interface paramsMyStatisticWs {
  workspace_id?: string | number;
  start_date?: string;
  end_date?: string;
}

export interface paramsStatisticOverview {
  date?: string;
}
