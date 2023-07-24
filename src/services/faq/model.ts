export interface bodyCreateFaq {
  title: string;
  content: string;
}

export interface paramsFaq {
  page: number;
  page_size: number;
  sort_by?: string;
  order_by?: string;
  title?: string;
}

export interface uploadAvatar {
  avatar: FormData;
}
