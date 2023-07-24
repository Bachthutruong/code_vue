import { IRuleCheckFile, TTypeFile } from 'src/model/ModelFile';
import fileAi from 'src/assets/files/file_ai.svg';
import fileDocs from 'src/assets/files/file_docs.svg';
import fileExcel from 'src/assets/files/file_excel.svg';
import fileOther from 'src/assets/files/file_other.svg';
import filePdf from 'src/assets/files/file_pdf.svg';
import filePs from 'src/assets/files/file_ps.svg';
import fileZip from 'src/assets/files/file_zip.svg';

export const rulesCheck: IRuleCheckFile[] = [
  {
    typeName: 'Image',
    regex: /(.*?)\.(jpg|bmp|jpeg|png|svg)$/,
  },
  {
    typeName: 'Zip',
    regex: /(.*?)\.(zip)$/,
  },
  {
    typeName: 'WinRar',
    regex: /(.*?)\.(rar)$/,
  },
  {
    typeName: 'WordFile',
    regex: /(.*?)\.(docm|docx|dot|dotx|doc)$/,
  },
  {
    typeName: 'ExcelFile',
    regex: /(.*?)\.(xlsx|xlsm|xls|xlsb|xltx|xltm|xlt|xml|xlam|xla|xlw|xlr)$/,
  },
  {
    typeName: 'PdfFile',
    regex: /(.*?)\.(pdf)$/,
  },
  {
    typeName: 'AiFile',
    regex: /(.*?)\.(ai)$/,
  },
  {
    typeName: 'PsFile',
    regex: /(.*?)\.(psd)$/,
  },
];

export const fileIcon: Record<TTypeFile, string> = {
  Image: '',
  Zip: fileZip,
  WinRar: fileZip,
  WordFile: fileDocs,
  ExcelFile: fileExcel,
  PdfFile: filePdf,
  AiFile: fileAi,
  PsFile: filePs,
  OtherFile: fileOther,
};

export const filename: Record<TTypeFile, string> = {
  Image: 'Image',
  OtherFile: 'File',
  PsFile: 'Photoshop file',
  AiFile: 'Illustrator file',
  PdfFile: 'Pdf file',
  ExcelFile: 'Excel file',
  Zip: 'Zip',
  WordFile: 'Word file',
  WinRar: 'WinRar',
};
