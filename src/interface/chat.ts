import { User } from 'src/interface/comment';

export interface FormFile {
  id: number | string;
  url: string;
  mimetype: string;
  name?: string;
  originalname?: string;
}

export interface reply {
  id: number | string;
  files?: Array<FormFile>;
  user: User;
  text: string;
  other?: any;
}

export interface DeleteChat {
  isDeleted: boolean;
  user?: User;
  time: string;
}

export interface answerItem {
  id: number | string;
  content: string;
  votes_count: number;
  voted?: boolean;
  created_at?: string;
}

export interface votedItem {
  id: number | string;
  answer: answerItem;
  user?: User;
}

export interface TypePollVote {
  id: number | string;
  title: string;
  answers: Array<answerItem>;
  votes: Array<votedItem>;
  memberCount: number;
  multiSelected: boolean;
  closePoll: boolean;
  dueDate: string;
}
export interface formChat {
  id: string | number;
  user: User;
  chat: Chat;
  reply?: reply;
  files?: Array<FormFile>;
  pinChat: boolean;
  readChat?: boolean;
  editChat?: boolean;
  editor?: User;
  deleteChat?: DeleteChat;
  other?: any;
  reactions?: any;
  isActivity?: boolean;
  type?: 'dateTime' | 'message' | 'pinTask' | 'pollVote' | 'JOIN';
  isPoll?: boolean;
  pollVote?: TypePollVote;
  typePoll?: string;
  menu?: any;
}

export interface Chat {
  typeChat: 'sent' | 'received';
  statusChat: 'normal' | 'reply' | 'forward';
  time: string | number;
  text: string;
  readAll?: boolean;
}
