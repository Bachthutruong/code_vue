import { date } from 'quasar';
// import { env } from "../../../../settings.json"

export class Helper {
  isOpenDialog = false;

  getPhoneString(phone) {
    let tempPhone = phone;
    if (phone.length <= 8) {
      tempPhone = `+65${tempPhone}`;
    }
    if (tempPhone.indexOf('+') !== 0) {
      tempPhone = `+${tempPhone}`;
    }
    return tempPhone;
  }

  getMoneyString(value) {
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(value);
  }

  containDuplicate = (arr) => {
    if (!Array.isArray(arr)) return false;

    let distinct = arr.filter((a, b, c) => {
      return c.indexOf(a) === b;
    });
    return arr.length != distinct.length ? true : false;
  };

  formatDate(dateYMD) {
    let newDate = date.extractDate(dateYMD, 'YYYY-MM-DD');
    return date.formatDate(newDate, 'D MMM YYYY');
  }

  formatDateTime(dateYMD) {
    let newDate = date.extractDate(dateYMD, 'YYYY-MM-DD HH:mm:ss');
    return date.formatDate(newDate, 'D MMM YYYY HH:mm');
  }

  getFormatedAddress(address) {
    let res = '';

    let floor = null;
    if (!address.floor_number && address.unit) floor = address.unit;
    else if (address.floor_number && !address.unit)
      floor = `Level ${address.floor_number}`;
    else if (address.floor_number && address.unit)
      floor = `#${address.floor_number}-${address.unit}`;

    res += address.street_number ? ` ${address.street_number},` : '';
    res += address.road ? ` ${address.road},` : '';
    res += floor ? ` ${floor},` : '';
    res += address.building ? ` ${address.building},` : '';
    res += address.stall ? ` ${address.stall},` : '';
    res += address.city ? ` ${address.city},` : '';
    res += address.state ? ` ${address.state},` : '';
    res += address.postal_code ? ` ${address.postal_code}` : '';

    return res;
  }

  exitApp() {
    if (navigator.app && typeof navigator.app.exitApp === 'function') {
      navigator.app.exitApp();
    } else if (
      typeof cordova != 'undefined' &&
      cordova.plugins &&
      typeof cordova.plugins.exit === 'function'
    ) {
      cordova.plugins.exit();
    } else {
      console.log('exitApp not found!');
    }
  }

  /**
   * Find object inside array of object by key and value
   * @param {List<Object>} data
   * @param {String} key
   * @param {Any} value
   */
  findObjectByKey(dataList, key, value) {
    return dataList.find((v) => v[key] == value);
  }
}
