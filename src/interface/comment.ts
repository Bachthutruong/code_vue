import { IChannel } from 'src/model/ChannelDetail';

export interface formStatus {
  id: number | string;
  type: string;
  channel: IChannel;
  status?: Status;
  comment?: Comment;
  other?: any;
  dateComment: string;
  action?: any;
}

export interface Status {
  user: User;
  content: string;
}

export interface User {
  id?: string | number;
  name: string;
  avatar?: string;
}

export interface Comment {
  user?: User;
  content?: string;
  parent?: Comment;
}

export interface formComment extends Reply {
  children?: Array<Reply>;
}

export interface Like {
  number?: number;
  status?: string;
}

export interface Reply {
  id: number;
  avatar: string;
  name: string;
  tagName?: string;
  content: string;
  time?: any;
  like?: Like;
  showComment?: boolean;
  attachments?: Array<any>;
}
