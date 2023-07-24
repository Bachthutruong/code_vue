import { fcmToken } from 'src/services/auth/model';

export interface sendTest extends fcmToken {
  is_background: boolean;
}

export interface paramsNotify {
  page?: number;
  page_size?: number;
  workspace_id: number | string;
  sort_by?: string;
  order_by?: string;
  type?: Array<string> | null;
  //  NEW_TASK, EDIT_TASK, MARK_DONE_TASK, MARK_CANCEL_TASK,
  //  REMIND_DUE_TASK, NEW_COMMENT, REACT_COMMENT,
  //  REPLY_COMMENT, REMOVE_CHANNEL
}
