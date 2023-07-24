interface UploadedBy {
  id: number;
  full_name: string;
}

export interface IFileItem {
  id: number;
  originalname: string;
  name: string;
  mimetype: string;
  size: number;
  url: string;
  created_at: Date;
  uploaded_by: UploadedBy;
}

export type TTypeFile =
  | 'Image'
  | 'Zip'
  | 'WinRar'
  | 'WordFile'
  | 'ExcelFile'
  | 'PdfFile'
  | 'AiFile'
  | 'PsFile'
  | 'OtherFile';

export interface IRuleCheckFile {
  typeName: TTypeFile;
  regex: any;
}
