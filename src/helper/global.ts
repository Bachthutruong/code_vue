import { date } from 'quasar';
import { IFileItem, TTypeFile } from 'src/model/ModelFile';
import { fileIcon, rulesCheck } from 'src/constants/ConstantFile';
import { TypeMessageGlobal, TypeRuleMessage } from 'src/model/Global';
import { i18n } from 'boot/i18n';
import FileService from 'src/services/file';

const { addToDate } = date;
import {
  getStartOfMonth,
  getEndOfMonth,
  parseTimestamp,
} from '@quasar/quasar-ui-qcalendar';

export const getItem = (
  array: Array<any>,
  key: string,
  value: any,
  objectDefault: object,
) => {
  // array data
  // key de check
  // value de check
  // objectDefault neu ko tim duoc ket qua se lay object nay de return
  const filtered = array.find((item) => item[key] === value);
  return filtered ? filtered : objectDefault || array[0];
};

export const checkData = (object: object | any, listKey?: Array<string>) => {
  // object de check data
  // listKey 1 array chua cac key de check data
  let check = false;
  let returnCheck = false;
  if (listKey) {
    listKey.forEach((key) => {
      if (!returnCheck) {
        check = !!object[key];
      }
      returnCheck = !check;
    });
  } else {
    for (const key in object) {
      if (!returnCheck) {
        check = !!object[key];
      }
      returnCheck = !check;
    }
  }
  return check;
};

export const checkObjectIsNotDefine = (object: object | any, listKey?: Array<string>) => {
  // object de check data
  // listKey 1 array chua cac key de check data
  let check = false;
  let returnCheck = false;
  if (listKey) {
    listKey.forEach((key) => {
      if (!returnCheck) {
        check = !!object[key];
      }
      returnCheck = check;
    });
  } else {
    for (const key in object) {
      if (!returnCheck) {
        check = !!object[key];
      }
      returnCheck = check;
    }
  }
  return check;
};

const colors = ['#0078F0', '#FFAC14', '#6342FF', '#2EB553', '#FF5151', '#1ABBC1'];

function hashCode(s: string) {
  let h: any;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;

  return h;
}

export const genColor = (id: string) => {
  if (!id) return { bgColor: colors[2], textColor: 'white' };
  const code = Math.abs(hashCode(id) % colors.length);
  const color = colors[code];
  // const textColor = chroma.contrast(color, 'white') > 2 ? 'white' : '#1A2948'
  const textColor = color;
  const bgColor = color + '22';
  return { bgColor, textColor };
};

export const formatDateToIosString = (dateTime: any) => {
  if (!dateTime) return '';
  const event = new Date(dateTime);
  return event?.toISOString() || '';
};

export const formatIosStringToDate = (IosString: string) => {
  if (!IosString) return '';
  return date.formatDate(IosString, 'YYYY/MM/DD hh:mm A') || '';
};

export const formatDateDisplay = (
  ISODate: string | Date | undefined,
  format = 'MMM, Do YYYY',
) => {
  if (!ISODate) return '';
  return date.formatDate(ISODate, format);
};

export const checkFileType = (file: IFileItem) => {
  const result: {
    type: TTypeFile;
    image: string;
  } = {
    type: 'OtherFile',
    image: fileIcon.OtherFile,
  };
  const conditionCompare = file.originalname || file.name;
  for (let i = 0; i < rulesCheck.length; i++) {
    const checkItem = rulesCheck[i];

    if (conditionCompare.match(checkItem.regex)) {
      result.type = checkItem.typeName;
      if (result.type === 'Image') {
        result.image = file?.url || fileIcon.OtherFile;
        break;
      }
      result.image = fileIcon[result.type];
    }
  }

  return result;
};

export const mapI18nRule = (
  path: TypeRuleMessage,
  params: (string | number)[] = [],
): string => {
  // return '';
  return i18n.global.t(`global.rulesMessage.${path}`, params);
};

export const mapI18nMessage = (
  message: TypeMessageGlobal,
  params: (string | number)[] = [],
) => {
  // return '';
  return i18n.global.t(`global.messages.${message}`, params);
};

export const toUpperCaseNonAccentVietnamese = (str: string, lowCase?: boolean) => {
  str = str.toLowerCase();
  //     We can also use this instead of from line 11 to line 17
  //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
  //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
  //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
  //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
  //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  //     str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return lowCase ? str : str.toUpperCase();
};

export const convertArrayToString = (arrayData: any, key: string) => {
  if (arrayData && !arrayData.length) return '';
  let stringConvert = '';
  arrayData.forEach((item: any, index: number) => {
    stringConvert = `${stringConvert + item[key]}${index > 0 ? ',' : ''}`;
  });
  return stringConvert || '';
};

export const checkDue = (dueDate: string | number, units?: string, newDate?: any) => {
  const unit = units || 'days';
  const diff = date.getDateDiff(dueDate, newDate || new Date(), unit);
  return diff;
};

export const showCheckDue = (dueDate: string | number, units?: string) => {
  const day = Math.abs(checkDue(dueDate, 'days'));
  const hour = Math.abs(checkDue(dueDate, 'hours'));
  const minute = Math.abs(checkDue(dueDate, 'minutes'));
  if (day > 0) {
    return `${day} ${i18n.global.t('global.days')}`;
  }
  if (hour > 0) {
    return `${hour} ${i18n.global.t('global.hours')}`;
  }
  if (minute > 0) {
    return `${minute} ${i18n.global.t('global.minutes')}`;
  }
  return `0 ${i18n.global.t('global.minutes')}`;
};

export const capitalizeFirstLetter = (string: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
};

export const checkBottomTyping = (id: string) => {
  const element = document.getElementById(id);
  let checkIsAtBottom = false;
  if (element) {
    element.addEventListener('input', function (event: any) {
      checkIsAtBottom =
        event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    });
  }
  return checkIsAtBottom;
};

export function useMouse(e: string) {
  const element = document.getElementById(e) as any;
  setTimeout(() => {
    // element?.
    element.scrollTop = element.scrollHeight;
    element?.focus();
    // @ts-ignore
    window?.getSelection()?.selectAllChildren(element);
    // @ts-ignore
    window?.getSelection()?.collapseToEnd();
  }, 1);
}

export const countDownDateString = (_dateString: string) => {
  const minutes = 60;
  const hours = 60 * 60;
  const days = 60 * 60 * 24;

  // date : MM/DD/YYYY
  const now = Math.floor(new Date().getTime() / 1000);
  const end = Math.floor(new Date(_dateString).getTime() / 1000);
  const sub = now - end;
  if (sub < minutes) {
    return 'Just finished';
  }
  if (sub < hours) {
    const _minutes = Math.floor(sub / minutes);
    return `${_minutes} minutes ago`;
  }
  if (sub < days) {
    const _hours = Math.floor(sub / hours);
    return `${_hours} hours ago`;
  }
  if (sub > days) {
    const _days = Math.floor(sub / days);
    return `${_days} days ago`;
  }
  // return convertDateString(_dateString);
  return _dateString;
};

export function getTimeDifference(dateTime: any) {
  const now = new Date();
  const targetDate = new Date(dateTime);
  const difference = now.getTime() - targetDate.getTime();
  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return `${weeks}w`;
  } else if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return 'just now';
  }
}

export function optionsFn(dateTime: any) {
  return dateTime >= date.formatDate(addToDate(new Date(), { days: 0 }), 'YYYY/MM/DD');
}

// export const getInfoElement = () => {
//
// }

export const checkScrollShow = (id: string) => {
  const element = document.getElementById(id) as any;
  if (element) {
    return element.scrollHeight > element.clientHeight;
  }
};

export const scrollToBottom = (id: string) => {
  const element = document.getElementById(id) as any;
  if (element) {
    element.scrollTop = element.scrollHeight + element.clientHeight;
    element.style.opacity = 1;
  }
};

export const scrollToId = (id: string) => {
  const element = document.getElementById(id) as any;
  console.log('scrollToId', id, element);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }
};
export const scrollTopId = (id: string) => {
  const element = document.getElementById(id) as any;
  console.log('scrollTopId', id, element);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
};

export const scrollToBottomId = (id: string) => {
  const element = document.getElementById(id) as any;
  console.log('scrollToBottomId', id, element);
  if (element) {
    element.scrollIntoView(false);
  }
};

export const showElement = (id: string) => {
  const element = document.getElementById(id) as any;
  if (element) {
    element.style.opacity = 1;
  }
};
export const focusToId = (id: string) => {
  const element = document.getElementById(id) as any;
  element.classList.add('focusDiv');
};

interface fileTypeDownload {
  url?: string;
  name?: string;
  originalname?: string;
  id: string;
}

export const downloadFileUrl = (file: fileTypeDownload) => {
  const { name, originalname, id } = file;
  // if (id) {
  FileService.downloadFile(id).then((res: any) => {
    console.log(res);
    if (res) {
      const objectUrl = URL.createObjectURL(res);
      const link = document.createElement('a');
      link.target = '_blank';
      link.download = name || originalname || 'file';
      link.href = objectUrl;
      // link.addEventListener('click',() => {window.open(url,'_blank')})
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
  // return
  // }
  // const link = document.createElement("a");
  // link.target = '_blank'
  // link.download = filename;
  // link.href = url;
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};

export const sortByCreateTime = (array: Array<any>) => {
  return array.sort((a, b) => {
    return (
      Number(formatDateDisplay(b.created_at, 'x')) -
      Number(formatDateDisplay(a.created_at, 'x'))
    );
  });
};

export const sortByKey = (array: Array<any>, key: string) => {
  return array.sort((a, b) => {
    return Number(b[key]) - Number(a[key]);
  });
};

export const maxCount = (count: string | number) => {
  if (!count) return '0';
  if (Number(count) > 99) {
    return '99+';
  }
  return count;
};

export const getStartOfMonthByDate = (datetime: string) => {
  const timeStampObj = parseTimestamp(datetime) as any;
  return getStartOfMonth(timeStampObj);
};
export const getEndOfMonthByDate = (datetime: string) => {
  const timeStampObj = parseTimestamp(datetime) as any;
  return getEndOfMonth(timeStampObj);
};

export const validate = (myForm: any) => {
  return new Promise((resolve, reject) => {
    myForm
      .validate()
      .then((success: any) => {
        resolve(!!success);
      })
      .catch(() => {
        reject(false);
      });
  });
};
export const resetValidation = (myForm: any) => {
  if (!myForm) return;
  myForm.resetValidation();
};

type Procedure = (...args: any[]) => void;
let timeoutId = null as any;
export const debounceCustom = (callback: any, delay: number) => {
  console.log('timeoutId', timeoutId);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    callback();
  }, delay);
};
