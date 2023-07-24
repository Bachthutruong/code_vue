export interface formNotify {
  id?: string;
  title: Title;
  content: string;
  show: boolean;
  action?: any;
  type: string;
  other: any;
}

export interface Title {
  firstContent: string;
  name: string;
  lastContent?: string;
  project: string;
  date?: string;
}
