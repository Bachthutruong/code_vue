export interface paramsCountCalendar {
  workspace_id?: number;
  start_date?: string;
  end_date?: string;
  // OVERDUE, INDUE, DONE
  status?: string[] | string | null;
  // LOW, MEDIUM, HIGH
  priority?: string[] | null;
  is_flag?: boolean | null;
  channel_id?: string | number;
}

export interface paramsCalendar extends paramsCountCalendar {
  page?: number;
  page_size?: number;
}

export interface bodyUpdateSettingCalendar {
  workspace_id: number;
  type: 'PRIVATE' | 'PUBLIC' | 'SPECIFIC';
  member_ids: number[];
}

export interface paramsTimetable {
  workspace_id?: number;
  start_date: string;
  end_date: string;
  // OVERDUE, INDUE, DONE
  status?: string[] | string | null;
  // LOW, MEDIUM, HIGH
  priority?: string[] | null;
  is_flag?: boolean | null;
  search?: string;
  member_id: number;
  year?: string;
}
