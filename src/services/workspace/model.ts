export interface bodyWorkspace {
  name: string;
  description?: string;
  thumbnail_id?: number | null;
}

export interface bodyInviteWorkspace {
  emails: Array<string>;
  workspace_id: number;
}

export interface bodyJoinWorkspace {
  invite_code: string;
}

export interface paramsMember {
  page: number;
  page_size: number;
  sort_by?: string;
  order_by?: string;
  search?: string;
}

export interface bodyDeactivate {
  workspace_id: number;
  user_id: number;
}

export interface bodyRole {
  workspace_id: number;
  member_id: number;
}

export interface changeRoleBody extends bodyRole {
  role: string;
}
