import { countDescTask } from 'src/constants/ConstantRules';

export const checkEmail = (text: string) => {
  // const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // const re = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return re.test(String(text).toLowerCase());
};

// export const checkDateOfBirth = (text:string) => {
//     const re = /^[0-9]{2}\\[0-9]{2}\\[0-9]{4}$/;
//     return re.test(String(text).toLowerCase());
// }
export const checkAddress = (text: string) => {
  const re = /^[a-zA-Z0-9 \s&.\/\-]{1,200}$/;
  return re.test(String(text));
};

export const checkPhone = (text: string) => {
  // const re = /^[0-9]{1,12}$/;
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return re.test(String(text));
};
//^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
export const checkPassword = (text: string) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(String(text));
};

//LinkedIn URL /Twitter URL /Facebook URL /Instagram URL
export const checkURL = (text: string) => {
  const re =
    /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  return re.test(String(text));
};

export const convertHtmlToString = (text: string) => {
  const re = /\&nbsp;|<\/?[^>]+(>|$)|(<div><br><\/div>)/g;
  const newText = text.replace(/\&nbsp;/g, ' ');
  return newText.replace(re, '').trim();
};

export const checkContenteditable = (text: string) => {
  const convertString = convertHtmlToString(text);
  return convertString.length;
};

export const checkMaxLengthTextDescTask = (text: string) => {
  return checkContenteditable(text) <= countDescTask;
};

export const checkOtpNumber = (text: string) => {
  const re = /^[0-9]$/;
  return re.test(String(text));
};

export const checkNumber = (text: string, length: number) => {
  const re = /^[0-9]{6}$/;
  return re.test(String(text));
};

export const convertHtmlToText = (html: string) => {
  if (!html) return '';
  const textHtml = html.replace(/\<div><br><\/div>/g, '\n \n');
  const parser = new DOMParser();
  const doc = parser.parseFromString(textHtml, 'text/html');

  const text = [];
  const iterator = doc.createNodeIterator(
    doc.body,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
  );

  let node;
  while ((node = iterator.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) {
      text.push(node.textContent);
    } else if (node.nodeName === 'BR') {
      text.push('\n');
    } else {
      text.push(' ');
    }
  }

  return text.join('').trim();
};

export function copyDataToClipboard(text: string) {
  return new Promise((resolve, reject) => {
    navigator.clipboard
      .writeText(text)
      .then(() => resolve(true))
      .catch((err) => reject(err));
  });
}
